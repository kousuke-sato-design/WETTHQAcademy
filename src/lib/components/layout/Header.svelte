<script lang="ts">
	import type { User } from '$lib/auth/auth';

	export let user: User | null = null;

	async function logout() {
		await fetch('/api/logout', { method: 'POST' });
		// ロールに応じて適切なログインページへリダイレクト
		if (user?.role === 'master') {
			window.location.href = '/admin/login';
		} else if (user?.role === 'company_admin') {
			window.location.href = '/company/login';
		} else {
			window.location.href = '/user/login';
		}
	}

	function getRoleLabel(role: string | undefined): string {
		switch (role) {
			case 'master':
				return 'マスター管理者';
			case 'company_admin':
				return '企業担当者';
			case 'user':
				return '受講者';
			default:
				return '';
		}
	}

	function getRoleColor(role: string | undefined): string {
		switch (role) {
			case 'master':
				return 'text-purple-600';
			case 'company_admin':
				return 'text-blue-600';
			case 'user':
				return 'text-green-600';
			default:
				return 'text-gray-500';
		}
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
					<div class="text-sm text-right">
						<p class="text-gray-900 font-medium">{user.name || 'ユーザー'}</p>
						<p class="text-xs {getRoleColor(user.role)}">
							{getRoleLabel(user.role)}
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
