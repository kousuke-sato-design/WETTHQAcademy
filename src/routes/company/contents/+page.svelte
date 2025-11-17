<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('ja-JP', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			checkCircle:
				'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
			xCircle:
				'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>コンテンツ管理 - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-7xl">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">コンテンツ管理</h1>
			<p class="text-gray-600">
				御社が受講可能なコンテンツの一覧です。緑色のチェックマークが付いているコンテンツを生徒が閲覧できます。
			</p>
		</div>

		<!-- 統計 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">受講可能コンテンツ</p>
						<p class="text-3xl font-bold text-green-600">{data.contents.length}</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white"
					>
						<div class="w-7 h-7">
							{@html getIconSVG('checkCircle')}
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">全コンテンツ数</p>
						<p class="text-3xl font-bold text-gray-900">{data.allContents.length}</p>
					</div>
					<div
						class="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white"
					>
						<svg
							class="w-7 h-7"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
							/>
							<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- コンテンツ一覧 -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="p-6 border-b border-gray-200">
				<h2 class="text-xl font-bold text-gray-900">全コンテンツ一覧</h2>
			</div>

			{#if data.allContents.length === 0}
				<div class="p-12 text-center text-gray-500">
					<p>コンテンツが登録されていません。</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 border-b border-gray-200">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									状態
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									タイトル
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									カテゴリー
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									説明
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									登録日
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each data.allContents as content}
								<tr class="hover:bg-gray-50 transition-colors">
									<td class="px-6 py-4 whitespace-nowrap">
										{#if content.hasPermission}
											<div class="flex items-center text-green-600">
												<div class="w-5 h-5">
													{@html getIconSVG('checkCircle')}
												</div>
												<span class="ml-2 text-sm font-medium">受講可能</span>
											</div>
										{:else}
											<div class="flex items-center text-gray-400">
												<div class="w-5 h-5">
													{@html getIconSVG('xCircle')}
												</div>
												<span class="ml-2 text-sm">権限なし</span>
											</div>
										{/if}
									</td>
									<td class="px-6 py-4">
										<div class="text-sm font-medium text-gray-900">{content.title}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										{#if content.category}
											<span
												class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
											>
												{content.category}
											</span>
										{:else}
											<span class="text-sm text-gray-400">-</span>
										{/if}
									</td>
									<td class="px-6 py-4">
										<div class="text-sm text-gray-600 max-w-md">
											{content.description || '-'}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatDate(content.created_at)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>

		<!-- お知らせ -->
		<div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-blue-900 mb-2">コンテンツ権限について</h3>
			<p class="text-blue-800 text-sm">
				緑色のチェックマーク（受講可能）が付いているコンテンツのみ、御社の生徒が閲覧できます。
				<br />
				コンテンツ権限の追加や変更が必要な場合は、管理者にお問い合わせください。
			</p>
		</div>
	</div>
</Layout>
