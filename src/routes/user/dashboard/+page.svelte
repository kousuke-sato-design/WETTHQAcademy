<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>ダッシュボード - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user} contents={data.contents}>
	<div class="max-w-4xl">
		<h1 class="text-3xl font-bold text-gray-900 mb-6">学習ダッシュボード</h1>

		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">ようこそ</h2>
			<p class="text-gray-600">
				左のサイドバーから学習コンテンツを選択してください。
			</p>
		</div>

		{#if data.contents.length > 0}
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-4">利用可能なコンテンツ</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each data.contents as content}
						<a
							href="/user/contents/{content.id}"
							class="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
						>
							<h3 class="font-medium text-gray-900">{content.title}</h3>
						</a>
					{/each}
				</div>
			</div>
		{:else}
			<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
				<p class="text-yellow-800">現在利用可能なコンテンツはありません。</p>
			</div>
		{/if}
	</div>
</Layout>
