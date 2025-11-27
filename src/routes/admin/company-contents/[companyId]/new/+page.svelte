<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// 基本情報
	let title = '';
	let description = '';
	let category = '';
	let order = '0';
	let showInSidebar = true;
	let sidebarIcon = 'document';
	let sidebarOrder = '0';

	// フォームリセット
	$: if (form?.success) {
		title = '';
		description = '';
		category = '';
		order = '0';
		showInSidebar = true;
		sidebarIcon = 'document';
		sidebarOrder = '0';
	}

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>新規コンテンツ作成 - {data.company.company_name} - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-4xl mx-auto">
		<!-- パンくずナビ -->
		<div class="mb-4">
			<a href="/admin/company-contents/{data.company.id}" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
				<div class="w-4 h-4 mr-1">
					{@html getIconSVG('back')}
				</div>
				{data.company.company_name}に戻る
			</a>
		</div>

		<!-- ヘッダー -->
		<div class="mb-8">
			<div class="flex items-center space-x-2 mb-2">
				<span class="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
					{data.company.company_code}
				</span>
				<span class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
					企業専用
				</span>
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">新規コンテンツ作成</h1>
			<p class="text-gray-600">{data.company.company_name}専用の学習コンテンツを作成します</p>
		</div>

		<!-- 成功メッセージ -->
		{#if form?.success}
			<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
				<p class="text-green-800 font-medium">{form.message}</p>
				<a href="/admin/company-contents/{data.company.id}" class="text-green-600 underline text-sm">
					コンテンツ一覧に戻る
				</a>
			</div>
		{/if}

		<!-- エラーメッセージ -->
		{#if form?.error}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-red-800 font-medium">{form.error}</p>
			</div>
		{/if}

		<!-- メインフォーム -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<form method="POST" use:enhance class="space-y-6">
				<!-- タイトル -->
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
						placeholder="例: 社内研修ガイド"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>

				<!-- 説明 -->
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
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					></textarea>
				</div>

				<!-- カテゴリ -->
				<div>
					<label for="category" class="block text-sm font-medium text-gray-700 mb-2">
						カテゴリ
					</label>
					<input
						type="text"
						id="category"
						name="category"
						bind:value={category}
						placeholder="例: 社内研修"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>

				<!-- 表示順序 -->
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
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>

				<!-- サイドバー表示 -->
				<div class="flex items-center">
					<input
						type="checkbox"
						id="showInSidebar"
						name="showInSidebar"
						bind:checked={showInSidebar}
						class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
					/>
					<label for="showInSidebar" class="ml-2 text-sm text-gray-700">
						サイドバーに表示する
					</label>
				</div>

				<!-- サイドバーアイコン -->
				{#if showInSidebar}
					<div>
						<label for="sidebarIcon" class="block text-sm font-medium text-gray-700 mb-2">
							サイドバーアイコン
						</label>
						<select
							id="sidebarIcon"
							name="sidebarIcon"
							bind:value={sidebarIcon}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						>
							<option value="document">ドキュメント</option>
							<option value="video">動画</option>
							<option value="book">本</option>
							<option value="clipboard">クリップボード</option>
						</select>
					</div>

					<!-- サイドバー表示順序 -->
					<div>
						<label for="sidebarOrder" class="block text-sm font-medium text-gray-700 mb-2">
							サイドバー表示順序
						</label>
						<input
							type="number"
							id="sidebarOrder"
							name="sidebarOrder"
							bind:value={sidebarOrder}
							min="0"
							placeholder="0"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
					</div>
				{/if}

				<!-- セクションデータ（空のJSON） -->
				<input type="hidden" name="sections" value="[]" />

				<!-- ボタン -->
				<div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
					<a
						href="/admin/company-contents/{data.company.id}"
						class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						キャンセル
					</a>
					<button
						type="submit"
						class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						作成する
					</button>
				</div>
			</form>
		</div>
	</div>
</Layout>
