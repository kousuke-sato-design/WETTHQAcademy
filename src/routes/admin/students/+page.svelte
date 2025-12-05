<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showCreateModal = false;
	let showDeleteModal = false;
	let showEditModal = false;
	let selectedStudent: any = null;

	// フォーム入力
	let selectedCompanyId = '';
	let employeeNumber = '';
	let studentName = '';

	// 編集フォーム入力
	let editLoginId = '';
	let editPassword = '';
	let isSubmitting = false;
	let editError = '';

	// フィルター
	let selectedFilterCompanyId = '';

	// 成功時にモーダルを閉じる
	$: if (form?.success) {
		showCreateModal = false;
		showDeleteModal = false;
		showEditModal = false;
		selectedCompanyId = '';
		employeeNumber = '';
		studentName = '';
		editLoginId = '';
		editPassword = '';
	}

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
			x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
			trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
			filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
			student: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
			edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
		};
		return icons[iconName] || '';
	}

	function openCreateModal() {
		showCreateModal = true;
	}

	function openEditModal(student: any) {
		selectedStudent = student;
		editLoginId = student.login_id;  // 現在のユーザーIDをセット
		editPassword = '';  // パスワードは空にする
		showEditModal = true;
	}

	function openDeleteModal(student: any) {
		selectedStudent = student;
		showDeleteModal = true;
	}

	function closeModals() {
		showCreateModal = false;
		showDeleteModal = false;
		showEditModal = false;
		selectedStudent = null;
		editLoginId = '';
		editPassword = '';
		editError = '';
		isSubmitting = false;
	}

	// フィルタリングされた生徒
	$: filteredStudents = (data.students || []).filter(student => {
		if (selectedFilterCompanyId && student.company_id?.toString() !== selectedFilterCompanyId) {
			return false;
		}
		return true;
	});
</script>

<svelte:head>
	<title>生徒管理 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- ヘッダー -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">生徒管理</h1>
				<p class="text-gray-600">生徒アカウントの登録と管理</p>
			</div>
			<button
				on:click={openCreateModal}
				class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center space-x-2"
			>
				<div class="w-4 h-4">
					{@html getIconSVG('plus')}
				</div>
				<span>新規生徒登録</span>
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
						<p class="text-3xl font-bold text-gray-900">{data.students?.length || 0}</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white"
					>
						<div class="w-7 h-7">
							{@html getIconSVG('student')}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- フィルター -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
			<div class="flex items-center space-x-2 mb-4">
				<div class="w-5 h-5 text-gray-700">
					{@html getIconSVG('filter')}
				</div>
				<h2 class="text-lg font-semibold text-gray-900">企業フィルター</h2>
			</div>
			<div class="max-w-md">
				<select
					id="filter_company"
					bind:value={selectedFilterCompanyId}
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
				>
					<option value="">全ての企業</option>
					{#each data.companies || [] as company}
						<option value={company.id}>
							{company.company_name} {company.company_code ? `(${company.company_code})` : ''}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- 生徒リスト -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900">生徒一覧</h2>
				<span class="text-sm text-gray-600">{filteredStudents.length}名</span>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">社員番号</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属企業</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種別</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登録日</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each filteredStudents as student, index}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">{index + 1}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{student.name}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{student.login_id}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{student.company_name || '-'}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if Number(student.use_unified_id) === 1}
										<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
											統一ID
										</span>
									{:else}
										<span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
											通常
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">
										{new Date(student.created_at).toLocaleDateString('ja-JP')}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm">
									<div class="flex items-center space-x-3">
										{#if Number(student.use_unified_id) === 1}
											<button
												type="button"
												on:click={() => openEditModal(student)}
												class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
											>
												<div class="w-4 h-4 mr-1">
													{@html getIconSVG('edit')}
												</div>
												編集
											</button>
										{/if}
										<button
											on:click={() => openDeleteModal(student)}
											class="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
										>
											<div class="w-4 h-4 mr-1">
												{@html getIconSVG('trash')}
											</div>
											削除
										</button>
									</div>
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

			<form method="POST" action="?/createStudent" use:enhance class="p-6 space-y-6">
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
							{#each data.companies || [] as company}
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
						<label for="student_name" class="block text-sm font-medium text-gray-700 mb-2">
							名前 <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="student_name"
							name="name"
							bind:value={studentName}
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

<!-- 編集モーダル（統一ID用） -->
{#if showEditModal && selectedStudent}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900">統一ID生徒の編集</h2>
				<button
					on:click={closeModals}
					class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
				>
					<div class="w-5 h-5 text-gray-500">
						{@html getIconSVG('x')}
					</div>
				</button>
			</div>

			<form method="POST" action="?/updateStudent" use:enhance={() => {
				isSubmitting = true;
				editError = '';
				return async ({ result, update }) => {
					isSubmitting = false;
					if (result.type === 'failure') {
						editError = result.data?.error || '更新に失敗しました';
					} else if (result.type === 'success') {
						await update();
					} else {
						await update();
					}
				};
			}} class="p-6 space-y-6">
				<input type="hidden" name="id" value={selectedStudent.id} />

				<!-- エラー表示 -->
				{#if editError}
					<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-red-800 font-medium">{editError}</p>
					</div>
				{/if}

				<div class="space-y-4">
					<!-- 生徒情報（表示のみ） -->
					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div class="flex items-center space-x-2 mb-2">
							<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
								統一ID
							</span>
						</div>
						<p class="text-sm text-gray-700 mb-1">
							<span class="font-medium">名前:</span> {selectedStudent.name}
						</p>
						<p class="text-sm text-gray-700">
							<span class="font-medium">所属企業:</span> {selectedStudent.company_name || '-'}
						</p>
					</div>

					<!-- ユーザーID変更 -->
					<div>
						<label for="edit_login_id" class="block text-sm font-medium text-gray-700 mb-2">
							ユーザーID <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="edit_login_id"
							name="login_id"
							bind:value={editLoginId}
							required
							placeholder="ユーザーIDを入力"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						<p class="mt-1 text-sm text-gray-500">
							生徒がログインする際に使用するIDです
						</p>
					</div>

					<!-- パスワード変更 -->
					<div>
						<label for="edit_password" class="block text-sm font-medium text-gray-700 mb-2">
							新しいパスワード <span class="text-gray-400 text-xs font-normal">（変更する場合のみ入力）</span>
						</label>
						<input
							type="password"
							id="edit_password"
							name="password"
							bind:value={editPassword}
							placeholder="新しいパスワードを入力（空欄でIDのみ変更）"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						<p class="mt-1 text-sm text-gray-500">
							空欄の場合、パスワードは変更されません
						</p>
					</div>
				</div>

				<div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
					<button
						type="button"
						on:click={closeModals}
						disabled={isSubmitting}
						class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
					>
						キャンセル
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isSubmitting}
							<span class="flex items-center">
								<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								更新中...
							</span>
						{:else}
							更新する
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- 削除確認モーダル -->
{#if showDeleteModal && selectedStudent}
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
					「{selectedStudent.name}」を削除します。この操作は元に戻せません。
				</p>

				<form method="POST" action="?/deleteStudent" use:enhance class="space-y-3">
					<input type="hidden" name="id" value={selectedStudent.id} />

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
