<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// 基本情報（既存データで初期化）
	let title = data.content.title;
	let description = data.content.description || '';
	let category = data.content.category || '';
	let order = data.content.order.toString();

	// 動画URLを埋め込み形式に変換（プレビュー用）
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
			<p class="text-gray-600">左側で編集、右側でプレビューを確認できます</p>
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
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 class="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">基本情報の編集</h2>

					<form method="POST" use:enhance class="space-y-6">
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
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
								rows="3"
								placeholder="コンテンツの説明を入力"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							></textarea>
						</div>

						<!-- カテゴリ -->
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

						<!-- 表示順序 -->
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
								placeholder="0"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						<!-- セクションデータ（既存データを保持） -->
						<input type="hidden" name="sections" value={JSON.stringify(data.sections)} />

						<!-- ボタン -->
						<div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
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

				<!-- セクション一覧表示（読み取り専用） -->
				{#if data.sections.length > 0}
					<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 class="text-lg font-semibold text-gray-900 mb-4">セクション一覧</h2>
						<div class="space-y-4">
							{#each data.sections as section}
								<div class="border border-gray-200 rounded-lg p-4">
									<div class="font-medium text-gray-900">{section.title || 'タイトルなし'}</div>
									<div class="text-sm text-gray-600 mt-1">
										タイプ: {section.section_type} |
										アイテム数: {Array.isArray(section.items) ? section.items.length : 0}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- 右側: プレビュー -->
			<div class="lg:sticky lg:top-6 lg:self-start">
				<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900">プレビュー</h2>
						<span class="text-xs text-gray-500">ユーザー表示と同じ</span>
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
							{#if data.sections.length === 0}
								<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
									<p class="text-yellow-800 text-sm">このコンテンツにはまだセクションが追加されていません。</p>
								</div>
							{:else}
								<div class="space-y-10">
									{#each data.sections as section}
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
