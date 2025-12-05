<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// タブ切り替え（共通テンプレート / 企業専用テンプレート）
	let activeTab: 'shared' | 'company' = 'shared';

	let showCreateModal = false;
	let showEditModal = false;
	let showDeleteModal = false;
	let showDetailModal = false;
	let selectedTemplate: any = null;

	// フォーム入力
	let title = '';
	let subject = '';
	let body = '';
	let description = '';
	let category = 'login';

	// カテゴリ一覧
	const categories = [
		{ value: 'login', label: 'ログイン案内' },
		{ value: 'reminder', label: 'リマインダー' },
		{ value: 'notification', label: 'お知らせ' },
		{ value: 'other', label: 'その他' }
	];

	// 成功時にモーダルを閉じる
	$: if (form?.success) {
		closeModals();
	}

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
			plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
			x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
			trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
			edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
			eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
			copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
			send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
			company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
			arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
			share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
		};
		return icons[iconName] || '';
	}

	function getCategoryLabel(value: string) {
		return categories.find(c => c.value === value)?.label || value;
	}

	function openCreateModal() {
		title = '';
		subject = '';
		body = '';
		description = '';
		category = 'login';
		showCreateModal = true;
	}

	function openEditModal(template: any) {
		selectedTemplate = template;
		title = template.title;
		subject = template.subject || '';
		body = template.body;
		description = template.description || '';
		category = template.category;
		showEditModal = true;
	}

	function openDeleteModal(template: any) {
		selectedTemplate = template;
		showDeleteModal = true;
	}

	function openDetailModal(template: any) {
		selectedTemplate = template;
		showDetailModal = true;
	}

	function closeModals() {
		showCreateModal = false;
		showEditModal = false;
		showDeleteModal = false;
		showDetailModal = false;
		selectedTemplate = null;
		title = '';
		subject = '';
		body = '';
		description = '';
		category = 'login';
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		alert('クリップボードにコピーしました');
	}

	function openMailClient(template: any) {
		const mailtoSubject = encodeURIComponent(template.subject || '');
		const mailtoBody = encodeURIComponent(template.body);
		window.location.href = `mailto:?subject=${mailtoSubject}&body=${mailtoBody}`;
	}
</script>

