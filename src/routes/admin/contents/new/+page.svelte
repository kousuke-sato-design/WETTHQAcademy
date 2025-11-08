<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// 基本情報
	let title = '';
	let description = '';
	let category = '';
	let order = '0';
	let showInSidebar = true;
	let sidebarIcon = 'document';
	let sidebarOrder = '0';

	// セクション管理（大きな区分）
	type SectionItem = {
		id: string;
		type: 'heading' | 'text' | 'video' | 'image';
		content: string;
	};

	type Section = {
		id: string;
		sectionType: 'introduction' | 'text' | 'video' | 'image' | 'attachment';
		title: string;
		items: SectionItem[];
		order: number;
	};

	// サンプルテンプレートを初期表示
	let sections: Section[] = [
		{
			id: crypto.randomUUID(),
			sectionType: 'introduction',
			title: '導入',
			items: [
				{ id: crypto.randomUUID(), type: 'heading', content: 'このコンテンツについて' },
				{ id: crypto.randomUUID(), type: 'text', content: 'このコンテンツの概要や目的を説明してください' }
			],
			order: 0
		},
		{
			id: crypto.randomUUID(),
			sectionType: 'text',
			title: '本文',
			items: [
				{ id: crypto.randomUUID(), type: 'heading', content: 'セクション1' },
				{ id: crypto.randomUUID(), type: 'text', content: '本文の内容をここに入力してください' }
			],
			order: 1
		},
		{
			id: crypto.randomUUID(),
			sectionType: 'video',
			title: '動画解説',
			items: [
				{ id: crypto.randomUUID(), type: 'heading', content: '動画で学ぶ' },
				{ id: crypto.randomUUID(), type: 'text', content: '動画の説明をここに入力してください' },
				{ id: crypto.randomUUID(), type: 'video', content: '' }
			],
			order: 2
		}
	];

	// セクションテンプレート
	const sectionTemplates: Record<Section['sectionType'], { label: string; icon: string; description: string }> = {
		introduction: { label: '導入', icon: 'introduction', description: 'セクションの概要' },
		text: { label: 'テキスト', icon: 'text', description: '文章コンテンツ' },
		video: { label: '動画', icon: 'video', description: '動画コンテンツ' },
		image: { label: '画像', icon: 'image', description: '画像コンテンツ' },
		attachment: { label: '添付', icon: 'attachment', description: 'ファイル・資料' }
	};

	function addSectionFromTemplate(sectionType: Section['sectionType']) {
		const templates: Record<Section['sectionType'], Omit<Section, 'id' | 'order'>> = {
			introduction: {
				sectionType: 'introduction',
				title: '導入',
				items: [
					{ id: crypto.randomUUID(), type: 'heading', content: 'このセクションについて' },
					{ id: crypto.randomUUID(), type: 'text', content: 'セクションの概要や目的を説明してください' }
				]
			},
			text: {
				sectionType: 'text',
				title: 'テキストセクション',
				items: [
					{ id: crypto.randomUUID(), type: 'heading', content: '見出し' },
					{ id: crypto.randomUUID(), type: 'text', content: '本文をここに入力してください' }
				]
			},
			video: {
				sectionType: 'video',
				title: '動画',
				items: [
					{ id: crypto.randomUUID(), type: 'heading', content: '動画タイトル' },
					{ id: crypto.randomUUID(), type: 'text', content: '動画の説明をここに入力してください' },
					{ id: crypto.randomUUID(), type: 'video', content: '' }
				]
			},
			image: {
				sectionType: 'image',
				title: '画像',
				items: [
					{ id: crypto.randomUUID(), type: 'heading', content: '画像タイトル' },
					{ id: crypto.randomUUID(), type: 'image', content: '' },
					{ id: crypto.randomUUID(), type: 'text', content: '画像の説明' }
				]
			},
			attachment: {
				sectionType: 'attachment',
				title: '添付資料',
				items: [
					{ id: crypto.randomUUID(), type: 'heading', content: '資料タイトル' },
					{ id: crypto.randomUUID(), type: 'text', content: 'ファイル名: \nURL: \n説明: ' }
				]
			}
		};

		const template = templates[sectionType];
		const newSection: Section = {
			id: crypto.randomUUID(),
			...template,
			order: sections.length
		};
		sections = [...sections, newSection];
	}

	function addItemToSection(sectionId: string, itemType: SectionItem['type']) {
		sections = sections.map(section => {
			if (section.id === sectionId) {
				return {
					...section,
					items: [...section.items, { id: crypto.randomUUID(), type: itemType, content: '' }]
				};
			}
			return section;
		});
	}

	function removeItemFromSection(sectionId: string, itemId: string) {
		sections = sections.map(section => {
			if (section.id === sectionId) {
				return {
					...section,
					items: section.items.filter(item => item.id !== itemId)
				};
			}
			return section;
		});
	}

	function removeSection(id: string) {
		sections = sections.filter(s => s.id !== id);
		sections = sections.map((s, index) => ({ ...s, order: index }));
	}

	function moveSectionUp(index: number) {
		if (index === 0) return;
		const newSections = [...sections];
		[newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
		sections = newSections.map((s, i) => ({ ...s, order: i }));
	}

	function moveSectionDown(index: number) {
		if (index === sections.length - 1) return;
		const newSections = [...sections];
		[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
		sections = newSections.map((s, i) => ({ ...s, order: i }));
	}

	function getIcon(iconName: string) {
		const icons: Record<string, string> = {
			arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
			introduction: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
			video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
			text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
			image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
			attachment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
			plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
			trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
			arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
			arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
			heading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4v16M18 4v16M8 12h8"/></svg>',
			save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>'
		};
		return icons[iconName] || '';
	}

	function getSectionTypeColor(sectionType: Section['sectionType']) {
		const colors = {
			introduction: 'bg-blue-100 text-blue-800 border-blue-200',
			text: 'bg-gray-100 text-gray-800 border-gray-200',
			video: 'bg-purple-100 text-purple-800 border-purple-200',
			image: 'bg-pink-100 text-pink-800 border-pink-200',
			attachment: 'bg-green-100 text-green-800 border-green-200'
		};
		return colors[sectionType];
	}

	// トグル状態の管理
	let expandedSections: Set<string> = new Set();

	function toggleSection(sectionId: string) {
		if (expandedSections.has(sectionId)) {
			expandedSections.delete(sectionId);
		} else {
			expandedSections.add(sectionId);
		}
		expandedSections = expandedSections;
	}

	// フォーム送信
	let formElement: HTMLFormElement;

	function handleSave() {
		if (formElement) {
			formElement.requestSubmit();
		}
	}

	// 動画アップロード
	let uploadingVideos: Record<string, boolean> = {};

	async function handleVideoUpload(sectionId: string, itemId: string, event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		const uploadKey = `${sectionId}-${itemId}`;
		uploadingVideos[uploadKey] = true;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/upload-video', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				// アップロード成功：URLをセクションアイテムに設定
				sections = sections.map(section => {
					if (section.id === sectionId) {
						return {
							...section,
							items: section.items.map(item => {
								if (item.id === itemId) {
									return { ...item, content: result.url };
								}
								return item;
							})
						};
					}
					return section;
				});
			} else {
				alert(result.error || 'アップロードに失敗しました');
			}
		} catch (error) {
			console.error('Upload error:', error);
			alert('アップロードに失敗しました');
		} finally {
			uploadingVideos[uploadKey] = false;
			uploadingVideos = uploadingVideos;
		}
	}
