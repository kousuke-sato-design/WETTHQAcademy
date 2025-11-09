<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showModal = false;
	let showEditModal = false;
	let editingStaffId = 0;
	let selectedCompanyId = '';
	let staffName = '';
	let staffLoginId = '';
	let staffPassword = '';

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
			x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
			building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>'
		};
		return icons[iconName] || '';
	}

	function openModal() {
		showModal = true;
		// フォームをリセット
		selectedCompanyId = '';
		staffName = '';
		staffLoginId = '';
		staffPassword = '';
	}

	function closeModal() {
		showModal = false;
	}

	function openEditModal(staff: any) {
		showEditModal = true;
		editingStaffId = staff.id;
		selectedCompanyId = staff.company_id.toString();
		staffName = staff.name;
		staffLoginId = staff.login_id;
		staffPassword = ''; // パスワードは空にする
	}

	function closeEditModal() {
		showEditModal = false;
		editingStaffId = 0;
		selectedCompanyId = '';
		staffName = '';
		staffLoginId = '';
		staffPassword = '';
	}

	// 成功時にモーダルを閉じる
	$: if (form?.success) {
		console.log('Form submitted successfully:', form);
		showModal = false;
		showEditModal = false;
	}

	// エラー時にログ出力
	$: if (form?.error) {
		console.error('Form error:', form.error);
	}
</script>

<svelte:head>
	<title>担当者管理 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- ヘッダー -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">担当者管理</h1>
				<p class="text-gray-600">企業担当者の管理と登録</p>
			</div>
			<button
				on:click={openModal}
				class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center space-x-2"
			>
				<div class="w-4 h-4">
					{@html getIconSVG('plus')}
				</div>
				<span>新規担当者登録</span>
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
						<p class="text-sm text-gray-600 mb-1">総担当者数</p>
						<p class="text-3xl font-bold text-gray-900">{data.staff.length}</p>
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

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">登録企業数</p>
						<p class="text-3xl font-bold text-gray-900">{data.companies.length}</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white"
					>
						<div class="w-7 h-7">
							{@html getIconSVG('building')}
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">今月の新規登録</p>
						<p class="text-3xl font-bold text-gray-900">
							{data.staff.filter((s) => {
								const created = new Date(s.created_at);
								const now = new Date();
								return (
									created.getMonth() === now.getMonth() &&
									created.getFullYear() === now.getFullYear()
								);
							}).length}
						</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white"
					>
						<div class="w-7 h-7">
							{@html getIconSVG('plus')}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 担当者リスト -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">担当者一覧</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>担当者名</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>ログインID</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>所属企業</th
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
						{#each data.staff as staff}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{staff.name}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{staff.login_id}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{staff.company_name}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">
										{new Date(staff.created_at).toLocaleDateString('ja-JP')}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm">
									<button
										on:click={() => openEditModal(staff)}
										class="text-blue-600 hover:text-blue-700 font-medium mr-3"
									>
										編集
									</button>
									<form method="POST" action="?/deleteStaff" use:enhance class="inline">
										<input type="hidden" name="id" value={staff.id} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-700 font-medium"
											on:click={(e) => {
												if (!confirm('本当にこの担当者を削除しますか？')) {
													e.preventDefault();
												}
											}}
										>
											削除
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</Layout>

<!-- 新規担当者登録モーダル -->
{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<!-- モーダルヘッダー -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900">新規担当者登録</h2>
				<button
					on:click={closeModal}
					class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
				>
					<div class="w-5 h-5 text-gray-500">
						{@html getIconSVG('x')}
					</div>
				</button>
			</div>

			<!-- モーダルボディ -->
			<form method="POST" action="?/createStaff" use:enhance class="p-6 space-y-6">
				<!-- 企業選択 -->
				<div>
					<label for="company_id" class="block text-sm font-medium text-gray-700 mb-2">
						所属企業 <span class="text-red-500">*</span>
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
							<option value={company.id}>{company.company_name}</option>
						{/each}
					</select>
					<p class="mt-1 text-sm text-gray-500">担当者が所属する企業を選択してください</p>
				</div>

				<!-- 担当者名 -->
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
						担当者名 <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="name"
						name="name"
						bind:value={staffName}
						required
						placeholder="例: 山田 太郎"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
				</div>

				<!-- ログインID（メールアドレス） -->
				<div>
					<label for="login_id" class="block text-sm font-medium text-gray-700 mb-2">
						ログインID（メールアドレス） <span class="text-red-500">*</span>
					</label>
					<input
						type="email"
						id="login_id"
						name="login_id"
						bind:value={staffLoginId}
						required
						placeholder="例: tantosha@example.com"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
					<p class="mt-1 text-sm text-gray-500">メールアドレス形式で入力してください</p>
				</div>

				<!-- 初期パスワード -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						初期パスワード <span class="text-red-500">*</span>
					</label>
					<input
						type="password"
						id="password"
						name="password"
						bind:value={staffPassword}
						required
						placeholder="8文字以上"
						minlength="8"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
					<p class="mt-1 text-sm text-gray-500">8文字以上で設定してください</p>
				</div>

				<!-- フッター -->
				<div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
					<button
						type="button"
						on:click={closeModal}
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

<!-- 担当者編集モーダル -->
{#if showEditModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<!-- モーダルヘッダー -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900">担当者情報編集</h2>
				<button
					on:click={closeEditModal}
					class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
				>
					<div class="w-5 h-5 text-gray-500">
						{@html getIconSVG('x')}
					</div>
				</button>
			</div>

			<!-- モーダルボディ -->
			<form method="POST" action="?/updateStaff" use:enhance class="p-6 space-y-6">
				<input type="hidden" name="id" value={editingStaffId} />

				<!-- 企業選択 -->
				<div>
					<label for="edit_company_id" class="block text-sm font-medium text-gray-700 mb-2">
						所属企業 <span class="text-red-500">*</span>
					</label>
					<select
						id="edit_company_id"
						name="company_id"
						bind:value={selectedCompanyId}
						required
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					>
						<option value="">企業を選択してください</option>
						{#each data.companies as company}
							<option value={company.id}>{company.company_name}</option>
						{/each}
					</select>
				</div>

				<!-- 担当者名 -->
				<div>
					<label for="edit_name" class="block text-sm font-medium text-gray-700 mb-2">
						担当者名 <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="edit_name"
						name="name"
						bind:value={staffName}
						required
						placeholder="例: 山田 太郎"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
				</div>

				<!-- ログインID -->
				<div>
					<label for="edit_login_id" class="block text-sm font-medium text-gray-700 mb-2">
						ログインID（メールアドレス） <span class="text-red-500">*</span>
					</label>
					<input
						type="email"
						id="edit_login_id"
						name="login_id"
						bind:value={staffLoginId}
						required
						placeholder="例: tantosha@example.com"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
				</div>

				<!-- パスワード変更 -->
				<div>
					<label for="edit_password" class="block text-sm font-medium text-gray-700 mb-2">
						新しいパスワード
					</label>
					<input
						type="password"
						id="edit_password"
						name="password"
						bind:value={staffPassword}
						placeholder="変更しない場合は空欄のまま"
						minlength="8"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
					<p class="mt-1 text-sm text-gray-500">パスワードを変更する場合は8文字以上で入力してください。変更しない場合は空欄のままにしてください。</p>
				</div>

				<!-- フッター -->
				<div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
					<button
						type="button"
						on:click={closeEditModal}
						class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						キャンセル
					</button>
					<button
						type="submit"
						class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						更新する
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
