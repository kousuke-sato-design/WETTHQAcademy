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

	// セクションデータ（既存データから初期化）
	type Item = {
		type: 'heading' | 'text' | 'video' | 'image';
		content: string;
	};

	type Section = {
		title: string;
		sectionType: string;
		items: Item[];
		order: number;
	};

	let sections: Section[] = data.sections.map((s: any) => ({
		title: s.title || '',
		sectionType: s.section_type || 'text',
		items: Array.isArray(s.items) ? s.items : [],
		order: s.order || 0
	}));

	// セクションを追加
	function addSection() {
		sections = [...sections, {
			title: '',
			sectionType: 'text',
			items: [],
			order: sections.length
		}];
	}

	// セクションを削除
	function removeSection(index: number) {
		sections = sections.filter((_, i) => i !== index);
		// 順序を再調整
		sections = sections.map((s, i) => ({ ...s, order: i }));
	}

	// セクション内にアイテムを追加
	function addItem(sectionIndex: number, itemType: 'heading' | 'text' | 'video' | 'image') {
		sections[sectionIndex].items = [...sections[sectionIndex].items, {
			type: itemType,
			content: ''
		}];
		sections = sections;
	}

	// アイテムを削除
	function removeItem(sectionIndex: number, itemIndex: number) {
		sections[sectionIndex].items = sections[sectionIndex].items.filter((_, i) => i !== itemIndex);
		sections = sections;
	}

	// セクションを上に移動
	function moveSectionUp(index: number) {
		if (index === 0) return;
		[sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
		sections = sections.map((s, i) => ({ ...s, order: i }));
	}

	// セクションを下に移動
	function moveSectionDown(index: number) {
		if (index === sections.length - 1) return;
		[sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
		sections = sections.map((s, i) => ({ ...s, order: i }));
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
			<p class="text-gray-600">セクションを組み立ててコンテンツを作成します</p>
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
				<form method="POST" use:enhance class="space-y-6">
					<!-- 基本情報 -->
					<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">基本情報</h2>

						<div class="space-y-4">
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

					<!-- セクション編集 -->
					<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div class="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
							<h2 class="text-lg font-semibold text-gray-900">セクション構成</h2>
							<button
								type="button"
								on:click={addSection}
								class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
							>
								+ セクション追加
							</button>
						</div>

						{#if sections.length === 0}
							<div class="text-center py-8 text-gray-500">
								<p>セクションがありません。「+ セクション追加」ボタンでセクションを追加してください。</p>
							</div>
						{:else}
							<div class="space-y-6">
								{#each sections as section, sectionIndex}
									<div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
										<!-- セクションヘッダー -->
										<div class="flex items-center justify-between mb-4">
											<input
												type="text"
												bind:value={section.title}
												placeholder="セクションタイトル"
												class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
											<div class="flex items-center space-x-2 ml-3">
												<button
													type="button"
													on:click={() => moveSectionUp(sectionIndex)}
													disabled={sectionIndex === 0}
													class="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
													title="上に移動"
												>
													↑
												</button>
												<button
													type="button"
													on:click={() => moveSectionDown(sectionIndex)}
													disabled={sectionIndex === sections.length - 1}
													class="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
													title="下に移動"
												>
													↓
												</button>
												<button
													type="button"
													on:click={() => removeSection(sectionIndex)}
													class="p-2 text-red-600 hover:text-red-800"
													title="削除"
												>
													🗑
												</button>
											</div>
										</div>

										<!-- アイテム追加ボタン -->
										<div class="flex flex-wrap gap-2 mb-4">
											<button
												type="button"
												on:click={() => addItem(sectionIndex, 'heading')}
												class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded-lg"
											>
												+ 見出し
											</button>
											<button
												type="button"
												on:click={() => addItem(sectionIndex, 'text')}
												class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-lg"
											>
												+ テキスト
											</button>
											<button
												type="button"
												on:click={() => addItem(sectionIndex, 'video')}
												class="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm rounded-lg"
											>
												+ 動画URL
											</button>
											<button
												type="button"
												on:click={() => addItem(sectionIndex, 'image')}
												class="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-800 text-sm rounded-lg"
											>
												+ 画像URL
											</button>
										</div>

										<!-- アイテム一覧 -->
										{#if section.items.length > 0}
											<div class="space-y-3">
												{#each section.items as item, itemIndex}
													<div class="flex items-start space-x-2 bg-white p-3 rounded-lg border border-gray-200">
														<div class="flex-1">
															<div class="text-xs font-medium text-gray-500 mb-1">
																{item.type === 'heading' ? '見出し' : item.type === 'text' ? 'テキスト' : item.type === 'video' ? '動画URL' : '画像URL'}
															</div>
															{#if item.type === 'text'}
																<textarea
																	bind:value={item.content}
																	rows="3"
																	placeholder="テキストを入力"
																	class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
																></textarea>
															{:else}
																<input
																	type="text"
																	bind:value={item.content}
																	placeholder={item.type === 'heading' ? '見出しを入力' : item.type === 'video' ? 'YouTube/VimeoのURL' : '画像のURL'}
																	class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
																/>
															{/if}
														</div>
														<button
															type="button"
															on:click={() => removeItem(sectionIndex, itemIndex)}
															class="text-red-600 hover:text-red-800 mt-6"
															title="削除"
														>
															✕
														</button>
													</div>
												{/each}
											</div>
										{:else}
											<div class="text-center py-4 text-sm text-gray-500 bg-white rounded-lg border border-gray-200">
												アイテムがありません。上のボタンでアイテムを追加してください。
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- セクションデータをJSON形式で送信 -->
					<input type="hidden" name="sections" value={JSON.stringify(sections)} />

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

											<div class="space-y-4">
												{#each section.items as item}
													{#if item.type === 'heading'}
														<h3 class="text-lg font-semibold text-gray-800 mt-4">{item.content}</h3>
													{:else if item.type === 'text'}
														<p class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{item.content}</p>
													{:else if item.type === 'video' && item.content}
														<div class="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
															<iframe
																src={convertToEmbedUrl(item.content)}
																class="w-full h-full"
																frameborder="0"
																allowfullscreen
																title="Video content"
															></iframe>
														</div>
													{:else if item.type === 'image' && item.content}
														<img
															src={item.content}
															alt=""
															class="w-full rounded-lg shadow-sm"
														/>
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
			</div>
		</div>
	</div>
</Layout>
