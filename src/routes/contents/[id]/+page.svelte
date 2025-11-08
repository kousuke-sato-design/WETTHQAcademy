<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// YouTubeのURLをembed形式に変換
	function getEmbedUrl(url: string): string {
		if (url.includes('youtube.com') || url.includes('youtu.be')) {
			return url;
		}
		return url;
	}
</script>

<svelte:head>
	<title>{data.content.title} - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-4xl">
		<!-- パンくずリスト -->
		<nav class="mb-6 text-sm">
			<ol class="flex items-center space-x-2 text-gray-500">
				<li><a href="/dashboard" class="hover:text-gray-700">ダッシュボード</a></li>
				<li>/</li>
				<li><a href="/contents" class="hover:text-gray-700">コンテンツ一覧</a></li>
				<li>/</li>
				<li class="text-gray-900 font-medium">{data.content.title}</li>
			</ol>
		</nav>

		<!-- コンテンツヘッダー -->
		<div class="mb-6">
			<div class="flex items-center space-x-3 mb-3">
				<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
					{data.content.category || 'その他'}
				</span>
				<span class="text-gray-500 text-sm">
					{data.content.content_type === 'video' ? '動画コンテンツ' : 'テキストコンテンツ'}
				</span>
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-3">{data.content.title}</h1>
			{#if data.content.description}
				<p class="text-gray-600 text-lg">{data.content.description}</p>
			{/if}
		</div>

		<!-- コンテンツ本体 -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
			{#if data.content.content_type === 'video'}
				<!-- 動画プレイヤー -->
				<div class="aspect-video">
					<iframe
						src={getEmbedUrl(data.content.content_url)}
						title={data.content.title}
						class="w-full h-full"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			{:else}
				<!-- テキストコンテンツ -->
				<div class="p-8 prose max-w-none">
					<p class="text-gray-700">
						テキストコンテンツの表示機能は準備中です。<br />
						コンテンツURL: {data.content.content_url}
					</p>
				</div>
			{/if}
		</div>

		<!-- 関連コンテンツ -->
		{#if data.relatedContents.length > 0}
			<div class="mb-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">関連コンテンツ</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					{#each data.relatedContents as content}
						<a
							href="/contents/{content.id}"
							class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
						>
							<div class="flex items-start justify-between mb-2">
								<span class="text-2xl">
									{content.content_type === 'video' ? '🎥' : '📝'}
								</span>
								<span
									class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
								>
									{content.category}
								</span>
							</div>
							<h3 class="text-sm font-semibold text-gray-900">{content.title}</h3>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<!-- ナビゲーション -->
		<div class="flex justify-between">
			<a
				href="/contents"
				class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
			>
				← コンテンツ一覧に戻る
			</a>
		</div>
	</div>
</Layout>