</script>

<svelte:head>
	<title>新規コンテンツ作成 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-full px-6">
		<!-- ヘッダー -->
		<div class="mb-6">
			<a href="/admin/contents" class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4">
				<div class="w-4 h-4 mr-2">{@html getIcon('arrowLeft')}</div>
				コンテンツ管理に戻る
			</a>
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 mb-2">新規コンテンツ作成</h1>
					<p class="text-gray-600">テンプレートからセクションを追加して、右側でプレビューを確認できます</p>
				</div>
				<div class="flex items-center space-x-3">
					<button
						type="button"
						on:click={() => {
							sections = [
								{
									id: crypto.randomUUID(),
									sectionType: 'introduction',
									title: '導入',
									items: [
										{ id: crypto.randomUUID(), type: 'heading', content: 'このコンテンツについて' },
										{ id: crypto.randomUUID(), type: 'text', content: 'このコンテンツの概要や目的を説明してください' }
									],
									order: 0
								},
								{
									id: crypto.randomUUID(),
									sectionType: 'text',
									title: '本文',
									items: [
										{ id: crypto.randomUUID(), type: 'heading', content: 'セクション1' },
										{ id: crypto.randomUUID(), type: 'text', content: '本文の内容をここに入力してください' }
									],
									order: 1
								},
								{
									id: crypto.randomUUID(),
									sectionType: 'video',
									title: '動画解説',
									items: [
										{ id: crypto.randomUUID(), type: 'heading', content: '動画で学ぶ' },
										{ id: crypto.randomUUID(), type: 'text', content: '動画の説明をここに入力してください' },
										{ id: crypto.randomUUID(), type: 'video', content: '' }
									],
									order: 2
								}
							];
						}}
						class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						初期化
					</button>
					<button
						type="button"
						on:click={handleSave}
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex items-center transition-colors"
					>
						<div class="w-4 h-4 mr-2">{@html getIcon('save')}</div>
						保存する
					</button>
				</div>
			</div>
		</div>

		{#if form?.error}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
				<div class="w-5 h-5 mr-3 text-red-600">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<line x1="15" y1="9" x2="9" y2="15"/>
						<line x1="9" y1="9" x2="15" y2="15"/>
					</svg>
				</div>
				<p class="text-red-800 font-medium">{form.error}</p>
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
				<div class="w-5 h-5 mr-3 text-green-600">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
						<polyline points="22 4 12 14.01 9 11.01"/>
					</svg>
				</div>
				<p class="text-green-800 font-medium">{form.message}</p>
			</div>
		{/if}

		<form method="POST" use:enhance bind:this={formElement}>
			<!-- 基本情報（1カラム・横長） -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
				<h2 class="text-xl font-bold text-gray-900 mb-6">基本情報</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label for="category" class="block text-sm font-medium text-gray-700 mb-2">
							カテゴリ
						</label>
						<input
							type="text"
							id="category"
							name="category"
							bind:value={category}
							placeholder="例: プログラミング基礎"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>

				<div class="mt-6">
					<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
						説明
					</label>
					<textarea
						id="description"
						name="description"
						bind:value={description}
						rows="2"
						placeholder="コンテンツの説明を入力"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					></textarea>
				</div>

				<!-- サイドバー設定 -->
				<div class="mt-6 pt-6 border-t border-gray-200">
					<h3 class="text-lg font-semibold text-gray-900 mb-4">サイドバー設定</h3>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div class="flex items-center">
							<input
								type="checkbox"
								id="showInSidebar"
								name="showInSidebar"
								bind:checked={showInSidebar}
								class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label for="showInSidebar" class="ml-2 text-sm font-medium text-gray-700">
								サイドバーに表示する
							</label>
						</div>

						<div>
							<label for="sidebarIcon" class="block text-sm font-medium text-gray-700 mb-2">
								アイコン
							</label>
							<select
								id="sidebarIcon"
								name="sidebarIcon"
								bind:value={sidebarIcon}
								disabled={!showInSidebar}
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
							>
								<option value="document">ドキュメント</option>
								<option value="books">本</option>
								<option value="video">動画</option>
								<option value="image">画像</option>
								<option value="text">テキスト</option>
								<option value="home">ホーム</option>
							</select>
						</div>

						<div>
							<label for="sidebarOrder" class="block text-sm font-medium text-gray-700 mb-2">
								サイドバー表示順序
							</label>
							<input
								type="number"
								id="sidebarOrder"
								name="sidebarOrder"
								bind:value={sidebarOrder}
								min="0"
								disabled={!showInSidebar}
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- 2カラムレイアウト: 左側にセクション編集、右側にプレビュー -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- 左カラム: セクション一覧とテンプレート -->
				<div class="space-y-6">
					<!-- セクション一覧（追加済み） -->
					{#if sections.length > 0}
						<div class="space-y-3">
							{#each sections as section, index}
								<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
									<!-- トグルヘッダー -->
									<button
										type="button"
										on:click={() => toggleSection(section.id)}
										class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
									>
										<div class="flex items-center space-x-3">
											<span class="px-3 py-1 text-sm font-medium rounded-full {getSectionTypeColor(section.sectionType)}">
												{sectionTemplates[section.sectionType].label}
											</span>
											<span class="font-medium text-gray-900">{section.title}</span>
											<span class="text-sm text-gray-500">セクション {index + 1}</span>
										</div>
										<div class="flex items-center space-x-2">
											<div class="w-5 h-5 text-gray-400 transform transition-transform {expandedSections.has(section.id) ? 'rotate-180' : ''}">
												{@html getIcon('arrowDown')}
											</div>
										</div>
									</button>

									<!-- トグルコンテンツ -->
									{#if expandedSections.has(section.id)}
										<div class="px-4 pb-4 border-t border-gray-200">
											<div class="pt-4 flex items-center justify-end space-x-2 mb-4">
												<button
													type="button"
													on:click={() => moveSectionUp(index)}
													disabled={index === 0}
													class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30"
												>
													<div class="w-5 h-5">{@html getIcon('arrowUp')}</div>
												</button>
												<button
													type="button"
													on:click={() => moveSectionDown(index)}
													disabled={index === sections.length - 1}
													class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30"
												>
													<div class="w-5 h-5">{@html getIcon('arrowDown')}</div>
												</button>
												<button
													type="button"
													on:click={() => removeSection(section.id)}
													class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
												>
													<div class="w-5 h-5">{@html getIcon('trash')}</div>
												</button>
											</div>

											<div class="mb-4">
												<label class="block text-sm font-medium text-gray-700 mb-2">セクションタイトル</label>
												<input
													type="text"
													bind:value={section.title}
													class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
												/>
											</div>

											<div class="space-y-3">
												{#each section.items as item}
													<div class="flex items-start space-x-2">
														<div class="flex-1">
															{#if item.type === 'heading'}
																<input
																	type="text"
																	bind:value={item.content}
																	placeholder="見出し"
																	class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold"
																/>
															{:else if item.type === 'text'}
																<textarea
																	bind:value={item.content}
																	rows="3"
																	placeholder="テキスト"
																	class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
																></textarea>
															{:else if item.type === 'video'}
																<div class="space-y-2">
																	<input
																		type="url"
																		bind:value={item.content}
																		placeholder="動画URL（または下からファイルをアップロード）"
																		class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
																	/>
																	<div class="flex items-center space-x-2">
																		<label class="flex-1 cursor-pointer">
																			<input
																				type="file"
																				accept="video/mp4,video/webm,video/ogg"
																				on:change={(e) => handleVideoUpload(section.id, item.id, e)}
																				class="hidden"
																			/>
																			<div class="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 text-center">
																				{uploadingVideos[`${section.id}-${item.id}`] ? 'アップロード中...' : '動画ファイルを選択'}
																			</div>
																		</label>
																	</div>
																</div>
															{:else if item.type === 'image'}
																<input
																	type="url"
																	bind:value={item.content}
																	placeholder="画像URL"
																	class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
																/>
															{/if}
														</div>
														<button
															type="button"
															on:click={() => removeItemFromSection(section.id, item.id)}
															class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
														>
															<div class="w-4 h-4">{@html getIcon('trash')}</div>
														</button>
													</div>
												{/each}
											</div>

											<div class="mt-4 flex space-x-2">
												<button type="button" on:click={() => addItemToSection(section.id, 'heading')} class="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">+ 見出し</button>
												<button type="button" on:click={() => addItemToSection(section.id, 'text')} class="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">+ テキスト</button>
												<button type="button" on:click={() => addItemToSection(section.id, 'video')} class="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">+ 動画</button>
												<button type="button" on:click={() => addItemToSection(section.id, 'image')} class="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">+ 画像</button>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					<!-- セクションテンプレート -->
					<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 class="text-xl font-bold text-gray-900 mb-4">セクションテンプレート</h2>
						<p class="text-sm text-gray-600 mb-4">クリックしてセクションを追加</p>
						<div class="grid grid-cols-2 gap-3">
							{#each Object.entries(sectionTemplates) as [key, template]}
								<button
									type="button"
									on:click={() => addSectionFromTemplate(key as Section['sectionType'])}
									class="flex flex-col items-center justify-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
								>
									<div class="w-8 h-8 text-gray-600 mb-2">
										{@html getIcon(template.icon)}
									</div>
									<span class="font-medium text-gray-900 text-sm">{template.label}</span>
									<span class="text-xs text-gray-500 mt-1">{template.description}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- 右カラム: プレビュー -->
				<div class="lg:sticky lg:top-6 lg:self-start">
					<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 class="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">プレビュー</h2>

						{#if title}
							<h1 class="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
						{:else}
							<h1 class="text-3xl font-bold text-gray-400 mb-4">タイトルを入力してください</h1>
						{/if}

						{#if category}
							<div class="mb-4">
								<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{category}</span>
							</div>
						{/if}

						{#if description}
							<p class="text-gray-600 mb-8 pb-8 border-b">{description}</p>
						{/if}

						{#if sections.length === 0}
							<div class="text-center py-12">
								<p class="text-gray-500">テンプレートからセクションを追加してください</p>
							</div>
						{:else}
							<div class="space-y-8">
								{#each sections as section}
									<div class="border-l-4 pl-4 {getSectionTypeColor(section.sectionType).replace('bg-', 'border-').replace('-100', '-500')}">
										<h2 class="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
										<div class="space-y-4">
											{#each section.items as item}
												{#if item.type === 'heading'}
													<h3 class="text-xl font-semibold text-gray-800">{item.content || '見出し'}</h3>
												{:else if item.type === 'text'}
													<p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.content || 'テキスト'}</p>
												{:else if item.type === 'video' && item.content}
													<div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
														<iframe src={item.content} class="w-full h-full" frameborder="0" allowfullscreen></iframe>
													</div>
												{:else if item.type === 'image' && item.content}
													<img src={item.content} alt="" class="w-full rounded-lg shadow-sm" />
												{/if}
											{/each}
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>

			<input type="hidden" name="sections" value={JSON.stringify(sections)} />
		</form>
	</div>
</Layout>
