<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	let error = '';

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
			brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M18 11a3 3 0 0 0-3 3v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a3 3 0 0 0-3-3"/><path d="M6 15a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z"/><path d="M18 15a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>一般利用者ログイン - WEBTHQAcademy</title>
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
				<div class="text-center py-12">
					<div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
						<div class="w-10 h-10 text-gray-400">
							{@html getIconSVG('user')}
						</div>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3">一般利用者ログイン</h3>
					<p class="text-gray-600 mb-6">
						この機能は現在開発中です。<br />
						正式リリースまでしばらくお待ちください。
					</p>
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
