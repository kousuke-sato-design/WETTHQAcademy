<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// タブの状態管理
	let activeTab: 'company' | 'staff' | 'students' | 'contents' = 'company';
	// コンテンツのサブタブ
	let contentSubTab: 'shared' | 'company' = 'shared';

	// コンテンツの許可状態をローカルで管理（編集可能にするため）
	type ContentPermission = {
		id: number;
		title: string;
		category: string | null;
		created_at: string;
		permitted: boolean;
		display_order: number;
		can_edit: boolean;
	};

	let localSharedContents: ContentPermission[] = [];
	let localCompanyContents: ContentPermission[] = [];

	// データが変更されたらローカル状態を初期化
	$: if (data.sharedContents) {
		localSharedContents = data.sharedContents.map(c => ({ ...c }));
	}
	$: if (data.companyContents) {
		localCompanyContents = data.companyContents.map(c => ({ ...c }));
	}

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
			save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
			users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			student: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
		};
		return icons[iconName] || '';
	}

	// 統一IDかどうかを判定
	function isUnifiedIdUser(user: any) {
		return user.use_unified_id === 1;
	}
</script>

<svelte:head>
	<title>企業編集 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-full">
		<!-- ヘッダー -->
		<div class="mb-8">
			<a
				href="/admin/companies"
				class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
			>
				<div class="w-4 h-4 mr-2">
					{@html getIconSVG('arrowLeft')}
				</div>
				企業管理に戻る
			</a>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">企業情報の編集</h1>
			<p class="text-gray-600">企業コードと企業名を編集できます</p>
		</div>

		<!-- メッセージ表示 -->
		{#if form?.error}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-red-800 font-medium">{form.error}</p>
			</div>
		{/if}
		{#if form?.success}
			<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
				<p class="text-green-800 font-medium">{form.message || '更新しました'}</p>
			</div>
		{/if}

		<!-- タブナビゲーション -->
		<div class="mb-6 border-b border-gray-200">
			<nav class="flex space-x-8">
				<button
					type="button"
					on:click={() => (activeTab = 'company')}
					class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'company'
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				>
					<div class="flex items-center space-x-2">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
							<path d="M9 22v-4h6v4"/>
							<path d="M8 6h.01"/>
							<path d="M16 6h.01"/>
							<path d="M12 6h.01"/>
							<path d="M12 10h.01"/>
							<path d="M12 14h.01"/>
							<path d="M16 10h.01"/>
							<path d="M16 14h.01"/>
							<path d="M8 10h.01"/>
							<path d="M8 14h.01"/>
						</svg>
						<span>企業情報</span>
					</div>
				</button>

				<button
					type="button"
					on:click={() => (activeTab = 'staff')}
					class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'staff'
						? 'border-green-500 text-green-600'
						: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				>
					<div class="flex items-center space-x-2">
						<div class="w-5 h-5">
							{@html getIconSVG('users')}
						</div>
						<span>担当者一覧</span>
						<span class="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
							{data.staff.length}
						</span>
					</div>
				</button>

				<button
					type="button"
					on:click={() => (activeTab = 'students')}
					class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'students'
						? 'border-purple-500 text-purple-600'
						: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				>
					<div class="flex items-center space-x-2">
						<div class="w-5 h-5">
							{@html getIconSVG('student')}
						</div>
						<span>生徒一覧</span>
						<span class="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
							{data.students.length}
						</span>
					</div>
				</button>

				<button
					type="button"
					on:click={() => (activeTab = 'contents')}
					class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'contents'
						? 'border-orange-500 text-orange-600'
						: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				>
					<div class="flex items-center space-x-2">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
							<polyline points="14 2 14 8 20 8"/>
							<line x1="16" y1="13" x2="8" y2="13"/>
							<line x1="16" y1="17" x2="8" y2="17"/>
							<polyline points="10 9 9 9 8 9"/>
						</svg>
						<span>受講コンテンツ</span>
						<span class="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
							{localSharedContents.filter(c => c.permitted).length + localCompanyContents.filter(c => c.permitted).length}
						</span>
					</div>
				</button>
			</nav>
		</div>

		<!-- タブコンテンツ -->
		{#if activeTab === 'company'}
		<!-- 企業情報フォーム（フル幅） -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
			<h2 class="text-xl font-bold text-gray-900 mb-6">企業情報</h2>
			<form method="POST" action="?/updateCompany" use:enhance class="space-y-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
					<label for="company_code" class="block text-sm font-medium text-gray-700 mb-2">
						企業コード
					</label>
					<input
						type="text"
						id="company_code"
						name="company_code"
						value={data.company.company_code || ''}
						disabled
						class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
					/>
					<p class="mt-1 text-sm text-gray-500">
						<svg class="inline w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
							<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
						</svg>
						企業コードは変更できません
					</p>
					</div>

					<div>
						<label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">
							企業名 <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="company_name"
							name="company_name"
							value={data.company.company_name}
							required
							placeholder="例: 株式会社サンプル"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>
				</div>

				<div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
					<a
						href="/admin/companies"
						class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						キャンセル
					</a>
					<button
						type="submit"
						class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center"
					>
						<div class="w-4 h-4 mr-2">
							{@html getIconSVG('save')}
						</div>
						保存する
					</button>
				</div>
			</form>
		</div>

		{:else if activeTab === 'staff'}
		<!-- 担当者一覧（フル幅） -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
			<div class="flex items-center justify-between mb-6">
				<div class="flex items-center space-x-3">
					<div class="w-6 h-6 text-gray-700">
						{@html getIconSVG('users')}
					</div>
					<h2 class="text-xl font-bold text-gray-900">担当者一覧</h2>
				</div>
				<span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
					{data.staff.length}名
				</span>
			</div>

			{#if data.staff.length === 0}
				<div class="text-center py-12">
					<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<div class="w-8 h-8 text-gray-400">
							{@html getIconSVG('users')}
						</div>
					</div>
					<p class="text-gray-500">この企業に登録されている担当者はいません</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each data.staff as staff}
						<div
							class="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover:shadow-md"
						>
							<div>
								<h3 class="font-semibold text-gray-900 mb-2 text-lg">{staff.name}</h3>
								<p class="text-sm text-gray-600 mb-3">{staff.login_id}</p>
								<p class="text-xs text-gray-500">
									登録日: {new Date(staff.created_at).toLocaleDateString('ja-JP')}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{:else if activeTab === 'students'}
		<!-- 生徒一覧（フル幅） -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
			<div class="flex items-center justify-between mb-6">
				<div class="flex items-center space-x-3">
					<div class="w-6 h-6 text-gray-700">
						{@html getIconSVG('student')}
					</div>
					<h2 class="text-xl font-bold text-gray-900">生徒一覧</h2>
				</div>
				<span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
					{data.students.length}名
				</span>
			</div>

			{#if data.students.length === 0}
				<div class="text-center py-12">
					<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<div class="w-8 h-8 text-gray-400">
							{@html getIconSVG('student')}
						</div>
					</div>
					<p class="text-gray-500">この企業に登録されている生徒はいません</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each data.students as student}
						<div
							class="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover:shadow-md"
						>
							<div>
								<div class="flex items-center justify-between mb-2">
									<h3 class="font-semibold text-gray-900 text-lg">{student.name}</h3>
									{#if student.use_unified_id === 1}
										<span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
											統一ID
										</span>
									{/if}
								</div>
								<p class="text-sm text-gray-600 mb-1">
									{#if student.use_unified_id === 1}
										ユーザーID: {student.login_id}
									{:else}
										社員番号: {student.login_id}
									{/if}
								</p>
								<p class="text-xs text-gray-500">
									登録日: {new Date(student.created_at).toLocaleDateString('ja-JP')}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		{:else if activeTab === 'contents'}
		<!-- コンテンツ受講許可 -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
			<h2 class="text-xl font-bold text-gray-900 mb-4">受講許可設定</h2>
			<p class="text-gray-600 mb-6">
				この企業の生徒が閲覧できるコンテンツを選択してください
			</p>

			<!-- サブタブ -->
			<div class="mb-6 border-b border-gray-200">
				<nav class="flex space-x-6">
					<button
						type="button"
						on:click={() => (contentSubTab = 'shared')}
						class="py-3 px-1 border-b-2 font-medium text-sm transition-colors {contentSubTab === 'shared'
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					>
						<div class="flex items-center space-x-2">
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
								<polyline points="14 2 14 8 20 8"/>
							</svg>
							<span>共有コンテンツ</span>
							<span class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
								{localSharedContents.length}
							</span>
						</div>
					</button>
					<button
						type="button"
						on:click={() => (contentSubTab = 'company')}
						class="py-3 px-1 border-b-2 font-medium text-sm transition-colors {contentSubTab === 'company'
							? 'border-purple-500 text-purple-600'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					>
						<div class="flex items-center space-x-2">
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
								<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
							</svg>
							<span>企業専用コンテンツ</span>
							<span class="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
								{localCompanyContents.length}
							</span>
						</div>
					</button>
				</nav>
			</div>

			<form method="POST" action="?/updatePermissions" use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					await invalidateAll();
				}
				await update({ reset: false });
			};
		}}>
				<!-- 両方のコンテンツをhiddenで送信 -->
				{#each localSharedContents as content}
					{#if content.permitted}
						<input type="hidden" name="content_ids[]" value={content.id} />
						<input type="hidden" name="display_order_{content.id}" value={content.display_order} />
						{#if content.can_edit}
							<input type="hidden" name="can_edit_{content.id}" value="on" />
						{/if}
					{/if}
				{/each}
				{#each localCompanyContents as content}
					{#if content.permitted}
						<input type="hidden" name="content_ids[]" value={content.id} />
						<input type="hidden" name="display_order_{content.id}" value={content.display_order} />
						{#if content.can_edit}
							<input type="hidden" name="can_edit_{content.id}" value="on" />
						{/if}
					{/if}
				{/each}

				<!-- 共有コンテンツ -->
				{#if contentSubTab === 'shared'}
					{#if localSharedContents.length === 0}
						<div class="text-center py-12 bg-gray-50 rounded-lg">
							<p class="text-gray-500">共有コンテンツが登録されていません</p>
						</div>
					{:else}
						<div class="space-y-3 mb-6">
							{#each localSharedContents as content, index}
								<div class="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
									<label class="flex items-start flex-1 cursor-pointer">
										<input
											type="checkbox"
											bind:checked={localSharedContents[index].permitted}
											class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										/>
										<div class="ml-3 flex-1">
											<div class="flex items-center justify-between">
												<h3 class="font-medium text-gray-900">{content.title}</h3>
												{#if content.permitted}
													<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
														許可済み
													</span>
												{/if}
											</div>
											{#if content.category}
												<p class="text-sm text-gray-600 mt-1">
													カテゴリ: {content.category}
												</p>
											{/if}
											<p class="text-xs text-gray-500 mt-1">
												作成日: {new Date(content.created_at).toLocaleDateString('ja-JP')}
											</p>
										</div>
									</label>
									<div class="ml-4 flex items-center space-x-4">
										<div class="flex items-center space-x-2">
											<span class="text-sm font-medium text-gray-700 whitespace-nowrap">表示順序:</span>
											<input
												type="number"
												bind:value={localSharedContents[index].display_order}
												min="0"
												class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="0"
											/>
										</div>
										<label class="flex items-center space-x-2 cursor-pointer">
											<input
												type="checkbox"
												bind:checked={localSharedContents[index].can_edit}
												class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
											/>
											<span class="text-sm font-medium text-gray-700 whitespace-nowrap">担当者編集可能</span>
										</label>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{/if}

				<!-- 企業専用コンテンツ -->
				{#if contentSubTab === 'company'}
					{#if localCompanyContents.length === 0}
						<div class="text-center py-12 bg-gray-50 rounded-lg">
							<div class="mb-4">
								<svg class="w-12 h-12 text-gray-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
									<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
								</svg>
							</div>
							<p class="text-gray-500 mb-4">この企業専用のコンテンツがありません</p>
							<a
								href="/admin/company-contents/{data.company.id}"
								class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
							>
								<svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<line x1="12" y1="5" x2="12" y2="19"/>
									<line x1="5" y1="12" x2="19" y2="12"/>
								</svg>
								企業専用コンテンツを作成
							</a>
						</div>
					{:else}
						<div class="space-y-3 mb-6">
							{#each localCompanyContents as content, index}
								<div class="flex items-start p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors bg-purple-50/30">
									<label class="flex items-start flex-1 cursor-pointer">
										<input
											type="checkbox"
											bind:checked={localCompanyContents[index].permitted}
											class="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
										/>
										<div class="ml-3 flex-1">
											<div class="flex items-center justify-between">
												<div class="flex items-center space-x-2">
													<h3 class="font-medium text-gray-900">{content.title}</h3>
													<span class="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">
														専用
													</span>
												</div>
												{#if content.permitted}
													<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
														許可済み
													</span>
												{/if}
											</div>
											{#if content.category}
												<p class="text-sm text-gray-600 mt-1">
													カテゴリ: {content.category}
												</p>
											{/if}
											<p class="text-xs text-gray-500 mt-1">
												作成日: {new Date(content.created_at).toLocaleDateString('ja-JP')}
											</p>
										</div>
									</label>
									<div class="ml-4 flex items-center space-x-4">
										<div class="flex items-center space-x-2">
											<span class="text-sm font-medium text-gray-700 whitespace-nowrap">表示順序:</span>
											<input
												type="number"
												bind:value={localCompanyContents[index].display_order}
												min="0"
												class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
												placeholder="0"
											/>
										</div>
										<label class="flex items-center space-x-2 cursor-pointer">
											<input
												type="checkbox"
												bind:checked={localCompanyContents[index].can_edit}
												class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
											/>
											<span class="text-sm font-medium text-gray-700 whitespace-nowrap">担当者編集可能</span>
										</label>
									</div>
								</div>
							{/each}
						</div>

						<div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<a
								href="/admin/company-contents/{data.company.id}"
								class="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
							>
								<svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
									<polyline points="15 3 21 3 21 9"/>
									<line x1="10" y1="14" x2="21" y2="3"/>
								</svg>
								企業専用コンテンツ管理ページへ
							</a>
						</div>
					{/if}
				{/if}

				<div class="flex justify-end">
					<button
						type="submit"
						class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex items-center transition-colors"
					>
						<div class="w-4 h-4 mr-2">
							{@html getIconSVG('save')}
						</div>
						受講許可を更新
					</button>
				</div>
			</form>
		</div>
		{/if}
	</div>
</Layout>
