<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// 基本情報
	let title = data.content.title;
	let description = data.content.description || '';
	let category = data.content.category || '';
	let order = data.content.order.toString();

	// セクションタイプ
	type SectionType = 'text' | 'attachment' | 'video' | 'r2_video';

	type Section = {
		type: SectionType;
		title: string;
		content: string;
		order: number;
		uploading?: boolean;
		uploadProgress?: number;
	};

	// R2バケット内の動画一覧
	type R2Video = {
		key: string;
		size: number;
		uploaded: string;
		extension: string;
	};

	let availableVideos: R2Video[] = [];
	let loadingVideos = false;

	// 既存データから初期化
	let sections: Section[] = [];
	if (data.sections && data.sections.length > 0) {
		sections = data.sections.map((s: any, index: number) => {
			const sectionType = s.sectionType || s.section_type || s.type || 'text';
			let content = '';
			if (Array.isArray(s.items) && s.items.length > 0) {
				if (s.items[0].type === 'video' || s.items[0].type === 'r2_video') {
					content = s.items[0].content || '';
				} else if (s.items[0].type === 'text') {
					content = s.items.map((item: any) => item.content).join('\n\n');
				} else {
					content = s.items[0].content || '';
				}
			}
			return {
				type: (sectionType === 'video' ? 'video' : sectionType === 'r2_video' ? 'r2_video' : sectionType === 'attachment' ? 'attachment' : 'text') as SectionType,
				title: s.title || '',
				content: content,
				order: index
			};
		});
	}

	// data変更時の初期化は初回のみ
	let initialized = false;
	$: if (!initialized && data.content) {
		title = data.content.title;
		description = data.content.description || '';
		category = data.content.category || '';
		order = data.content.order.toString();
		initialized = true;
	}

	function addSection(type: SectionType) {
		sections = [...sections, { type, title: '', content: '', order: sections.length }];
	}

	function removeSection(index: number) {
		sections = sections.filter((_, i) => i !== index);
		sections = sections.map((s, i) => ({ ...s, order: i }));
	}

	function moveSectionUp(index: number) {
		if (index === 0) return;
		[sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
		[sectionToggles[index - 1], sectionToggles[index]] = [sectionToggles[index], sectionToggles[index - 1]];
		sections = sections.map((s, i) => ({ ...s, order: i }));
		sectionToggles = [...sectionToggles];
	}

	function moveSectionDown(index: number) {
		if (index === sections.length - 1) return;
		[sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
		[sectionToggles[index], sectionToggles[index + 1]] = [sectionToggles[index + 1], sectionToggles[index]];
		sections = sections.map((s, i) => ({ ...s, order: i }));
		sectionToggles = [...sectionToggles];
	}

	function getSectionTypeLabel(type: SectionType): string {
		switch (type) {
			case 'text': return 'HTMLテキスト';
			case 'attachment': return 'Google Drive添付';
			case 'video': return '動画URL';
			case 'r2_video': return 'R2動画';
		}
	}

	function getSectionTypeColor(type: SectionType): string {
		switch (type) {
			case 'text': return 'bg-blue-100 text-blue-800 border-blue-300';
			case 'attachment': return 'bg-green-100 text-green-800 border-green-300';
			case 'video': return 'bg-purple-100 text-purple-800 border-purple-300';
			case 'r2_video': return 'bg-orange-100 text-orange-800 border-orange-300';
		}
	}

	function convertToEmbedUrl(url: string): string {
		if (!url) return '';
		const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
		if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
		const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
		if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
		return url;
	}

	function prepareSectionsForSave() {
		return sections.map(section => {
			let items = [];
			if (section.type === 'text') {
				const paragraphs = section.content.split('\n\n').filter(p => p.trim());
				items = paragraphs.map(p => ({ type: 'text', content: p }));
			} else if (section.type === 'video') {
				items = [{ type: 'video', content: section.content }];
			} else if (section.type === 'r2_video') {
				items = [{ type: 'r2_video', content: section.content }];
			} else if (section.type === 'attachment') {
				items = [{ type: 'attachment', content: section.content }];
			}
			return { title: section.title, sectionType: section.type, items: items, order: section.order };
		});
	}

	let basicInfoOpen = true;
	let sectionToggles: boolean[] = sections.map(() => true);

	function addSectionWithToggle(type: SectionType) {
		addSection(type);
		sectionToggles = [...sectionToggles, true];
	}

	function removeSectionWithToggle(index: number) {
		removeSection(index);
		sectionToggles = sectionToggles.filter((_, i) => i !== index);
	}

	let sectionsJsonValue = '';
	$: {
		const prepared = prepareSectionsForSave();
		sectionsJsonValue = JSON.stringify(prepared);
	}

	function handleSubmit() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				alert('保存しました！');
				// ページをリロードせず、現在の状態を維持
			} else if (result.type === 'failure') {
				alert('保存に失敗しました: ' + (result.data?.error || 'エラー'));
			}
			// update()を呼ばないことでページのリロードを防ぐ
		};
	}

	async function fetchAvailableVideos() {
		loadingVideos = true;
		try {
			const response = await fetch('/api/videos/list');
			const result = await response.json();
			if (result.success) {
				availableVideos = result.videos;
			} else {
				alert('動画一覧の取得に失敗しました');
			}
		} catch (error) {
			alert('動画一覧の取得に失敗しました');
		} finally {
			loadingVideos = false;
		}
	}

	function handleVideoUpload(event: Event, sectionIndex: number) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const MAX_SIZE = 100 * 1024 * 1024;
		if (file.size > MAX_SIZE) {
			alert('ファイルサイズが大きすぎます（最大100MB）');
			input.value = '';
			return;
		}

		sections[sectionIndex].uploading = true;
		sections[sectionIndex].uploadProgress = 0;
		sections = [...sections];

		const formData = new FormData();
		formData.append('file', file);

		const xhr = new XMLHttpRequest();

		xhr.upload.addEventListener('progress', (e) => {
			if (e.lengthComputable) {
				sections[sectionIndex].uploadProgress = Math.round((e.loaded / e.total) * 100);
				sections = [...sections];
			}
		});

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				try {
					const result = JSON.parse(xhr.responseText);
					sections[sectionIndex].content = result.fileName;
					sections[sectionIndex].uploading = false;
					sections = [...sections];
					alert(`動画をアップロードしました: ${file.name}`);
				} catch (error) {
					sections[sectionIndex].uploading = false;
					sections = [...sections];
				}
			} else {
				alert(`アップロードに失敗しました: ${xhr.status}`);
				sections[sectionIndex].uploading = false;
				sections = [...sections];
			}
		});

		xhr.addEventListener('error', () => {
			alert('ネットワークエラーが発生しました');
			sections[sectionIndex].uploading = false;
			sections = [...sections];
		});

		xhr.open('POST', '/api/upload/video');
		xhr.timeout = 300000;
		xhr.send(formData);
		input.value = '';
	}

	let editingSection: { index: number; content: string } | null = null;
	let editorContent = '';
	let activeTab: 'code' | 'visual' = 'visual';

	function openEditor(index: number) {
		editingSection = { index, content: sections[index].content };
		editorContent = sections[index].content;
		activeTab = 'visual';
		// ビジュアルエディタの初期化を遅延実行
		setTimeout(() => {
			const editor = document.getElementById('visualEditor');
			if (editor) {
				editor.innerHTML = editorContent;
			}
		}, 0);
	}

	// ビジュアルエディタの入力処理
	function handleVisualInput(e: Event) {
		const target = e.currentTarget as HTMLDivElement;
		if (target) {
			editorContent = target.innerHTML;
		}
	}

	// 選択範囲を保持する変数
	let savedRange: Range | null = null;

	// 選択範囲を保存
	function saveSelection() {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			savedRange = selection.getRangeAt(0).cloneRange();
		}
	}

	// 選択範囲を復元
	function restoreSelection() {
		if (savedRange) {
			const selection = window.getSelection();
			if (selection) {
				selection.removeAllRanges();
				selection.addRange(savedRange);
			}
		}
	}

	function closeEditor() {
		editingSection = null;
		editorContent = '';
	}

	function saveEditor() {
		if (editingSection !== null) {
			sections[editingSection.index].content = editorContent;
			sections = [...sections];
			closeEditor();
		}
	}

	function insertHTML(tag: string, value: string = '') {
		// ビジュアルモードの場合
		if (activeTab === 'visual') {
			const editor = document.getElementById('visualEditor');
			if (!editor) return;

			// 保存された選択範囲を復元
			restoreSelection();

			const selection = window.getSelection();
			const selectedText = savedRange ? savedRange.toString() : (selection?.toString() || '');
			let insertion = '';

			switch (tag) {
				case 'bold': insertion = `<strong>${selectedText || '太字テキスト'}</strong>`; break;
				case 'italic': insertion = `<em>${selectedText || '斜体テキスト'}</em>`; break;
				case 'h2': insertion = `<h2>${selectedText || '見出し2'}</h2>`; break;
				case 'h3': insertion = `<h3>${selectedText || '見出し3'}</h3>`; break;
				case 'ul': insertion = `<ul><li>${selectedText || 'リスト項目'}</li></ul>`; break;
				case 'ol': insertion = `<ol><li>${selectedText || 'リスト項目'}</li></ol>`; break;
				case 'color': insertion = `<span style="color: ${value};">${selectedText || 'カラーテキスト'}</span>`; break;
				case 'bgcolor': insertion = `<span style="background-color: ${value};">${selectedText || 'マーカーテキスト'}</span>`; break;
				case 'emoji': insertion = value; break;
				case 'br': insertion = '<br>'; break;
			}

			editor.focus();
			const range = savedRange || (selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null);
			if (range) {
				range.deleteContents();
				const fragment = range.createContextualFragment(insertion);
				range.insertNode(fragment);
				range.collapse(false);
				if (selection) {
					selection.removeAllRanges();
					selection.addRange(range);
				}
			} else {
				editor.innerHTML += insertion;
			}
			editorContent = editor.innerHTML;
			savedRange = null;
			return;
		}

		// コードモードの場合
		const textarea = document.getElementById('richTextArea') as HTMLTextAreaElement;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = editorContent.substring(start, end);
		let insertion = '';

		switch (tag) {
			case 'bold': insertion = `<strong>${selectedText || '太字テキスト'}</strong>`; break;
			case 'italic': insertion = `<em>${selectedText || '斜体テキスト'}</em>`; break;
			case 'h2': insertion = `<h2>${selectedText || '見出し2'}</h2>\n`; break;
			case 'h3': insertion = `<h3>${selectedText || '見出し3'}</h3>\n`; break;
			case 'ul': insertion = `<ul>\n  <li>${selectedText || 'リスト項目'}</li>\n</ul>\n`; break;
			case 'ol': insertion = `<ol>\n  <li>${selectedText || 'リスト項目'}</li>\n</ol>\n`; break;
			case 'color': insertion = `<span style="color: ${value};">${selectedText || 'カラーテキスト'}</span>`; break;
			case 'bgcolor': insertion = `<span style="background-color: ${value};">${selectedText || 'マーカーテキスト'}</span>`; break;
			case 'emoji': insertion = value; break;
			case 'br': insertion = '\n'; break;
		}

		editorContent = editorContent.substring(0, start) + insertion + editorContent.substring(end);
		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(start + insertion.length, start + insertion.length);
		}, 0);
	}

	const emojiList = ['📋', '✅', '❌', '💡', '📢', '⚠️', '🎓', '📱', '🚀', '📞', '🎯', '✨', '📅', '🔔', '📊', '💪', '🌟', '🎬', '📎', '🔗', '📝', '🎨', '💼', '🏆', '⭐', '🌈'];

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>コンテンツ編集 - 専用コンテンツ - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-7xl mx-auto">
		<!-- パンくずナビ -->
		<div class="mb-4">
			<a href="/company/company-contents" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
				<div class="w-4 h-4 mr-1">
					{@html getIconSVG('back')}
				</div>
				専用コンテンツ一覧に戻る
			</a>
		</div>

		<!-- ヘッダー -->
		<div class="mb-8">
			<div class="flex items-center space-x-2 mb-2">
				{#if data.company}
					<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
						{data.company.company_name}専用
					</span>
				{/if}
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">コンテンツ編集</h1>
			<p class="text-gray-600">セクションを追加してコンテンツを作成します</p>
		</div>

		{#if form?.success}
			<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
				<p class="text-green-800 font-medium">{form.message}</p>
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-red-800 font-medium">{form.error}</p>
			</div>
		{/if}

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- 左側: 編集フォーム -->
			<div class="space-y-6">
				<form method="POST" use:enhance={handleSubmit} class="space-y-6">
					<input type="hidden" name="sections" bind:value={sectionsJsonValue} />

					<!-- 基本情報 -->
					<div class="bg-white rounded-lg shadow-sm border border-gray-200">
						<button
							type="button"
							on:click={() => basicInfoOpen = !basicInfoOpen}
							class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
						>
							<h2 class="text-lg font-semibold text-gray-900">基本情報</h2>
							<svg class="w-5 h-5 text-gray-600 transition-transform {basicInfoOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						{#if basicInfoOpen}
							<div class="px-6 pb-6 border-t border-gray-200">
								<div class="space-y-4 mt-4">
									<div>
										<label for="title" class="block text-sm font-medium text-gray-700 mb-2">タイトル <span class="text-red-500">*</span></label>
										<input type="text" id="title" name="title" bind:value={title} required placeholder="例: 社内研修ガイド" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
									</div>
									<div>
										<label for="description" class="block text-sm font-medium text-gray-700 mb-2">説明</label>
										<textarea id="description" name="description" bind:value={description} rows="2" placeholder="コンテンツの説明" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
									</div>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="category" class="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
											<input type="text" id="category" name="category" bind:value={category} placeholder="例: 社内研修" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
										</div>
										<div>
											<label for="order" class="block text-sm font-medium text-gray-700 mb-2">表示順序</label>
											<input type="number" id="order" name="order" bind:value={order} min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- セクション一覧 -->
					{#if sections.length > 0}
						<div class="space-y-4">
							<h2 class="text-lg font-semibold text-gray-900">セクション一覧</h2>
							{#each sections as section, index}
								<div class="bg-white rounded-lg shadow-sm border-2 {getSectionTypeColor(section.type)}">
									<div class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg">
										<button type="button" on:click={() => sectionToggles[index] = !sectionToggles[index]} class="flex items-center space-x-3 flex-1 text-left">
											<span class="px-3 py-1 {getSectionTypeColor(section.type)} text-sm font-semibold rounded-full">{getSectionTypeLabel(section.type)}</span>
											<span class="text-gray-700 font-medium">{section.title || '（タイトル未設定）'}</span>
											<svg class="w-5 h-5 text-gray-600 transition-transform {sectionToggles[index] ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
											</svg>
										</button>
										<div class="flex items-center space-x-2">
											<button type="button" on:click={() => moveSectionUp(index)} disabled={index === 0} class="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 font-bold" title="上に移動">↑</button>
											<button type="button" on:click={() => moveSectionDown(index)} disabled={index === sections.length - 1} class="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 font-bold" title="下に移動">↓</button>
											<button type="button" on:click={() => removeSectionWithToggle(index)} class="px-2 py-1 text-red-600 hover:text-red-800 font-bold" title="削除">✕</button>
										</div>
									</div>

									{#if sectionToggles[index]}
										<div class="px-4 pb-4 border-t border-gray-200">
											<div class="mb-3 mt-4">
												<label class="block text-sm font-medium text-gray-700 mb-1">セクションタイトル</label>
												<input type="text" bind:value={section.title} placeholder="セクションのタイトル（任意）" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white" />
											</div>
											<div>
												<label class="block text-sm font-medium text-gray-700 mb-1">
													{#if section.type === 'text'}HTMLテキスト{:else if section.type === 'attachment'}Google DriveのURL{:else if section.type === 'video'}動画URL{:else if section.type === 'r2_video'}R2動画{/if}
												</label>
												{#if section.type === 'text'}
													<button type="button" on:click={() => openEditor(index)} class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center space-x-2">
														<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
														<span>HTMLエディタを開く</span>
													</button>
													{#if section.content}
														<div class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
															<p class="text-xs text-gray-600 mb-1">プレビュー:</p>
															<div class="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">{@html section.content}</div>
														</div>
													{/if}
												{:else if section.type === 'r2_video'}
													<div class="space-y-3">
														{#if section.uploading}
															<div class="border-2 border-orange-300 rounded-lg p-6 bg-orange-50">
																<div class="space-y-3">
																	<div class="flex items-center justify-center space-x-2">
																		<svg class="w-6 h-6 text-orange-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
																		<span class="text-sm font-medium text-orange-800">アップロード中... {section.uploadProgress || 0}%</span>
																	</div>
																	<div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
																		<div class="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-300 ease-out" style="width: {section.uploadProgress || 0}%"></div>
																	</div>
																</div>
															</div>
														{:else if !section.content}
															<div class="space-y-3">
																{#if availableVideos.length === 0}
																	<button type="button" on:click={fetchAvailableVideos} disabled={loadingVideos} class="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium disabled:opacity-50">{loadingVideos ? '読み込み中...' : '既存動画を表示'}</button>
																{:else}
																	<div class="space-y-2">
																		<label class="block text-sm font-medium text-gray-700">既存動画を選択</label>
																		<select on:change={(e) => { const target = e.target as HTMLSelectElement; if (target.value) { sections[index].content = target.value; sections = [...sections]; } }} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
																			<option value="">動画を選択してください</option>
																			{#each availableVideos as video}<option value={video.key}>{video.key} ({(video.size / 1024 / 1024).toFixed(2)}MB)</option>{/each}
																		</select>
																	</div>
																{/if}
																<div class="relative">
																	<div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300"></div></div>
																	<div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">または</span></div>
																</div>
																<div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
																	<input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" on:change={(e) => handleVideoUpload(e, index)} class="hidden" id="video-upload-{index}" />
																	<label for="video-upload-{index}" class="cursor-pointer flex flex-col items-center space-y-2">
																		<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
																		<span class="text-sm font-medium text-gray-700">新しい動画をアップロード</span>
																		<span class="text-xs text-gray-500">mp4, webm, ogg, mov (最大100MB)</span>
																	</label>
																</div>
															</div>
														{:else}
															<div class="bg-green-50 border border-green-200 rounded-lg p-4">
																<div class="flex items-center justify-between">
																	<div class="flex items-center space-x-2">
																		<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
																		<span class="text-sm font-medium text-green-800">選択済み: {section.content}</span>
																	</div>
																	<button type="button" on:click={() => { sections[index].content = ''; sections = [...sections]; }} class="text-red-600 hover:text-red-800 text-sm font-medium">削除</button>
																</div>
															</div>
														{/if}
													</div>
												{:else}
													<input type="text" bind:value={section.content} placeholder={section.type === 'attachment' ? 'https://drive.google.com/file/d/...' : 'https://www.youtube.com/watch?v=...'} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white" />
												{/if}
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					<!-- セクション追加 -->
					<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">セクション追加</h2>
						<div class="grid grid-cols-2 gap-3">
							<button type="button" on:click={() => addSectionWithToggle('text')} class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">HTMLテキスト</button>
							<button type="button" on:click={() => addSectionWithToggle('attachment')} class="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">Google Drive添付</button>
							<button type="button" on:click={() => addSectionWithToggle('video')} class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">動画URL</button>
							<button type="button" on:click={() => addSectionWithToggle('r2_video')} class="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors">R2動画</button>
						</div>
					</div>

					<div class="flex items-center justify-end space-x-3 pt-6">
						<a href="/company/company-contents" class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">キャンセル</a>
						<button type="submit" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm">保存する</button>
					</div>
				</form>
			</div>

			<!-- 右側: プレビュー -->
			<div class="lg:sticky lg:top-6 lg:self-start">
				<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900">プレビュー</h2>
						<span class="text-xs text-gray-500">ユーザー表示</span>
					</div>
					<div class="bg-white rounded-lg border border-gray-300 overflow-hidden">
						<div class="max-w-4xl mx-auto p-6">
							<div class="mb-6">
								<h1 class="text-3xl font-bold text-gray-900 mb-4">{title || '（タイトル未設定）'}</h1>
								{#if category}
									<div class="mb-4"><span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">{category}</span></div>
								{/if}
								{#if description}<p class="text-gray-600 text-base leading-relaxed">{description}</p>{/if}
							</div>
							{#if sections.length === 0}
								<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><p class="text-yellow-800 text-sm">セクションがありません</p></div>
							{:else}
								<div class="space-y-10">
									{#each sections as section}
										<div class="space-y-4">
											{#if section.title}<h2 class="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">{section.title}</h2>{/if}
											{#if section.type === 'text' && section.content}<div class="prose max-w-none whitespace-pre-wrap">{@html section.content}</div>
											{:else if section.type === 'video' && section.content}<div class="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm"><iframe src={convertToEmbedUrl(section.content)} class="w-full h-full" frameborder="0" allowfullscreen title="Video"></iframe></div>
											{:else if section.type === 'r2_video' && section.content}<div class="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm"><video controls class="w-full h-full" preload="none" playsinline><source src="/api/video/{section.content}" type="video/mp4" /></video></div>
											{:else if section.type === 'attachment' && section.content}<div class="border border-gray-300 rounded-lg p-4 bg-gray-50"><a href={section.content} target="_blank" rel="noopener noreferrer" class="flex items-center space-x-3 text-green-600 hover:text-green-700"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><span class="font-medium">添付ファイルを開く</span></a></div>{/if}
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- エディタモーダル -->
	{#if editingSection !== null}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
				<div class="px-6 py-4 border-b border-gray-200">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-xl font-bold text-gray-900">HTMLエディタ</h3>
						<button type="button" on:click={closeEditor} class="text-gray-400 hover:text-gray-600 transition-colors" aria-label="閉じる">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
						</button>
					</div>
					<div class="flex space-x-2">
						<button type="button" on:click={() => activeTab = 'visual'} class="px-4 py-2 rounded-t-lg font-medium transition-colors {activeTab === 'visual' ? 'bg-white text-green-600 border-b-2 border-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">ビジュアル編集</button>
						<button type="button" on:click={() => activeTab = 'code'} class="px-4 py-2 rounded-t-lg font-medium transition-colors {activeTab === 'code' ? 'bg-white text-green-600 border-b-2 border-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">HTMLコード</button>
					</div>
				</div>
				<div class="px-6 py-3 border-b border-gray-200 bg-gray-50">
					<div class="flex flex-wrap gap-2">
						<div class="flex items-center space-x-1 border-r border-gray-300 pr-2">
							<button type="button" on:click={() => insertHTML('bold')} class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors font-bold text-sm" title="太字"><strong>太字</strong></button>
							<button type="button" on:click={() => insertHTML('italic')} class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors italic text-sm" title="斜体"><em>斜体</em></button>
						</div>
						<div class="flex items-center space-x-1 border-r border-gray-300 pr-2">
							<button type="button" on:click={() => insertHTML('h2')} class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors font-bold text-sm" title="見出し2">H2</button>
							<button type="button" on:click={() => insertHTML('h3')} class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors font-bold text-sm" title="見出し3">H3</button>
						</div>
						<div class="flex items-center space-x-1 border-r border-gray-300 pr-2">
							<button type="button" on:click={() => insertHTML('ul')} class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm" title="箇条書き">• リスト</button>
							<button type="button" on:click={() => insertHTML('ol')} class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm" title="番号付き">1. リスト</button>
						</div>
						<div class="flex items-center space-x-1 border-r border-gray-300 pr-2">
							<button type="button" on:click={() => insertHTML('color', '#FF0000')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="赤色"><span class="font-bold text-sm" style="color: #FF0000;">A</span></button>
							<button type="button" on:click={() => insertHTML('color', '#0000FF')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="青色"><span class="font-bold text-sm" style="color: #0000FF;">A</span></button>
							<button type="button" on:click={() => insertHTML('color', '#008000')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="緑色"><span class="font-bold text-sm" style="color: #008000;">A</span></button>
							<button type="button" on:click={() => insertHTML('color', '#374151')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="黒色"><span class="font-bold text-sm" style="color: #374151;">A</span></button>
							<button type="button" on:click={() => insertHTML('color', '#EA580C')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="オレンジ"><span class="font-bold text-sm" style="color: #EA580C;">A</span></button>
							<button type="button" on:click={() => insertHTML('color', '#7C3AED')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="紫色"><span class="font-bold text-sm" style="color: #7C3AED;">A</span></button>
						</div>
						<div class="flex items-center space-x-1 border-r border-gray-300 pr-2">
							<button type="button" on:click={() => insertHTML('bgcolor', '#FFFF00')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="黄色マーカー"><span class="font-bold text-sm px-1" style="background-color: #FFFF00;">A</span></button>
							<button type="button" on:click={() => insertHTML('bgcolor', '#FFB6C1')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="ピンクマーカー"><span class="font-bold text-sm px-1" style="background-color: #FFB6C1;">A</span></button>
							<button type="button" on:click={() => insertHTML('bgcolor', '#90EE90')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="緑マーカー"><span class="font-bold text-sm px-1" style="background-color: #90EE90;">A</span></button>
							<button type="button" on:click={() => insertHTML('bgcolor', '#BFDBFE')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="青マーカー"><span class="font-bold text-sm px-1" style="background-color: #BFDBFE;">A</span></button>
							<button type="button" on:click={() => insertHTML('bgcolor', '#FED7AA')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="オレンジマーカー"><span class="font-bold text-sm px-1" style="background-color: #FED7AA;">A</span></button>
							<button type="button" on:click={() => insertHTML('bgcolor', '#DDD6FE')} class="px-2 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors" title="紫マーカー"><span class="font-bold text-sm px-1" style="background-color: #DDD6FE;">A</span></button>
						</div>
						<button type="button" on:click={() => insertHTML('br')} class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm" title="改行">改行</button>
					</div>
					<div class="mt-2 pt-2 border-t border-gray-200">
						<p class="text-xs text-gray-600 mb-1">絵文字:</p>
						<div class="flex flex-wrap gap-1">
							{#each emojiList as emoji}<button type="button" on:click={() => insertHTML('emoji', emoji)} class="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors text-lg" title="絵文字">{emoji}</button>{/each}
						</div>
					</div>
				</div>
				<div class="flex-1 p-6 overflow-auto">
					{#if activeTab === 'visual'}
						<div id="visualEditor" contenteditable="true" on:input={handleVisualInput} on:blur={handleVisualInput} on:mouseup={saveSelection} on:keyup={saveSelection} class="w-full h-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white prose max-w-none" style="min-height: 400px; outline: none;">{@html editorContent}</div>
					{:else}
						<textarea id="richTextArea" bind:value={editorContent} rows="20" placeholder="HTMLやテキストを入力してください..." class="w-full h-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm resize-none"></textarea>
					{/if}
				</div>
				<div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
					<p class="text-sm text-gray-600">選択したテキストに書式を適用できます</p>
					<div class="flex items-center space-x-3">
						<button type="button" on:click={closeEditor} class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">キャンセル</button>
						<button type="button" on:click={saveEditor} class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm">保存</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</Layout>
