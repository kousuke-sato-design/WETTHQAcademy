<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
			books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
			video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
			image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
			text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>'
		};
		return icons[iconName] || icons.document;
	}
</script>

<svelte:head>
	<title>ダッシュボード - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user} contents={data.contents}>
	<div class="max-w-7xl mx-auto">
		<!-- Notion風ヘッダーバナー -->
		<div class="relative mb-12 overflow-hidden">
			<!-- 背景グラデーション -->
			<div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100"></div>
			<div class="absolute inset-0 opacity-50" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.05&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

			<!-- コンテンツ -->
			<div class="relative px-12 py-16">
				<div class="flex items-center mb-4">
					<div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
						<svg class="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
							<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
						</svg>
					</div>
					<div>
						<h1 class="text-5xl font-bold text-gray-900 mb-1">
							学習ダッシュボード
						</h1>
						<p class="text-lg text-gray-600">ようこそ、{data.user?.name || 'ゲスト'}さん</p>
					</div>
				</div>
			</div>
		</div>

		<!-- 統計カード（Notion風シンプル） -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
			<div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 mb-1">利用可能なコンテンツ</p>
						<h3 class="text-3xl font-bold text-gray-900">{data.contents.length}</h3>
					</div>
					<div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
						<div class="w-6 h-6 text-blue-600">{@html getIconSVG('books')}</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 mb-1">学習進捗</p>
						<h3 class="text-2xl font-bold text-gray-400">準備中</h3>
					</div>
					<div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
							<polyline points="22 4 12 14.01 9 11.01"/>
						</svg>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 mb-1">学習時間</p>
						<h3 class="text-2xl font-bold text-gray-400">準備中</h3>
					</div>
					<div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<polyline points="12 6 12 12 16 14"/>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- コンテンツセクション -->
		{#if data.contents.length > 0}
			<div class="mb-8">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-2xl font-bold text-gray-900">学習コンテンツ</h2>
					<span class="text-sm text-gray-500">{data.contents.length}件</span>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{#each data.contents as content}
						<a
							href="/user/contents/{content.id}"
							class="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all duration-200"
						>
							<!-- Notion風カードヘッダー（正方形に近い比率） -->
							<div class="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
								<div class="absolute inset-0 bg-blue-500/5"></div>
								<div class="w-14 h-14 text-blue-600 relative z-10 transform group-hover:scale-110 transition-transform duration-200">
									{@html getIconSVG(content.sidebar_icon)}
								</div>
							</div>

							<!-- カードコンテンツ -->
							<div class="p-4">
								<h3 class="text-base font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
									{content.title}
								</h3>

								<div class="flex items-center justify-between pt-3 border-t border-gray-100">
									<span class="text-xs text-gray-500">未開始</span>
									<span class="text-blue-600 text-xs font-medium inline-flex items-center">
										開始
										<svg class="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
											<line x1="5" y1="12" x2="19" y2="12"/>
											<polyline points="12 5 19 12 12 19"/>
										</svg>
									</span>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{:else}
			<div class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
				<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<line x1="12" y1="8" x2="12" y2="12"/>
						<line x1="12" y1="16" x2="12.01" y2="16"/>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-1">コンテンツがありません</h3>
				<p class="text-sm text-gray-500 max-w-md mx-auto">
					現在利用可能な学習コンテンツはありません
				</p>
			</div>
		{/if}
	</div>
</Layout>
