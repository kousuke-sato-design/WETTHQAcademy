<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showDeleteModal = false;
	let selectedContent: any = null;

	// ソート設定
	let sortBy: 'number' | 'title' | 'category' | 'type' | 'created_at' = 'number';
	let sortOrder: 'asc' | 'desc' = 'asc';

	// 成功時にモーダルを閉じる
	$: if (form?.success) {
		showDeleteModal = false;
	}

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

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
			video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
			plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
			x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
			trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
			back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>'
		};
		return icons[iconName] || '';
	}

	function getTypeBadgeClass(type: string) {
		return type === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('ja-JP');
	}

	function openDeleteModal(content: any) {
		selectedContent = content;
		showDeleteModal = true;
	}

	function closeModals() {
		showDeleteModal = false;
		selectedContent = null;
	}
</script>

<svelte:head>
	<title>{data.company.company_name} - 企業専用コンテンツ - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- パンくずナビ -->
		<div class="mb-4">
			<a href="/admin/company-contents" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
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
				<p class="text-gray-600">この企業専用のコンテンツを管理します</p>
			</div>
			<a
				href="/admin/company-contents/{data.company.id}/new"
				class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center space-x-2"
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
						<p class="text-sm text-gray-600 mb-1">専用コンテンツ数</p>
						<p class="text-3xl font-bold text-gray-900">{data.contents.length}</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
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
									on:click={() => toggleSort('type')}
									class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
								>
									<span>種類</span>
									{#if sortBy === 'type'}
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
						{#each sortedContents as content}
							<tr class="hover:bg-gray-50">
								<td class="px-4 py-4 whitespace-nowrap">
									<div class="text-sm font-bold text-gray-900 bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center">
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
									<div class="text-sm text-gray-600">{formatDate(content.created_at)}</div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap text-sm">
									<a href="/admin/company-contents/{data.company.id}/edit/{content.id}" class="text-indigo-600 hover:text-indigo-700 font-medium mr-3">編集</a>
									<button
										on:click={() => openDeleteModal(content)}
										class="text-red-600 hover:text-red-700 font-medium"
									>
										削除
									</button>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="6" class="px-6 py-12 text-center text-gray-500">
									コンテンツがまだありません。「新規コンテンツ作成」から追加してください。
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

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
