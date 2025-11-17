<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			checkCircle:
				'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
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
				御社が受講可能なコンテンツの統計情報です。
			</p>
		</div>

		<!-- 統計 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">受講可能コンテンツ</p>
						<p class="text-3xl font-bold text-green-600">{data.permittedContents}</p>
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
						<p class="text-3xl font-bold text-gray-900">{data.totalContents}</p>
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
							<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
							<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- お知らせ -->
		<div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-blue-900 mb-2">コンテンツ権限について</h3>
			<p class="text-blue-800 text-sm">
				現在、{data.permittedContents}件のコンテンツが御社の生徒に公開されています。
				<br />
				コンテンツ権限の追加や変更が必要な場合は、管理者にお問い合わせください。
			</p>
		</div>
	</div>
</Layout>
