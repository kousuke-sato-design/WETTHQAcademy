<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showDeleteModal = false;
	let showCopyModal = false;
	let showCreateModal = false;
	let showDetailModal = false;
	let selectedTemplate: any = null;
	let selectedCompanyIds: number[] = [];

	// タブ切り替え
	let activeTab: 'current' | 'all' = 'current';

	// 検索・フィルター（全テンプレート用）
	let searchQuery = '';
	let filterCompanyId: number | null = null;

	// ソート設定
	let sortBy: 'number' | 'title' | 'category' | 'created_at' = 'number';
	let sortOrder: 'asc' | 'desc' = 'asc';

	// 全テンプレート用ソート設定
	let allSortBy: 'company' | 'title' | 'category' | 'created_at' = 'company';
	let allSortOrder: 'asc' | 'desc' = 'asc';

	// フォームデータ
	let createTitle = '';
	let createSubject = '';
	let createBody = '';
	let createDescription = '';
	let createCategory = 'login';

	// 成功時にモーダルを閉じる
	$: if (form?.success) {
		showDeleteModal = false;
		showCopyModal = false;
		showCreateModal = false;
		selectedCompanyIds = [];
		createTitle = '';
		createSubject = '';
		createBody = '';
		createDescription = '';
		createCategory = 'login';
	}

	// 作成日順に番号を付与したテンプレート
	$: numberedTemplates = [...data.templates]
		.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
		.map((template, index) => ({
			...template,
			number: index + 1
		}));

	// ソートされたテンプレート
	$: sortedTemplates = [...numberedTemplates].sort((a, b) => {
		let comparison = 0;
		switch (sortBy) {
			case 'number':
				comparison = a.number - b.number;
				break;
			case 'title':
				comparison = a.title.localeCompare(b.title, 'ja');
				break;
			case 'category':
				comparison = (a.category || '').localeCompare(b.category || '', 'ja');
				break;
			case 'created_at':
				comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
				break;
		}
		return sortOrder === 'asc' ? comparison : -comparison;
	});

	function toggleSort(column: typeof sortBy) {
		if (sortBy === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = column;
			sortOrder = 'asc';
		}
	}

	function toggleAllSort(column: typeof allSortBy) {
		if (allSortBy === column) {
			allSortOrder = allSortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			allSortBy = column;
			allSortOrder = 'asc';
		}
	}

	// 全テンプレートのフィルタリング＆ソート
	$: filteredAllTemplates = (data.allTemplates || [])
		.filter(template => {
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesTitle = template.title.toLowerCase().includes(query);
				const matchesSubject = template.subject?.toLowerCase().includes(query);
				const matchesBody = template.body?.toLowerCase().includes(query);
				const matchesCompany = template.company_name?.toLowerCase().includes(query);
				if (!matchesTitle && !matchesSubject && !matchesBody && !matchesCompany) {
					return false;
				}
			}
			if (filterCompanyId !== null && template.target_company_id !== filterCompanyId) {
				return false;
			}
			return true;
		})
		.map((template, index, arr) => ({
			...template,
			number: arr.filter((t, i) => t.target_company_id === template.target_company_id && i <= index).length
		}))
		.sort((a, b) => {
			let comparison = 0;
			switch (allSortBy) {
				case 'company':
					comparison = (a.company_name || '').localeCompare(b.company_name || '', 'ja');
					break;
				case 'title':
					comparison = a.title.localeCompare(b.title, 'ja');
					break;
				case 'category':
					comparison = (a.category || '').localeCompare(b.category || '', 'ja');
					break;
				case 'created_at':
					comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
					break;
			}
			return allSortOrder === 'asc' ? comparison : -comparison;
		});

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
			plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
			trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
			back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
			copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
			search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
			list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
			check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
		};
		return icons[iconName] || '';
	}

	function getCategoryLabel(category: string) {
		const categories: Record<string, string> = {
			'login': 'ログイン案内',
			'reminder': 'リマインダー',
			'notification': 'お知らせ',
			'other': 'その他'
		};
		return categories[category] || category || '-';
	}

	function getCategoryBadgeClass(category: string) {
		const classes: Record<string, string> = {
			'login': 'bg-blue-100 text-blue-800',
			'reminder': 'bg-yellow-100 text-yellow-800',
			'notification': 'bg-green-100 text-green-800',
			'other': 'bg-gray-100 text-gray-800'
		};
		return classes[category] || 'bg-gray-100 text-gray-800';
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('ja-JP');
	}

	function openDeleteModal(template: any) {
		selectedTemplate = template;
		showDeleteModal = true;
	}

	function openCopyModal(template: any) {
		selectedTemplate = template;
		selectedCompanyIds = [];
		showCopyModal = true;
	}

	function openDetailModal(template: any) {
		selectedTemplate = template;
		showDetailModal = true;
	}

	function toggleCompanySelection(companyId: number) {
		if (selectedCompanyIds.includes(companyId)) {
			selectedCompanyIds = selectedCompanyIds.filter(id => id !== companyId);
		} else {
			selectedCompanyIds = [...selectedCompanyIds, companyId];
		}
	}

	function selectAllCompanies() {
		selectedCompanyIds = data.otherCompanies.map(c => c.id);
	}

	function deselectAllCompanies() {
		selectedCompanyIds = [];
	}

	function closeModals() {
		showDeleteModal = false;
		showCopyModal = false;
		showCreateModal = false;
		showDetailModal = false;
		selectedTemplate = null;
		selectedCompanyIds = [];
	}

	let copySuccess = false;
	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copySuccess = true;
			setTimeout(() => copySuccess = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function openMailClient() {
		if (selectedTemplate) {
			const subject = encodeURIComponent(selectedTemplate.subject || '');
			const body = encodeURIComponent(selectedTemplate.body || '');
			window.location.href = `mailto:?subject=${subject}&body=${body}`;
		}
	}
</script>

<svelte:head>
	<title>{data.company.company_name} - 企業専用テンプレート - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- パンくずナビ -->
		<div class="mb-4">
			<a href="/admin/company-templates" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
				<div class="w-4 h-4 mr-1">
					{@html getIconSVG('back')}
				</div>
				企業一覧に戻る
			</a>
		</div>

		<!-- ヘッダー -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<div class="flex items-center space-x-2 mb-2">
					<span class="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
						{data.company.company_code}
					</span>
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">{data.company.company_name}</h1>
				<p class="text-gray-600">この企業専用のメールテンプレートを管理します</p>
			</div>
			<button
				on:click={() => showCreateModal = true}
				class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center space-x-2"
			>
				<div class="w-4 h-4">
					{@html getIconSVG('plus')}
				</div>
				<span>新規テンプレート作成</span>
			</button>
		</div>

		<!-- エラー/成功メッセージ -->
		{#if form?.error}
			<div class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
				{form.error}
			</div>
		{/if}
		{#if form?.success}
			<div class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
				{form.message}
			</div>
		{/if}

		<!-- 統計カード -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">専用テンプレート数</p>
						<p class="text-3xl font-bold text-gray-900">{data.templates.length}</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
						<div class="w-7 h-7">
							{@html getIconSVG('mail')}
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">ログイン案内</p>
						<p class="text-3xl font-bold text-gray-900">
							{data.templates.filter(t => t.category === 'login').length}
						</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
						<div class="w-7 h-7">
							{@html getIconSVG('mail')}
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">その他テンプレート</p>
						<p class="text-3xl font-bold text-gray-900">
							{data.templates.filter(t => t.category !== 'login').length}
						</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
						<div class="w-7 h-7">
							{@html getIconSVG('mail')}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- タブ切り替え -->
		<div class="mb-6">
			<div class="border-b border-gray-200">
				<nav class="-mb-px flex space-x-8">
					<button
						on:click={() => activeTab = 'current'}
						class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'current' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					>
						<div class="flex items-center space-x-2">
							<div class="w-4 h-4">{@html getIconSVG('mail')}</div>
							<span>この企業のテンプレート</span>
							<span class="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{data.templates.length}</span>
						</div>
					</button>
					<button
						on:click={() => activeTab = 'all'}
						class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					>
						<div class="flex items-center space-x-2">
							<div class="w-4 h-4">{@html getIconSVG('list')}</div>
							<span>全企業のテンプレート</span>
							<span class="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{(data.allTemplates || []).length}</span>
						</div>
					</button>
				</nav>
			</div>
		</div>

		<!-- この企業のテンプレート -->
		{#if activeTab === 'current'}
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">テンプレート一覧</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleSort('number')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>No.</span>
									{#if sortBy === 'number'}
										<span class="text-indigo-600">{sortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleSort('title')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>タイトル</span>
									{#if sortBy === 'title'}
										<span class="text-indigo-600">{sortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleSort('category')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>カテゴリ</span>
									{#if sortBy === 'category'}
										<span class="text-indigo-600">{sortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleSort('created_at')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>作成日</span>
									{#if sortBy === 'created_at'}
										<span class="text-indigo-600">{sortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each sortedTemplates as template}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm font-bold text-gray-900 bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center">
										{template.number}
									</div>
								</td>
								<td class="px-4 py-4">
									<div class="text-sm font-medium text-gray-900">{template.title}</div>
									{#if template.subject}
										<div class="text-xs text-gray-500 mt-1">件名: {template.subject}</div>
									{/if}
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<span class="px-2 py-1 text-xs font-medium rounded-full {getCategoryBadgeClass(template.category || '')}">
										{getCategoryLabel(template.category || '')}
									</span>
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{formatDate(template.created_at)}</div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap text-sm">
									<button
										on:click={() => openDetailModal(template)}
										class="text-indigo-600 hover:text-indigo-700 font-medium mr-3"
									>
										詳細
									</button>
									<a href="/admin/company-templates/{data.company.id}/edit/{template.id}" class="text-blue-600 hover:text-blue-700 font-medium mr-3">編集</a>
									<button
										on:click={() => openCopyModal(template)}
										class="text-green-600 hover:text-green-700 font-medium mr-3"
									>
										コピー
									</button>
									<button
										on:click={() => openDeleteModal(template)}
										class="text-red-600 hover:text-red-700 font-medium"
									>
										削除
									</button>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="px-6 py-12 text-center text-gray-500">
									テンプレートがまだありません。「新規テンプレート作成」から追加してください。
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		{/if}

		<!-- 全企業のテンプレート -->
		{#if activeTab === 'all'}
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200">
				<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<h2 class="text-lg font-semibold text-gray-900">全企業のテンプレート一覧</h2>
					<div class="flex flex-col sm:flex-row gap-3">
						<!-- 検索ボックス -->
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<div class="w-4 h-4 text-gray-400">{@html getIconSVG('search')}</div>
							</div>
							<input
								type="text"
								bind:value={searchQuery}
								placeholder="タイトル、件名、企業名で検索..."
								class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
							/>
						</div>
						<!-- 企業フィルター -->
						<select
							bind:value={filterCompanyId}
							class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						>
							<option value={null}>すべての企業</option>
							{#each (data.allCompanies || []) as company}
								<option value={company.id}>{company.company_name}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleAllSort('company')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>企業</span>
									{#if allSortBy === 'company'}
										<span class="text-indigo-600">{allSortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleAllSort('title')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>タイトル</span>
									{#if allSortBy === 'title'}
										<span class="text-indigo-600">{allSortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleAllSort('category')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>カテゴリ</span>
									{#if allSortBy === 'category'}
										<span class="text-indigo-600">{allSortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleAllSort('created_at')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>作成日</span>
									{#if allSortBy === 'created_at'}
										<span class="text-indigo-600">{allSortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each filteredAllTemplates as template}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{template.company_name}</div>
									<div class="text-xs text-gray-500">{template.company_code}</div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm font-bold text-gray-900 bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center">
										{template.number}
									</div>
								</td>
								<td class="px-4 py-4">
									<div class="text-sm font-medium text-gray-900">{template.title}</div>
									{#if template.subject}
										<div class="text-xs text-gray-500 mt-1 line-clamp-2">件名: {template.subject}</div>
									{/if}
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<span class="px-2 py-1 text-xs font-medium rounded-full {getCategoryBadgeClass(template.category || '')}">
										{getCategoryLabel(template.category || '')}
									</span>
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{formatDate(template.created_at)}</div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap text-sm">
									<button
										on:click={() => openDetailModal(template)}
										class="text-indigo-600 hover:text-indigo-700 font-medium mr-3"
									>
										詳細
									</button>
									<a href="/admin/company-templates/{template.target_company_id}/edit/{template.id}" class="text-blue-600 hover:text-blue-700 font-medium mr-3">編集</a>
									<button
										on:click={() => openCopyModal(template)}
										class="text-green-600 hover:text-green-700 font-medium mr-3"
									>
										コピー
									</button>
									<button
										on:click={() => openDeleteModal(template)}
										class="text-red-600 hover:text-red-700 font-medium"
									>
										削除
									</button>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="6" class="px-6 py-12 text-center text-gray-500">
									{#if searchQuery || filterCompanyId !== null}
										検索条件に一致するテンプレートがありません。
									{:else}
										企業専用テンプレートがまだありません。
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if filteredAllTemplates.length > 0}
			<div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
				<p class="text-sm text-gray-600">
					{filteredAllTemplates.length}件のテンプレートを表示中
					{#if searchQuery || filterCompanyId !== null}
						（全{(data.allTemplates || []).length}件中）
					{/if}
				</p>
			</div>
			{/if}
		</div>
		{/if}
	</div>

	<!-- 新規作成モーダル -->
	{#if showCreateModal}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
				<div class="p-6 border-b border-gray-200">
					<h2 class="text-xl font-bold text-gray-900">新規テンプレート作成</h2>
					<p class="text-sm text-gray-500 mt-1">{data.company.company_name}専用</p>
				</div>

				<form method="POST" action="?/createTemplate" use:enhance class="flex-1 overflow-y-auto">
					<div class="p-6 space-y-4">
						<div>
							<label for="create-title" class="block text-sm font-medium text-gray-700 mb-1">
								タイトル <span class="text-red-500">*</span>
							</label>
							<input
								id="create-title"
								type="text"
								name="title"
								bind:value={createTitle}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								placeholder="例: ログイン案内メール"
							/>
						</div>

						<div>
							<label for="create-category" class="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
							<select
								id="create-category"
								name="category"
								bind:value={createCategory}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							>
								<option value="login">ログイン案内</option>
								<option value="reminder">リマインダー</option>
								<option value="notification">お知らせ</option>
								<option value="other">その他</option>
							</select>
						</div>

						<div>
							<label for="create-subject" class="block text-sm font-medium text-gray-700 mb-1">メール件名</label>
							<input
								id="create-subject"
								type="text"
								name="subject"
								bind:value={createSubject}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								placeholder="例: 【WEBTHQAcademy】ログイン情報のお知らせ"
							/>
						</div>

						<div>
							<label for="create-body" class="block text-sm font-medium text-gray-700 mb-1">
								本文 <span class="text-red-500">*</span>
							</label>
							<textarea
								id="create-body"
								name="body"
								bind:value={createBody}
								required
								rows="10"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
								placeholder="テンプレート本文を入力..."
							></textarea>
							<p class="text-xs text-gray-500 mt-1">
								変数: {'{{名前}}'}, {'{{ログインID}}'}, {'{{パスワード}}'}, {'{{ログインURL}}'}, {'{{企業名}}'}
							</p>
						</div>

						<div>
							<label for="create-description" class="block text-sm font-medium text-gray-700 mb-1">説明（管理用メモ）</label>
							<textarea
								id="create-description"
								name="description"
								bind:value={createDescription}
								rows="2"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								placeholder="このテンプレートの用途や注意点など..."
							></textarea>
						</div>
					</div>

					<div class="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
						<button
							type="button"
							on:click={closeModals}
							class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							キャンセル
						</button>
						<button
							type="submit"
							class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
						>
							作成
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- 詳細モーダル -->
	{#if showDetailModal && selectedTemplate}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-xl font-bold text-gray-900">{selectedTemplate.title}</h2>
							<p class="text-sm text-gray-500 mt-1">{selectedTemplate.company_name || data.company.company_name}</p>
						</div>
						<span class="px-2 py-1 text-xs font-medium rounded-full {getCategoryBadgeClass(selectedTemplate.category || '')}">
							{getCategoryLabel(selectedTemplate.category || '')}
						</span>
					</div>
				</div>

				<div class="flex-1 overflow-y-auto p-6 space-y-4">
					{#if selectedTemplate.subject}
						<div>
							<p class="block text-sm font-medium text-gray-700 mb-1">件名</p>
							<div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
								{selectedTemplate.subject}
							</div>
						</div>
					{/if}

					<div>
						<p class="block text-sm font-medium text-gray-700 mb-1">本文</p>
						<div class="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm">
							{selectedTemplate.body}
						</div>
					</div>

					{#if selectedTemplate.description}
						<div>
							<p class="block text-sm font-medium text-gray-700 mb-1">説明</p>
							<div class="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
								{selectedTemplate.description}
							</div>
						</div>
					{/if}
				</div>

				<div class="p-4 border-t border-gray-200 bg-gray-50">
					<div class="flex flex-wrap gap-3">
						<button
							on:click={() => copyToClipboard(selectedTemplate.body)}
							class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
						>
							{#if copySuccess}
								<div class="w-4 h-4 mr-2">{@html getIconSVG('check')}</div>
								<span>コピーしました</span>
							{:else}
								<div class="w-4 h-4 mr-2">{@html getIconSVG('copy')}</div>
								<span>本文をコピー</span>
							{/if}
						</button>
						<button
							on:click={openMailClient}
							class="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
						>
							<div class="w-4 h-4 mr-2">{@html getIconSVG('mail')}</div>
							<span>メールで開く</span>
						</button>
						<button
							on:click={closeModals}
							class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ml-auto"
						>
							閉じる
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- 削除確認モーダル -->
	{#if showDeleteModal && selectedTemplate}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-md w-full">
				<div class="p-6">
					<div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
						<div class="w-6 h-6 text-red-600">
							{@html getIconSVG('trash')}
						</div>
					</div>
					<h2 class="text-xl font-bold text-gray-900 text-center mb-2">テンプレートを削除</h2>
					<p class="text-gray-600 text-center mb-6">
						「{selectedTemplate.title}」を削除してもよろしいですか?<br />
						この操作は取り消せません。
					</p>

					<form method="POST" action="?/deleteTemplate" use:enhance class="space-y-3">
						<input type="hidden" name="templateId" value={selectedTemplate.id} />
						<div class="flex items-center space-x-3">
							<button
								type="button"
								on:click={closeModals}
								class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
							>
								キャンセル
							</button>
							<button
								type="submit"
								class="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
							>
								削除する
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}

	<!-- コピーモーダル -->
	{#if showCopyModal && selectedTemplate}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
						<div class="w-6 h-6 text-green-600">
							{@html getIconSVG('copy')}
						</div>
					</div>
					<h2 class="text-xl font-bold text-gray-900 text-center mb-2">他の企業にコピー</h2>
					<p class="text-gray-600 text-center text-sm">
						「{selectedTemplate.title}」をコピーする企業を選択してください
					</p>
				</div>

				<div class="p-4 border-b border-gray-200 bg-gray-50">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">
							{selectedCompanyIds.length}社選択中
						</span>
						<div class="space-x-2">
							<button
								type="button"
								on:click={selectAllCompanies}
								class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
							>
								すべて選択
							</button>
							<button
								type="button"
								on:click={deselectAllCompanies}
								class="text-sm text-gray-600 hover:text-gray-700 font-medium"
							>
								選択解除
							</button>
						</div>
					</div>
				</div>

				<div class="flex-1 overflow-y-auto p-4">
					{#if data.otherCompanies.length === 0}
						<p class="text-center text-gray-500 py-8">
							コピー先の企業がありません
						</p>
					{:else}
						<div class="space-y-2">
							{#each data.otherCompanies as company}
								<label
									class="flex items-center p-3 rounded-lg border cursor-pointer transition-colors {selectedCompanyIds.includes(company.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}"
								>
									<input
										type="checkbox"
										checked={selectedCompanyIds.includes(company.id)}
										on:change={() => toggleCompanySelection(company.id)}
										class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
									/>
									<div class="ml-3 flex-1">
										<div class="font-medium text-gray-900">{company.company_name}</div>
										<div class="text-xs text-gray-500">{company.company_code}</div>
									</div>
								</label>
							{/each}
						</div>
					{/if}
				</div>

				<div class="p-4 border-t border-gray-200 bg-gray-50">
					<form method="POST" action="?/copyTemplate" use:enhance class="space-y-3">
						<input type="hidden" name="templateId" value={selectedTemplate.id} />
						{#each selectedCompanyIds as companyId}
							<input type="hidden" name="targetCompanyIds" value={companyId} />
						{/each}
						<div class="flex items-center space-x-3">
							<button
								type="button"
								on:click={closeModals}
								class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
							>
								キャンセル
							</button>
							<button
								type="submit"
								disabled={selectedCompanyIds.length === 0}
								class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-sm"
							>
								{selectedCompanyIds.length}社にコピー
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
</Layout>
