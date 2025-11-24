<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
			checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>企業担当者ダッシュボード - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-6xl">
		<!-- ウェルカムメッセージ -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">企業担当者ダッシュボード</h1>
			<p class="text-gray-600">
				ようこそ、{data.user.name}さん。企業の生徒管理とコンテンツ管理を行えます。
			</p>
		</div>

		<!-- 統計カード -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">登録生徒数</p>
						<p class="text-3xl font-bold text-gray-900">{data.totalStudents}</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
						<div class="w-7 h-7">
							{@html getIconSVG('users')}
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600 mb-1">受講可能コンテンツ</p>
						<p class="text-3xl font-bold text-gray-900">{data.permittedContents}</p>
					</div>
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
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
					<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
						<div class="w-7 h-7">
							{@html getIconSVG('books')}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- クイックアクション -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<a
				href="/company/contents"
				class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
			>
				<div class="flex items-center mb-4">
					<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-4">
						<div class="w-7 h-7">
							{@html getIconSVG('books')}
						</div>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
						コンテンツ管理
					</h3>
				</div>
				<p class="text-gray-600">
					受講可能なコンテンツの一覧を確認できます。
				</p>
			</a>

			<a
				href="/company/users"
				class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
			>
				<div class="flex items-center mb-4">
					<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white mr-4">
						<div class="w-7 h-7">
							{@html getIconSVG('users')}
						</div>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
						生徒管理
					</h3>
				</div>
				<p class="text-gray-600">
					企業に所属する生徒の一覧を確認し、新しい生徒を登録できます。
				</p>
			</a>

			<a
				href="/company/staff"
				class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
			>
				<div class="flex items-center mb-4">
					<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-4">
						<div class="w-7 h-7">
							{@html getIconSVG('users')}
						</div>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
						担当者管理
					</h3>
				</div>
				<p class="text-gray-600">
					企業担当者の一覧を確認し、新しい担当者を登録できます。
				</p>
			</a>
		</div>

		<!-- マニュアル -->
		<div class="mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">📚 操作マニュアル</h2>
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<p class="text-gray-600 mb-4">
					システムの使い方を詳しく説明したマニュアルです。初めての方はぜひご確認ください。
				</p>
				<a
					href="/docs/company-manual.html"
					target="_blank"
					class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-pink-700 transition-colors shadow-sm"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
					企業担当者向けマニュアルを開く
				</a>
			</div>
		</div>

		<!-- お知らせ -->
		<div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
			<h3 class="text-xl font-semibold mb-2">企業担当者向け機能</h3>
			<p class="mb-4 text-green-100">
				生徒の管理、担当者の追加・編集などの操作が可能です。サイドバーから各機能にアクセスできます。
			</p>
			<div class="flex space-x-4">
				<a
					href="/company/users"
					class="inline-block bg-white text-green-600 font-semibold px-6 py-2 rounded-lg hover:bg-green-50 transition-colors"
				>
					生徒一覧へ →
				</a>
				<a
					href="/company/staff"
					class="inline-block bg-green-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
				>
					担当者管理へ →
				</a>
			</div>
		</div>
	</div>
</Layout>
