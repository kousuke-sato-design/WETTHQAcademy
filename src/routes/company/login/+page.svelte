<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	let error = '';

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
			brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M18 11a3 3 0 0 0-3 3v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a3 3 0 0 0-3-3"/><path d="M6 15a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z"/><path d="M18 15a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>企業担当者ログイン - WEBTHQAcademy</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
	<div class="max-w-md w-full">
		<!-- ロゴ -->
		<div class="text-center mb-6">
			<a href="/" class="inline-flex items-center space-x-2 group">
				<div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
					<div class="w-6 h-6">
						{@html getIconSVG('brain')}
					</div>
				</div>
				<div class="text-left">
					<h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
					<h2 class="text-2xl font-bold text-gray-900 mb-2">企業担当者ログイン</h2>
					<p class="text-gray-600 text-sm">THQサービスご利用企業様</p>
				</div>

				<form method="POST" action="?/login" use:enhance class="space-y-5">
					{#if error}
						<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					{/if}

					<div>
						<label for="company_code" class="block text-sm font-medium text-gray-700 mb-2">
							企業コード
						</label>
						<input
							type="text"
							id="company_code"
							name="company_code"
							required
							placeholder="企業コードを入力"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>

					<div>
						<label for="login_id" class="block text-sm font-medium text-gray-700 mb-2">
							担当者ID
						</label>
						<input
							type="text"
							id="login_id"
			name="login_id"
							required
							placeholder="担当者IDを入力"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>

					<button
						type="submit"
						class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
					>
						ログイン
					</button>
				</form>

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
