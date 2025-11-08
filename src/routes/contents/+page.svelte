<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>コンテンツ一覧 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<h1 class="text-3xl font-bold text-gray-900 mb-6">コンテンツ一覧</h1>

		<!-- カテゴリフィルター -->
		<div class="mb-6 flex items-center space-x-2">
			<span class="text-sm font-medium text-gray-700">カテゴリ:</span>
			<a
				href="/contents"
				class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {!data.selectedCategory
					? 'bg-blue-600 text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			>
				すべて
			</a>
			{#each data.categories as category}
				<a
					href="/contents?category={encodeURIComponent(category)}"
					class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {data.selectedCategory ===
					category
						? 'bg-blue-600 text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					{category}
				</a>
			{/each}
		</div>

		<!-- コンテンツ一覧 -->
		{#if data.contents.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-500">コンテンツが見つかりませんでした</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.contents as content}
					<a
						href="/contents/{content.id}"
						class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
					>
						<!-- サムネイル -->
						<div
							class="h-48 bg-gradient-to-br {content.content_type === 'video'
								? 'from-blue-400 to-blue-600'
								: 'from-green-400 to-green-600'} flex items-center justify-center"
						>
							<span class="text-6xl">
								{@html getIconSVG(content.content_type === 'video' ? 'video' : 'document')}
							</span>
						</div>

						<!-- コンテンツ情報 -->
						<div class="p-6">
							<div class="flex items-center justify-between mb-2">
								<span
									class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
								>
									{content.category || 'その他'}
								</span>
								<span class="text-xs text-gray-500">
									{content.content_type === 'video' ? '動画' : 'テキスト'}
								</span>
							</div>
							<h3
								class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
							>
								{content.title}
							</h3>
							<p class="text-sm text-gray-600 line-clamp-2">
								{content.description || 'コンテンツの説明はありません'}
							</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</Layout>
