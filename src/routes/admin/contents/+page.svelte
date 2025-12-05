<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// タブ切り替え（共有コンテンツ / 企業専用コンテンツ）
	let activeTab: 'shared' | 'company' = 'shared';

	let showCreateModal = false;
	let showDeleteModal = false;
	let selectedContent: any = null;

	// ソート設定
	let sortBy: 'number' | 'title' | 'category' | 'type' | 'created_at' = 'number';
	let sortOrder: 'asc' | 'desc' = 'asc';

	// フォーム入力
	let title = '';
	let description = '';
	let contentType = 'video';
	let contentUrl = '';
	let category = '';
	let order = '0';

	// 作成日順に番号を付与したコンテンツ
	$: numberedContents = [...data.contents]
		.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
		.map((content, index) => ({
			...content,
			number: index + 1
		}));

	// ソートされたコンテンツ
	$: sortedContents = [...numberedContents].sort((a, b) => {
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
			case 'type':
				comparison = a.content_type.localeCompare(b.content_type);
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

	// 成功時にモーダルを閉じる
	$: if (form?.success) {
		showCreateModal = false;
		showDeleteModal = false;
		title = '';
		description = '';
		contentType = 'video';
		contentUrl = '';
		category = '';
		order = '0';
	}

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
			video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
			plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
			x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
			trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
			company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
			arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
			share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
		};
		return icons[iconName] || '';
	}

	function getTypeBadgeClass(type: string) {
		return type === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('ja-JP');
	}

	function openCreateModal() {
		showCreateModal = true;
	}

	function openDeleteModal(content: any) {
		selectedContent = content;
		showDeleteModal = true;
	}

	function closeModals() {
		showCreateModal = false;
		showDeleteModal = false;
		selectedContent = null;
	}
</script>

