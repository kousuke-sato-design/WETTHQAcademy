<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	let error = '';

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			master: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg>',
			brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M18 11a3 3 0 0 0-3 3v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a3 3 0 0 0-3-3"/><path d="M6 15a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z"/><path d="M18 15a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>管理者ログイン - WEBTHQAcademy</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
	<div class="max-w-md w-full">
		<!-- ロゴ -->
		<div class="text-center mb-6">
			<a href="/" class="inline-flex items-center space-x-2 group">
				<div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
					<div class="w-6 h-6">
						{@html getIconSVG('brain')}
					</div>
				</div>
				<div class="text-left">
					<h1 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
						WEBTHQAcademy
					</h1>
					<p class="text-xs text-gray-600">株式会社総合心理教育研究所</p>
				</div>
			</a>
		</div>

		<div class="bg-white rounded-xl shadow-xl overflow-hidden">
			<!-- ログインフォーム -->
			<div class="p-8">
				<div class="text-center mb-8">
					<h2 class="text-2xl font-bold text-gray-900 mb-2">マスター管理者ログイン</h2>
					<p class="text-gray-600 text-sm">システム管理者専用</p>
				</div>

				<form method="POST" action="/admin?/login" use:enhance class="space-y-5">
					{#if error}
						<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					{/if}

					<div>
						<label for="login_id" class="block text-sm font-medium text-gray-700 mb-2">
							管理者ID
						</label>
						<input
							type="text"
							id="login_id"
							name="login_id"
							required
							placeholder="kousuke-sato@sipe-selye.co.jp"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
						/>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
							パスワード
						</label>
						<input
							type="password"
							id="password"
							name="password"
							required
							placeholder="••••••••"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
						/>
					</div>

					<button
						type="submit"
						class="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
					>
						ログイン
					</button>
				</form>

				<!-- デモ情報 -->
				<div class="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
					<p class="font-semibold text-gray-700 mb-2 text-sm flex items-center">
						<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						デモ用アカウント
					</p>
					<div class="text-sm text-gray-600 space-y-1">
						<p><span class="font-medium">ID:</span> kousuke-sato@sipe-selye.co.jp</p>
						<p><span class="font-medium">パスワード:</span> 14541454</p>
					</div>
				</div>

				<!-- 戻るリンク -->
				<div class="mt-8 text-center">
					<a
						href="/"
						class="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
					>
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
						</svg>
						トップページに戻る
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
