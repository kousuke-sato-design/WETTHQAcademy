<script lang="ts">
	import type { User } from '$lib/auth/auth';

	export let user: User;

	async function logout() {
		await fetch('/api/logout', { method: 'POST' });
		window.location.href = '/';
	}
</script>

<header class="bg-white shadow-sm border-b border-gray-200">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- ロゴ -->
			<div class="flex items-center">
				<h1 class="text-xl font-bold text-gray-800">WEBTHQAcademy</h1>
			</div>

			<!-- ユーザー情報 -->
			{#if user}
				<div class="flex items-center space-x-4">
					<div class="text-sm">
						<p class="text-gray-900 font-medium">{user.name}</p>
						<p class="text-gray-500 text-xs">
							{user.role === 'master' ? 'マスター管理者' : '企業担当者'}
						</p>
					</div>
					<button
						on:click={logout}
						class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
					>
						ログアウト
					</button>
				</div>
			{/if}
		</div>
	</div>
</header>
