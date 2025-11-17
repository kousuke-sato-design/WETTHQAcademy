<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('ja-JP', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>コンテンツ一覧 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-7xl">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">コンテンツ一覧</h1>
			<p class="text-gray-600">
				生徒が閲覧できるコンテンツの一覧です。各コンテンツの閲覧状況を確認できます。
			</p>
		</div>

		<!-- 統計カード -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">公開コンテンツ</p>
						<p class="text-3xl font-bold text-blue-600">{data.contents.length}</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white"
					>
						<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
							<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- コンテンツカード一覧 -->
		{#if data.contents.length === 0}
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
				<p class="text-gray-500">コンテンツが登録されていません。</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.contents as content}
					<a
						href="/user/contents/{content.id}"
						class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
					>
						<div class="p-6">
							<!-- カテゴリー -->
							{#if content.category}
								<div class="mb-3">
									<span class="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
										{content.category}
									</span>
								</div>
							{/if}

							<!-- タイトル -->
							<h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
								{content.title}
							</h3>

							<!-- 説明 -->
							{#if content.description}
								<p class="text-sm text-gray-600 mb-4 line-clamp-2">
									{content.description}
								</p>
							{/if}

							<!-- 統計情報 -->
			<div class="flex items-center justify-between pt-4 border-t border-gray-100">
								<div class="flex items-center text-sm text-gray-500">
									<svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
										<path d="M16 3.13a4 4 0 0 1 0 7.75" />
									</svg>
									<span>{content.viewCount}名が閲覧</span>
								</div>
								<div class="text-xs text-gray-400">
									{formatDate(content.created_at)}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</Layout>