<svelte:head>
	<title>メールテンプレート - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- ヘッダー -->
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">テンプレート管理</h1>
			<p class="text-gray-600">メールテンプレートの作成と管理</p>
		</div>

		<!-- タブ切り替え -->
		<div class="mb-6">
			<div class="border-b border-gray-200">
				<nav class="-mb-px flex space-x-8">
					<button
						on:click={() => activeTab = 'shared'}
						class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'shared' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					>
						<div class="flex items-center space-x-2">
							<div class="w-4 h-4">{@html getIconSVG('share')}</div>
							<span>共通テンプレート</span>
							<span class="bg-purple-100 text-purple-600 py-0.5 px-2 rounded-full text-xs">{data.templates?.length || 0}</span>
						</div>
					</button>
					<button
						on:click={() => activeTab = 'company'}
						class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'company' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					>
						<div class="flex items-center space-x-2">
							<div class="w-4 h-4">{@html getIconSVG('company')}</div>
							<span>企業専用テンプレート</span>
							<span class="bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">{data.companies?.length || 0}</span>
						</div>
					</button>
				</nav>
			</div>
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

		<!-- 共通テンプレートタブ -->
		{#if activeTab === 'shared'}
		<div class="flex items-center justify-end mb-6">
			<button
				on:click={openCreateModal}
				class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center space-x-2"
			>
				<div class="w-4 h-4">
					{@html getIconSVG('plus')}
				</div>
				<span>新規テンプレート</span>
			</button>
		</div>

		<!-- テンプレートリスト -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-900">共通テンプレート一覧</h2>
				<span class="text-sm text-gray-600">{data.templates?.length || 0}件</span>
			</div>

			{#if data.templates && data.templates.length > 0}
				<div class="divide-y divide-gray-200">
					{#each data.templates as template}
						<div class="p-6 hover:bg-gray-50 transition-colors">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center space-x-3 mb-2">
										<h3 class="text-lg font-semibold text-gray-900">{template.title}</h3>
										<span class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
											{getCategoryLabel(template.category)}
										</span>
									</div>
									{#if template.subject}
										<p class="text-sm text-gray-600 mb-1">
											<span class="font-medium">件名:</span> {template.subject}
										</p>
									{/if}
									{#if template.description}
										<p class="text-sm text-gray-500">{template.description}</p>
									{/if}
									<p class="text-xs text-gray-400 mt-2">
										更新日: {new Date(template.updated_at).toLocaleDateString('ja-JP')}
									</p>
								</div>
								<div class="flex items-center space-x-2 ml-4">
									<button
										on:click={() => openDetailModal(template)}
										class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
										title="詳細を見る"
									>
										<div class="w-5 h-5">
											{@html getIconSVG('eye')}
										</div>
									</button>
									<button
										on:click={() => openMailClient(template)}
										class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
										title="メーラーで開く"
									>
										<div class="w-5 h-5">
											{@html getIconSVG('send')}
										</div>
									</button>
									<button
										on:click={() => openEditModal(template)}
										class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
										title="編集"
									>
										<div class="w-5 h-5">
											{@html getIconSVG('edit')}
										</div>
									</button>
									<button
										on:click={() => openDeleteModal(template)}
										class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
										title="削除"
									>
										<div class="w-5 h-5">
											{@html getIconSVG('trash')}
										</div>
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="p-12 text-center">
					<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<div class="w-8 h-8 text-gray-400">
							{@html getIconSVG('mail')}
						</div>
					</div>
					<p class="text-gray-500 mb-4">テンプレートがありません</p>
					<button
						on:click={openCreateModal}
						class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
					>
						最初のテンプレートを作成
					</button>
				</div>
			{/if}
		</div>
		{/if}

		<!-- 企業専用テンプレートタブ -->
		{#if activeTab === 'company'}
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">企業を選択してテンプレートを管理</h2>
				<p class="text-sm text-gray-600 mt-1">各企業専用のテンプレートを作成・編集できます</p>
			</div>
			<div class="divide-y divide-gray-200">
				{#each data.companies || [] as company}
					<a
						href="/admin/company-templates/{company.id}"
						class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
					>
						<div class="flex items-center space-x-4">
							<div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
								<div class="w-5 h-5">
									{@html getIconSVG('company')}
								</div>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900">{company.company_name}</p>
								<p class="text-xs text-gray-500">企業コード: {company.company_code || '-'}</p>
							</div>
						</div>
						<div class="flex items-center space-x-4">
							<div class="text-right">
								<p class="text-sm font-medium text-gray-900">{company.template_count || 0}</p>
								<p class="text-xs text-gray-500">テンプレート</p>
							</div>
							<div class="w-5 h-5 text-gray-400">
								{@html getIconSVG('arrow')}
							</div>
						</div>
					</a>
				{:else}
					<div class="px-6 py-12 text-center text-gray-500">
						企業が登録されていません。<br />
						<a href="/admin/companies" class="text-green-600 hover:underline">企業管理</a>から企業を登録してください。
					</div>
				{/each}
			</div>
		</div>
		{/if}
	</div>
</Layout>

<!-- 新規作成モーダル -->
{#if showCreateModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900">新規テンプレート作成</h2>
				<button
					on:click={closeModals}
					class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
				>
					<div class="w-5 h-5 text-gray-500">
						{@html getIconSVG('x')}
					</div>
				</button>
			</div>

			<form method="POST" action="?/createTemplate" use:enhance class="p-6 space-y-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
							テンプレート名 <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							name="title"
							bind:value={title}
							required
							placeholder="例: ログイン情報のお知らせ"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
						/>
					</div>
					<div>
						<label for="category" class="block text-sm font-medium text-gray-700 mb-2">
							カテゴリ
						</label>
						<select
							id="category"
							name="category"
							bind:value={category}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
						>
							{#each categories as cat}
								<option value={cat.value}>{cat.label}</option>
							{/each}
						</select>
					</div>
				</div>

				<div>
					<label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
						メール件名
					</label>
					<input
						type="text"
						id="subject"
						name="subject"
						bind:value={subject}
						placeholder="例: 【WEBTHQAcademy】ログイン情報のお知らせ"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
					/>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
						説明（管理用メモ）
					</label>
					<input
						type="text"
						id="description"
						name="description"
						bind:value={description}
						placeholder="例: 新規生徒へのログイン情報案内用"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
					/>
				</div>

				<div>
					<label for="body" class="block text-sm font-medium text-gray-700 mb-2">
						本文 <span class="text-red-500">*</span>
					</label>
					<textarea
						id="body"
						name="body"
						bind:value={body}
						required
						rows="12"
						placeholder="メール本文を入力してください。&#10;&#10;変数: {{名前}}, {{ログインID}}, {{パスワード}}, {{ログインURL}} など"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm"
					></textarea>
					<p class="mt-2 text-sm text-gray-500">
						利用可能な変数: <code class="bg-gray-100 px-1 rounded">{"{{名前}}"}</code>, <code class="bg-gray-100 px-1 rounded">{"{{ログインID}}"}</code>, <code class="bg-gray-100 px-1 rounded">{"{{パスワード}}"}</code>, <code class="bg-gray-100 px-1 rounded">{"{{ログインURL}}"}</code>, <code class="bg-gray-100 px-1 rounded">{"{{企業名}}"}</code>
					</p>
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
						class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						作成する
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- 編集モーダル -->
{#if showEditModal && selectedTemplate}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900">テンプレートを編集</h2>
				<button
					on:click={closeModals}
					class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
				>
					<div class="w-5 h-5 text-gray-500">
						{@html getIconSVG('x')}
					</div>
				</button>
			</div>

			<form method="POST" action="?/updateTemplate" use:enhance class="p-6 space-y-6">
				<input type="hidden" name="id" value={selectedTemplate.id} />

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="edit_title" class="block text-sm font-medium text-gray-700 mb-2">
							テンプレート名 <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="edit_title"
							name="title"
							bind:value={title}
							required
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
						/>
					</div>
					<div>
						<label for="edit_category" class="block text-sm font-medium text-gray-700 mb-2">
							カテゴリ
						</label>
						<select
							id="edit_category"
							name="category"
							bind:value={category}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
						>
							{#each categories as cat}
								<option value={cat.value}>{cat.label}</option>
							{/each}
						</select>
					</div>
				</div>

				<div>
					<label for="edit_subject" class="block text-sm font-medium text-gray-700 mb-2">
						メール件名
					</label>
					<input
						type="text"
						id="edit_subject"
						name="subject"
						bind:value={subject}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
					/>
				</div>

				<div>
					<label for="edit_description" class="block text-sm font-medium text-gray-700 mb-2">
						説明（管理用メモ）
					</label>
					<input
						type="text"
						id="edit_description"
						name="description"
						bind:value={description}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
					/>
				</div>

				<div>
					<label for="edit_body" class="block text-sm font-medium text-gray-700 mb-2">
						本文 <span class="text-red-500">*</span>
					</label>
					<textarea
						id="edit_body"
						name="body"
						bind:value={body}
						required
						rows="12"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm"
					></textarea>
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
						class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						更新する
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- 詳細モーダル -->
{#if showDetailModal && selectedTemplate}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900">{selectedTemplate.title}</h2>
				<button
					on:click={closeModals}
					class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
				>
					<div class="w-5 h-5 text-gray-500">
						{@html getIconSVG('x')}
					</div>
				</button>
			</div>

			<div class="p-6 space-y-6">
				<div class="flex items-center space-x-4">
					<span class="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
						{getCategoryLabel(selectedTemplate.category)}
					</span>
					{#if selectedTemplate.description}
						<span class="text-sm text-gray-500">{selectedTemplate.description}</span>
					{/if}
				</div>

				{#if selectedTemplate.subject}
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">件名</label>
						<div class="flex items-center space-x-2">
							<div class="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
								<p class="text-gray-900">{selectedTemplate.subject}</p>
							</div>
							<button
								on:click={() => copyToClipboard(selectedTemplate.subject)}
								class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
								title="コピー"
							>
								<div class="w-5 h-5">
									{@html getIconSVG('copy')}
								</div>
							</button>
						</div>
					</div>
				{/if}

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">本文</label>
					<div class="flex items-start space-x-2">
						<div class="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<pre class="whitespace-pre-wrap text-gray-900 font-sans text-sm">{selectedTemplate.body}</pre>
						</div>
						<button
							on:click={() => copyToClipboard(selectedTemplate.body)}
							class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex-shrink-0"
							title="コピー"
						>
							<div class="w-5 h-5">
								{@html getIconSVG('copy')}
							</div>
						</button>
					</div>
				</div>

				<div class="flex items-center justify-between pt-4 border-t border-gray-200">
					<button
						on:click={() => openMailClient(selectedTemplate)}
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
					>
						<div class="w-4 h-4">
							{@html getIconSVG('send')}
						</div>
						<span>メーラーで開く</span>
					</button>
					<button
						on:click={closeModals}
						class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
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
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
			<div class="p-6">
				<div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<div class="w-6 h-6 text-red-600">
						{@html getIconSVG('trash')}
					</div>
				</div>

				<h2 class="text-xl font-bold text-gray-900 text-center mb-2">テンプレートを削除しますか？</h2>
				<p class="text-gray-600 text-center mb-6">
					「{selectedTemplate.title}」を削除します。この操作は元に戻せません。
				</p>

				<form method="POST" action="?/deleteTemplate" use:enhance class="space-y-3">
					<input type="hidden" name="id" value={selectedTemplate.id} />

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
