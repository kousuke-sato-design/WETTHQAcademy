<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showCreateModal = false;
	let showDeleteModal = false;

	// 新規登録用
	let companyName = '';
	let companyCode = '';

	// 削除用
	let selectedCompany: any = null;

	// 成功時にモーダルを閉じる
	$: if (form?.success) {
		showCreateModal = false;
		showDeleteModal = false;
	}

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
			plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
			x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
			edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
			trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'
		};
		return icons[iconName] || '';
	}

	function openCreateModal() {
		showCreateModal = true;
		companyName = '';
		companyCode = '';
	}

	function openDeleteModal(company: any) {
		selectedCompany = company;
		showDeleteModal = true;
	}

	function closeModals() {
		showCreateModal = false;
		showDeleteModal = false;
		selectedCompany = null;
	}
</script>

<svelte:head>
	<title>企業管理 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- ヘッダー -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">企業管理</h1>
				<p class="text-gray-600">登録企業の管理と設定</p>
			</div>
			<button
				on:click={openCreateModal}
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center space-x-2"
			>
				<div class="w-4 h-4">
					{@html getIconSVG('plus')}
				</div>
				<span>新規企業登録</span>
			</button>
		</div>

		<!-- メッセージ表示 -->
		{#if form?.success}
			<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
				<p class="text-green-800 font-medium">{form.message}</p>
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-red-800 font-medium">{form.error}</p>
			</div>
		{/if}

		<!-- 統計カード -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">総企業数</p>
						<p class="text-3xl font-bold text-gray-900">{data.companies.length}</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white"
					>
						<div class="w-7 h-7">
							{@html getIconSVG('company')}
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">総ユーザー数</p>
						<p class="text-3xl font-bold text-gray-900">
							{data.companies.reduce((sum, c) => sum + c.user_count, 0)}
						</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white"
					>
						<div class="w-7 h-7">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle
									cx="9"
									cy="7"
									r="4"
								/><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path
									d="M16 3.13a4 4 0 0 1 0 7.75"
								/></svg
							>
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">今月の新規登録</p>
						<p class="text-3xl font-bold text-gray-900">
							{data.companies.filter((c) => {
								const created = new Date(c.created_at);
								const now = new Date();
								return (
									created.getMonth() === now.getMonth() &&
									created.getFullYear() === now.getFullYear()
								);
							}).length}
						</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white"
					>
						<div class="w-7 h-7">
							{@html getIconSVG('plus')}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 企業リスト -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">登録企業一覧</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>No.</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>企業コード</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>企業名</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>ユーザー数</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>登録日</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>操作</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.companies as company, index}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">{index + 1}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-blue-600">
										{company.company_code || '-'}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{company.company_name}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{company.user_count}名</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">
										{new Date(company.created_at).toLocaleDateString('ja-JP')}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
									<a
										href="/admin/companies/{company.id}/edit"
										class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
									>
										<div class="w-4 h-4 mr-1">
											{@html getIconSVG('edit')}
										</div>
										編集
									</a>
									<button
										on:click={() => openDeleteModal(company)}
										class="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
									>
										<div class="w-4 h-4 mr-1">
											{@html getIconSVG('trash')}
										</div>
										削除
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</Layout>

<!-- 新規企業登録モーダル -->
{#if showCreateModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900">新規企業登録</h2>
				<button
					on:click={closeModals}
					class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
				>
					<div class="w-5 h-5 text-gray-500">
						{@html getIconSVG('x')}
					</div>
				</button>
			</div>

			<form method="POST" action="?/createCompany" use:enhance class="p-6 space-y-6">
				<div class="space-y-4">
					<div>
						<label for="company_code" class="block text-sm font-medium text-gray-700 mb-2">
							企業コード <span class="text-red-500">*</span>
						</label>
						<input
							type="number"
							id="company_code"
							name="company_code"
							bind:value={companyCode}
							required
							placeholder="例: 1001"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						<p class="mt-1 text-sm text-gray-500">数値で入力してください</p>
					</div>

					<div>
						<label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">
							企業名 <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="company_name"
							name="company_name"
							bind:value={companyName}
							required
							placeholder="例: 株式会社サンプル"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>
				</div>

				<div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
					<button
						type="button"
						on:click={closeModals}
						class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						キャンセル
					</button>
					<button
						type="submit"
						class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						登録する
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- 削除確認モーダル -->
{#if showDeleteModal && selectedCompany}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
			<div class="p-6">
				<div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<div class="w-6 h-6 text-red-600">
						{@html getIconSVG('trash')}
					</div>
				</div>

				<h2 class="text-xl font-bold text-gray-900 text-center mb-2">企業を削除しますか？</h2>
				<p class="text-gray-600 text-center mb-6">
					「{selectedCompany.company_name}」と関連する全てのユーザーが削除されます。この操作は元に戻せません。
				</p>

				<form method="POST" action="?/deleteCompany" use:enhance class="space-y-3">
					<input type="hidden" name="id" value={selectedCompany.id} />

					<button
						type="submit"
						class="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						削除する
					</button>
					<button
						type="button"
						on:click={closeModals}
						class="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						キャンセル
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
