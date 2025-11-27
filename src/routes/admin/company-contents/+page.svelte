<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
			arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
		};
		return icons[iconName] || '';
	}

	// 企業専用コンテンツの総数
	$: totalCompanyContents = data.companies.reduce((sum, c) => sum + c.content_count, 0);
</script>

<svelte:head>
	<title>企業専用コンテンツ - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- ヘッダー -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">企業専用コンテンツ</h1>
			<p class="text-gray-600">企業を選択して、その企業専用のコンテンツを管理します</p>
		</div>

		<!-- 統計カード -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">登録企業数</p>
						<p class="text-3xl font-bold text-gray-900">{data.companies.length}</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
						<div class="w-7 h-7">
							{@html getIconSVG('company')}
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">企業専用コンテンツ総数</p>
						<p class="text-3xl font-bold text-gray-900">{totalCompanyContents}</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
						<div class="w-7 h-7">
							{@html getIconSVG('document')}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 企業一覧 -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">企業を選択</h2>
			</div>
			<div class="divide-y divide-gray-200">
				{#each data.companies as company}
					<a
						href="/admin/company-contents/{company.id}"
						class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
					>
						<div class="flex items-center space-x-4">
							<div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
								<div class="w-5 h-5">
									{@html getIconSVG('company')}
								</div>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900">{company.company_name}</p>
								<p class="text-xs text-gray-500">企業コード: {company.company_code}</p>
							</div>
						</div>
						<div class="flex items-center space-x-4">
							<div class="text-right">
								<p class="text-sm font-medium text-gray-900">{company.content_count}</p>
								<p class="text-xs text-gray-500">コンテンツ</p>
							</div>
							<div class="w-5 h-5 text-gray-400">
								{@html getIconSVG('arrow')}
							</div>
						</div>
					</a>
				{:else}
					<div class="px-6 py-12 text-center text-gray-500">
						企業が登録されていません
					</div>
				{/each}
			</div>
		</div>
	</div>
</Layout>