<svelte:head>
	<title>コンテンツ管理 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- ヘッダー -->
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">コンテンツ管理</h1>
			<p class="text-gray-600">学習コンテンツの作成と管理</p>
		</div>

		<!-- タブ切り替え -->
		<div class="mb-6">
			<div class="border-b border-gray-200">
				<nav class="-mb-px flex space-x-8">
					<button
						on:click={() => activeTab = 'shared'}
						class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'shared' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					>
						<div class="flex items-center space-x-2">
							<div class="w-4 h-4">{@html getIconSVG('share')}</div>
							<span>共有コンテンツ</span>
							<span class="bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">{data.contents.length}</span>
						</div>
					</button>
					<button
						on:click={() => activeTab = 'company'}
						class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'company' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					>
						<div class="flex items-center space-x-2">
							<div class="w-4 h-4">{@html getIconSVG('company')}</div>
							<span>企業専用コンテンツ</span>
							<span class="bg-purple-100 text-purple-600 py-0.5 px-2 rounded-full text-xs">{data.companies?.length || 0}</span>
						</div>
					</button>
				</nav>
			</div>
		</div>

		<!-- 共有コンテンツタブ -->
		{#if activeTab === 'shared'}
		<div class="flex items-center justify-end mb-6">
			<a
				href="/admin/contents/new"
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center space-x-2"
			>
				<div class="w-4 h-4">
					{@html getIconSVG('plus')}
				</div>
				<span>新規コンテンツ作成</span>
			</a>
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
							{@html getIconSVG('document')}
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">動画コンテンツ</p>
						<p class="text-3xl font-bold text-gray-900">
							{data.contents.filter(c => c.content_type === 'video').length}
						</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
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
							{data.contents.filter(c => c.content_type === 'text').length}
						</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
						<div class="w-7 h-7">
							{@html getIconSVG('document')}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- コンテンツリスト -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">コンテンツ一覧</h2>
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
										<span class="text-blue-600">{sortOrder === 'asc' ? '▲' : '▼'}</span>
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
										<span class="text-blue-600">{sortOrder === 'asc' ? '▲' : '▼'}</span>
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
										<span class="text-blue-600">{sortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleSort('type')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>種類</span>
									{#if sortBy === 'type'}
										<span class="text-blue-600">{sortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<button
									on:click={() => toggleSort('created_at')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>作成日</span>
									{#if sortBy === 'created_at'}
										<span class="text-blue-600">{sortOrder === 'asc' ? '▲' : '▼'}</span>
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each sortedContents as content}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm font-bold text-gray-900 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
										{content.number}
									</div>
								</td>
								<td class="px-4 py-4">
									<div class="text-sm font-medium text-gray-900">{content.title}</div>
									{#if content.description}
										<div class="text-xs text-gray-500 mt-1">{content.description}</div>
									{/if}
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{content.category || '-'}</div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<span class="px-2 py-1 text-xs font-medium rounded-full {getTypeBadgeClass(content.content_type)}">
										{content.content_type === 'video' ? '動画' : 'テキスト'}
									</span>
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
										公開中
									</span>
								</td>
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-600">{formatDate(content.created_at)}</div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap text-sm">
									<a href="/admin/contents/edit/{content.id}" class="text-blue-600 hover:text-blue-700 font-medium mr-3">編集</a>
									<button
										on:click={() => openDeleteModal(content)}
										class="text-red-600 hover:text-red-700 font-medium"
									>
										削除
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		{/if}

		<!-- 企業専用コンテンツタブ -->
		{#if activeTab === 'company'}
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">企業を選択してコンテンツを管理</h2>
				<p class="text-sm text-gray-600 mt-1">各企業専用のコンテンツを作成・編集できます</p>
			</div>
			<div class="divide-y divide-gray-200">
				{#each data.companies || [] as company}
					<a
						href="/admin/company-contents/{company.id}"
						class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
					>
						<div class="flex items-center space-x-4">
							<div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
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
								<p class="text-sm font-medium text-gray-900">{company.content_count || 0}</p>
								<p class="text-xs text-gray-500">コンテンツ</p>
							</div>
							<div class="w-5 h-5 text-gray-400">
								{@html getIconSVG('arrow')}
							</div>
						</div>
					</a>
				{:else}
					<div class="px-6 py-12 text-center text-gray-500">
						企業が登録されていません。<br />
						<a href="/admin/companies" class="text-blue-600 hover:underline">企業管理</a>から企業を登録してください。
					</div>
				{/each}
			</div>
		</div>
		{/if}
	</div>

	<!-- 新規コンテンツ作成モーダル -->
	{#if showCreateModal}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div class="p-6 border-b border-gray-200 flex items-center justify-between">
					<h2 class="text-xl font-bold text-gray-900">新規コンテンツ作成</h2>
					<button
						on:click={closeModals}
						class="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<div class="w-6 h-6">
							{@html getIconSVG('x')}
						</div>
					</button>
				</div>

				{#if form?.error}
					<div class="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-red-800 text-sm font-medium">{form.error}</p>
					</div>
				{/if}

				<form method="POST" action="?/createContent" use:enhance class="p-6 space-y-6">
					<div>
						<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
							タイトル <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							name="title"
							bind:value={title}
							required
							placeholder="例: JavaScript入門"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
							説明
						</label>
						<textarea
							id="description"
							name="description"
							bind:value={description}
							rows="3"
							placeholder="コンテンツの説明を入力"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						></textarea>
					</div>

					<div>
						<label for="content_type" class="block text-sm font-medium text-gray-700 mb-2">
							コンテンツ種別 <span class="text-red-500">*</span>
						</label>
						<select
							id="content_type"
							name="content_type"
							bind:value={contentType}
							required
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						>
							<option value="video">動画</option>
							<option value="text">テキスト</option>
						</select>
					</div>

					<div>
						<label for="content_url" class="block text-sm font-medium text-gray-700 mb-2">
							コンテンツURL <span class="text-red-500">*</span>
						</label>
						<input
							type="url"
							id="content_url"
							name="content_url"
							bind:value={contentUrl}
							required
							placeholder="https://..."
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>

					<div>
						<label for="category" class="block text-sm font-medium text-gray-700 mb-2">
							カテゴリ
						</label>
						<input
							type="text"
							id="category"
							name="category"
							bind:value={category}
							placeholder="例: プログラミング基礎"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>

					<div>
						<label for="order" class="block text-sm font-medium text-gray-700 mb-2">
							表示順序
						</label>
						<input
							type="number"
							id="order"
							name="order"
							bind:value={order}
							min="0"
							placeholder="0"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
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
							作成する
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- 削除確認モーダル -->
	{#if showDeleteModal && selectedContent}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-md w-full">
				<div class="p-6">
					<div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
						<div class="w-6 h-6 text-red-600">
							{@html getIconSVG('trash')}
						</div>
					</div>
					<h2 class="text-xl font-bold text-gray-900 text-center mb-2">コンテンツを削除</h2>
					<p class="text-gray-600 text-center mb-6">
						「{selectedContent.title}」を削除してもよろしいですか?<br />
						この操作は取り消せません。
					</p>

					<form method="POST" action="?/deleteContent" use:enhance class="space-y-3">
						<input type="hidden" name="id" value={selectedContent.id} />
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
</Layout>
