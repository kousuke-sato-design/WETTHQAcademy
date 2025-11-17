<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// 基本情報
	let title = data.content.title;
	let description = data.content.description || '';
	let category = data.content.category || '';
	let order = data.content.order.toString();

	// セクションタイプ
	type SectionType = 'text' | 'attachment' | 'video';

	type Section = {
		type: SectionType;
		title: string;
		content: string;
		order: number;
	};

	// 既存データから初期化
	let sections: Section[] = [];
	if (data.sections && data.sections.length > 0) {
		sections = data.sections.map((s: any, index: number) => {
			// sectionType, section_type, または type から取得（後方互換性のため）
			const sectionType = s.sectionType || s.section_type || s.type || 'text';

			// itemsから適切な形式に変換
			let content = '';
			if (Array.isArray(s.items) && s.items.length > 0) {
				if (s.items[0].type === 'video') {
					content = s.items[0].content || '';
				} else if (s.items[0].type === 'text') {
					content = s.items.map((item: any) => item.content).join('\n\n');
				} else {
					content = s.items[0].content || '';
				}
			}

			return {
				type: (sectionType === 'video' ? 'video' : sectionType === 'attachment' ? 'attachment' : 'text') as SectionType,
				title: s.title || '',
				content: content,
				order: index
			};
		});
	}

	// 基本情報のみリアクティブに更新（セクションは保持）
	$: {
		title = data.content.title;
		description = data.content.description || '';
		category = data.content.category || '';
		order = data.content.order.toString();
	}

	// セクションを追加
	function addSection(type: SectionType) {
		sections = [...sections, {
			type,
			title: '',
			content: '',
			order: sections.length
		}];
		console.log('=== SECTION ADDED ===');
		console.log('Sections count:', sections.length);
		console.log('Sections:', sections);
	}

	// セクションを削除
	function removeSection(index: number) {
		sections = sections.filter((_, i) => i !== index);
		// 順序を再調整
		sections = sections.map((s, i) => ({ ...s, order: i }));
	}

	// セクションを上に移動
	function moveSectionUp(index: number) {
		if (index === 0) return;
		[sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
		[sectionToggles[index - 1], sectionToggles[index]] = [sectionToggles[index], sectionToggles[index - 1]];
		sections = sections.map((s, i) => ({ ...s, order: i }));
		sectionToggles = [...sectionToggles];
	}

	// セクションを下に移動
	function moveSectionDown(index: number) {
		if (index === sections.length - 1) return;
		[sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
		[sectionToggles[index], sectionToggles[index + 1]] = [sectionToggles[index + 1], sectionToggles[index]];
		sections = sections.map((s, i) => ({ ...s, order: i }));
		sectionToggles = [...sectionToggles];
	}

	// セクションタイプの日本語表示
	function getSectionTypeLabel(type: SectionType): string {
		switch (type) {
			case 'text': return 'HTMLテキスト';
			case 'attachment': return 'Google Drive添付';
			case 'video': return '動画URL';
		}
	}

	// セクションタイプの色
	function getSectionTypeColor(type: SectionType): string {
		switch (type) {
			case 'text': return 'bg-blue-100 text-blue-800 border-blue-300';
			case 'attachment': return 'bg-green-100 text-green-800 border-green-300';
			case 'video': return 'bg-purple-100 text-purple-800 border-purple-300';
		}
	}

	// 動画URLを埋め込み形式に変換
	function convertToEmbedUrl(url: string): string {
		if (!url) return '';

		// YouTube URL変換
		const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
		if (youtubeMatch) {
			return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
		}

		// Vimeo URL変換
		const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
		if (vimeoMatch) {
			return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
		}

		return url;
	}

	// 保存時にデータベース形式に変換
	function prepareSectionsForSave() {
		return sections.map(section => {
			let items = [];
			if (section.type === 'text') {
				// HTMLテキストを段落に分割
				const paragraphs = section.content.split('\n\n').filter(p => p.trim());
				items = paragraphs.map(p => ({ type: 'text', content: p }));
			} else if (section.type === 'video') {
				items = [{ type: 'video', content: section.content }];
			} else if (section.type === 'attachment') {
				items = [{ type: 'attachment', content: section.content }];
			}

			return {
				title: section.title,
				sectionType: section.type,
				items: items,
				order: section.order
			};
		});
	}

	// トグル状態
	let basicInfoOpen = true;
	let sectionToggles: boolean[] = sections.map(() => true); // 各セクションの開閉状態

	// セクション追加時にトグル状態も追加
	function addSectionWithToggle(type: SectionType) {
		addSection(type);
		sectionToggles = [...sectionToggles, true];
	}

	// セクション削除時にトグル状態も削除
	function removeSectionWithToggle(index: number) {
		removeSection(index);
		sectionToggles = sectionToggles.filter((_, i) => i !== index);
	}

	// セクションデータをリアクティブに JSON 文字列化
	let sectionsJsonValue = '';
	$: {
		const prepared = prepareSectionsForSave();
		sectionsJsonValue = JSON.stringify(prepared);
		console.log('=== REACTIVE UPDATE ===');
		console.log('Sections count:', sections.length);
		console.log('Prepared sections:', prepared);
		console.log('JSON value:', sectionsJsonValue);
	}

	// フォーム送信処理
	function handleSubmit() {
		return async ({ result }: any) => {
			console.log('=== FORM SUBMISSION ===');
			console.log('Sections JSON being submitted:', sectionsJsonValue);

			// update()を呼ばない - セクションデータを保持する

			console.log('=== FORM RESULT ===');
			console.log('Result type:', result.type);
			console.log('Result data:', result.data);

			if (result.type === 'success') {
				alert('保存しました！');
			} else if (result.type === 'failure') {
				alert('保存に失敗しました: ' + (result.data?.error || 'エラー'));
			}
		};
	}
</script>

<svelte:head>
	<title>コンテンツ編集 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user} contents={data.contents}>
	<div class="max-w-7xl mx-auto">
		<!-- ヘッダー -->
		<div class="mb-8">
			<div class="flex items-center space-x-4 mb-4">
				<a href="/admin/contents" class="text-blue-600 hover:text-blue-700 font-medium">
					← コンテンツ一覧に戻る
				</a>
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">コンテンツ編集</h1>
			<p class="text-gray-600">セクションを追加してコンテンツを作成します</p>
		</div>

		<!-- 成功メッセージ -->
		{#if form?.success}
			<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
				<p class="text-green-800 font-medium">{form.message}</p>
			</div>
		{/if}

		<!-- エラーメッセージ -->
		{#if form?.error}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-red-800 font-medium">{form.error}</p>
			</div>
		{/if}

		<!-- 2カラムレイアウト -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- 左側: 編集フォーム -->
			<div class="space-y-6">
				<form method="POST" use:enhance={handleSubmit} class="space-y-6">
					<!-- セクションデータ（リアクティブに更新） -->
					<input type="hidden" name="sections" bind:value={sectionsJsonValue} />

					<!-- 基本情報 (折りたたみ可能) -->
					<div class="bg-white rounded-lg shadow-sm border border-gray-200">
						<button
							type="button"
							on:click={() => basicInfoOpen = !basicInfoOpen}
							class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
						>
							<h2 class="text-lg font-semibold text-gray-900">基本情報</h2>
							<svg
								class="w-5 h-5 text-gray-600 transition-transform {basicInfoOpen ? 'rotate-180' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						{#if basicInfoOpen}
							<div class="px-6 pb-6 border-t border-gray-200">
								<div class="space-y-4 mt-4">
									<!-- タイトル -->
									<div>
								<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
									タイトル <span class="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="title"
									name="title"
									bind:value={title}
									required
									placeholder="例: JavaScript入門"
									class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>

							<!-- 説明 -->
							<div>
								<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
									説明
								</label>
								<textarea
									id="description"
									name="description"
									bind:value={description}
									rows="2"
									placeholder="コンテンツの説明"
									class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								></textarea>
							</div>

							<!-- カテゴリと表示順序 -->
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="category" class="block text-sm font-medium text-gray-700 mb-2">
										カテゴリ
									</label>
									<input
										type="text"
										id="category"
										name="category"
										bind:value={category}
										placeholder="例: 基礎"
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								<div>
									<label for="order" class="block text-sm font-medium text-gray-700 mb-2">
										表示順序
									</label>
									<input
										type="number"
										id="order"
										name="order"
										bind:value={order}
										min="0"
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
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
									<!-- セクションヘッダー -->
									<div class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg">
										<button
											type="button"
											on:click={() => sectionToggles[index] = !sectionToggles[index]}
											class="flex items-center space-x-3 flex-1 text-left"
										>
											<span class="px-3 py-1 {getSectionTypeColor(section.type)} text-sm font-semibold rounded-full">
												{getSectionTypeLabel(section.type)}
											</span>
											<span class="text-gray-700 font-medium">
												{section.title || '（タイトル未設定）'}
											</span>
											<svg
												class="w-5 h-5 text-gray-600 transition-transform {sectionToggles[index] ? 'rotate-180' : ''}"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
											</svg>
										</button>
										<div class="flex items-center space-x-2">
											<button
												type="button"
												on:click={() => moveSectionUp(index)}
												disabled={index === 0}
												class="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
												title="上に移動"
											>
												↑
											</button>
											<button
												type="button"
												on:click={() => moveSectionDown(index)}
												disabled={index === sections.length - 1}
												class="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
												title="下に移動"
											>
												↓
											</button>
											<button
												type="button"
												on:click={() => removeSectionWithToggle(index)}
												class="px-2 py-1 text-red-600 hover:text-red-800 font-bold"
												title="削除"
											>
												✕
											</button>
										</div>
									</div>

									<!-- セクションコンテンツ（折りたたみ可能） -->
									{#if sectionToggles[index]}
										<div class="px-4 pb-4 border-t border-gray-200">
											<!-- タイトル -->
											<div class="mb-3 mt-4">
												<label class="block text-sm font-medium text-gray-700 mb-1">
													セクションタイトル
												</label>
												<input
													type="text"
													bind:value={section.title}
													placeholder="セクションのタイトル（任意）"
													class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
												/>
											</div>

											<!-- コンテンツ -->
											<div>
												<label class="block text-sm font-medium text-gray-700 mb-1">
													{#if section.type === 'text'}
														HTMLテキスト
													{:else if section.type === 'attachment'}
														Google DriveのURL
													{:else}
														動画URL (YouTube/Vimeo)
													{/if}
												</label>
												{#if section.type === 'text'}
													<textarea
														bind:value={section.content}
														rows="6"
														placeholder="HTMLやテキストを入力してください"
														class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-white"
													></textarea>
												{:else}
													<input
														type="text"
														bind:value={section.content}
														placeholder={section.type === 'attachment' ? 'https://drive.google.com/file/d/...' : 'https://www.youtube.com/watch?v=...'}
														class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
													/>
												{/if}
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					<!-- セクション追加ボタン -->
					<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">セクション追加</h2>

						<div class="grid grid-cols-3 gap-3">
							<button
								type="button"
								on:click={() => addSectionWithToggle('text')}
								class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
							>
								HTMLテキスト
							</button>
							<button
								type="button"
								on:click={() => addSectionWithToggle('attachment')}
								class="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
							>
								Google Drive添付
							</button>
							<button
								type="button"
								on:click={() => addSectionWithToggle('video')}
								class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
							>
								動画URL
							</button>
						</div>
					</div>

					<!-- 保存ボタン -->
					<div class="flex items-center justify-end space-x-3 pt-6">
						<a
							href="/admin/contents"
							class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
						>
							キャンセル
						</a>
						<button
							type="submit"
							class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
						>
							保存する
						</button>
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

					<!-- プレビューコンテンツ -->
					<div class="bg-white rounded-lg border border-gray-300 overflow-hidden">
						<div class="max-w-4xl mx-auto p-6">
							<!-- コンテンツヘッダー -->
							<div class="mb-6">
								<h1 class="text-3xl font-bold text-gray-900 mb-4">{title || '（タイトル未設定）'}</h1>

								{#if category}
									<div class="mb-4">
										<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
											{category}
										</span>
									</div>
								{/if}

								{#if description}
									<p class="text-gray-600 text-base leading-relaxed">{description}</p>
								{/if}
							</div>

							<!-- セクションコンテンツ -->
							{#if sections.length === 0}
								<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
									<p class="text-yellow-800 text-sm">セクションがありません</p>
								</div>
							{:else}
								<div class="space-y-10">
									{#each sections as section}
										<div class="space-y-4">
											{#if section.title}
												<h2 class="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">{section.title}</h2>
											{/if}

											{#if section.type === 'text' && section.content}
												<div class="prose max-w-none">
													{@html section.content}
												</div>
											{:else if section.type === 'video' && section.content}
												<div class="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
													<iframe
														src={convertToEmbedUrl(section.content)}
														class="w-full h-full"
														frameborder="0"
														allowfullscreen
														title="Video content"
													></iframe>
												</div>
											{:else if section.type === 'attachment' && section.content}
												<div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
													<a
														href={section.content}
														target="_blank"
														rel="noopener noreferrer"
														class="flex items-center space-x-3 text-blue-600 hover:text-blue-700"
													>
														<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
														</svg>
														<span class="font-medium">添付ファイルを開く</span>
													</a>
												</div>
											{/if}
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
</Layout>
