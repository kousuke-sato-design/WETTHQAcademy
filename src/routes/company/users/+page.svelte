<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showCreateModal = false;
	let showDeleteModal = false;
	let selectedUser: any = null;

	// フォーム入力
	let selectedCompanyId = '';
	let employeeNumber = '';
	let userName = '';

	// 成功時にモーダルを閉じる
	$: if (form?.success) {
		showCreateModal = false;
		showDeleteModal = false;
		selectedCompanyId = '';
		employeeNumber = '';
		userName = '';
	}

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
			x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
			trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
			user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
		};
		return icons[iconName] || '';
	}

	function openCreateModal() {
		showCreateModal = true;
	}

	function openDeleteModal(user: any) {
		selectedUser = user;
		showDeleteModal = true;
	}

	function closeModals() {
		showCreateModal = false;
		showDeleteModal = false;
		selectedUser = null;
	}

	// 統一IDかどうかを判定
	function isUnifiedIdUser(user: any) {
		return user.use_unified_id === 1;
	}
</script>

<svelte:head>
	<title>生徒一覧 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- ヘッダー -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">生徒一覧</h1>
				<p class="text-gray-600">生徒アカウントの登録と管理</p>
			</div>
			<button
				disabled
				class="px-4 py-2 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed shadow-sm flex items-center space-x-2"
			>
				<div class="w-4 h-4">
					{@html getIconSVG('plus')}
				</div>
				<span>新規生徒登録（準備中）</span>
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
		<div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8 max-w-md">
			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">総生徒数</p>
						<p class="text-3xl font-bold text-gray-900">{data.users.length}名</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white"
					>
						<div class="w-7 h-7">
							{@html getIconSVG('users')}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- ユーザーリスト -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">登録生徒一覧</h2>
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
								>名前</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>社員番号</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>統一ID</th
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
						{#each data.users as user, index}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">{index + 1}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{user.name}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{user.login_id}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if user.use_unified_id === 1}
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											統一ID
										</span>
									{:else}
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											個別ID
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">
										{new Date(user.created_at).toLocaleDateString('ja-JP')}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm">
									<button
										on:click={() => openDeleteModal(user)}
										class="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
										disabled={user.use_unified_id === 1}
										class:opacity-50={user.use_unified_id === 1}
										class:cursor-not-allowed={user.use_unified_id === 1}
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

<!-- 新規生徒登録モーダル -->
{#if showCreateModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900">新規生徒登録</h2>
				<button
					on:click={closeModals}
					class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
				>
					<div class="w-5 h-5 text-gray-500">
						{@html getIconSVG('x')}
					</div>
				</button>
			</div>

			<form method="POST" action="?/createUser" use:enhance class="p-6 space-y-6">
				<div class="space-y-4">
					<div>
						<label for="company_id" class="block text-sm font-medium text-gray-700 mb-2">
							企業 <span class="text-red-500">*</span>
						</label>
						<select
							id="company_id"
							name="company_id"
							bind:value={selectedCompanyId}
							required
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
						>
							<option value="">企業を選択してください</option>
							{#each data.companies as company}
								<option value={company.id}>
									{company.company_name} {company.company_code ? `(${company.company_code})` : ''}
								</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="employee_number" class="block text-sm font-medium text-gray-700 mb-2">
							社員番号 <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="employee_number"
							name="employee_number"
							bind:value={employeeNumber}
							required
							placeholder="例: 12345"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
						/>
						<p class="mt-1 text-sm text-gray-500">
							社員番号がログインIDとパスワードになります
						</p>
					</div>

					<div>
						<label for="user_name" class="block text-sm font-medium text-gray-700 mb-2">
							名前 <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="user_name"
							name="name"
							bind:value={userName}
							required
							placeholder="例: 山田太郎"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
						class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						登録する
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- 削除確認モーダル -->
{#if showDeleteModal && selectedUser}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
			<div class="p-6">
				<div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<div class="w-6 h-6 text-red-600">
						{@html getIconSVG('trash')}
					</div>
				</div>

				<h2 class="text-xl font-bold text-gray-900 text-center mb-2">生徒を削除しますか？</h2>
				<p class="text-gray-600 text-center mb-6">
					「{selectedUser.name}」を削除します。この操作は元に戻せません。
				</p>

				<form method="POST" action="?/deleteUser" use:enhance class="space-y-3">
					<input type="hidden" name="id" value={selectedUser.id} />

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
