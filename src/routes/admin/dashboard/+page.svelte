<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
			video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>ダッシュボード - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- ウェルカムメッセージ -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">ようこそ、{data.user.name}さん</h1>
			<p class="text-gray-600">
				ストレスチェックに関する知識を学習できます。おすすめのコンテンツから始めましょう。
			</p>
		</div>

		<!-- 統計カード -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">総コンテンツ数</p>
						<p class="text-3xl font-bold text-gray-900">{data.contents.length}</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
					<div class="w-7 h-7">
						{@html getIconSVG('books')}
					</div>
				</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">動画コンテンツ</p>
						<p class="text-3xl font-bold text-gray-900">
							{data.contents.filter((c) => c.content_type === 'video').length}
						</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
					<div class="w-7 h-7">
						{@html getIconSVG('video')}
					</div>
				</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">テキストコンテンツ</p>
						<p class="text-3xl font-bold text-gray-900">
							{data.contents.filter((c) => c.content_type === 'text').length}
						</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
					<div class="w-7 h-7">
						{@html getIconSVG('document')}
					</div>
				</div>
				</div>
			</div>
		</div>

		<!-- おすすめコンテンツ -->
		<div class="mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">おすすめコンテンツ</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.contents as content}
					<a
						href="/contents/{content.id}"
						class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
					>
						<div class="flex items-start justify-between mb-3">
							<span
								class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
							>
								{content.category || 'その他'}
							</span>
							<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white">
								<div class="w-5 h-5">
									{@html getIconSVG(content.content_type === 'video' ? 'video' : 'document')}
								</div>
							</div>
						</div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">{content.title}</h3>
						<p class="text-sm text-gray-600 line-clamp-2">
							{content.description || 'コンテンツの説明はありません'}
						</p>
					</a>
				{/each}
			</div>
		</div>

		<!-- クイックアクション -->
		<div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
			<h3 class="text-xl font-semibold mb-2">すべてのコンテンツを見る</h3>
			<p class="mb-4 text-blue-100">
				カテゴリ別に整理されたすべてのコンテンツにアクセスできます
			</p>
			<a
				href="/contents"
				class="inline-block bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
			>
				コンテンツ一覧へ →
			</a>
		</div>
	</div>
</Layout>
