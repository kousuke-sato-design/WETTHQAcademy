<script lang="ts">
	import Header from './Header.svelte';
	import AdminSidebar from './AdminSidebar.svelte';
	import CompanySidebar from './CompanySidebar.svelte';
	import UserSidebar from './UserSidebar.svelte';
	import type { User } from '$lib/auth/auth';

	export let user: User;
	export let contents: Array<{ id: number; title: string; sidebar_icon: string; sidebar_order: number }> = [];

	// モバイルサイドバー表示状態
	let sidebarOpen = false;

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}

	// デバッグ用
	$: console.log('Layout - user.role:', user?.role, 'user:', user);
</script>

<div class="min-h-screen bg-gray-50">
	<Header {user} />

	<div class="flex relative">
		<!-- ハンバーガーメニューボタン (モバイルのみ) -->
		<button
			on:click={toggleSidebar}
			class="md:hidden fixed top-20 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
			aria-label="メニュー"
		>
			<svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{#if sidebarOpen}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				{/if}
			</svg>
		</button>

		<!-- オーバーレイ (モバイルでサイドバーが開いている時) -->
		{#if sidebarOpen}
			<div
				class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
				on:click={closeSidebar}
				on:keydown={(e) => e.key === 'Escape' && closeSidebar()}
				role="button"
				tabindex="0"
				aria-label="サイドバーを閉じる"
			></div>
		{/if}

		<!-- サイドバー -->
		<div class="
			fixed md:static inset-y-0 left-0 z-40
			transform transition-transform duration-300 ease-in-out
			{sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
			md:block
		">
			{#if user && user.role === 'master'}
				<AdminSidebar {user} />
			{:else if user && user.role === 'company_admin'}
				<CompanySidebar {user} />
			{:else if user && user.role === 'user'}
				<UserSidebar {user} {contents} on:linkClick={closeSidebar} />
			{/if}
		</div>

		<!-- メインコンテンツ -->
		<main class="flex-1 p-4 sm:p-6 md:p-8 w-full">
			<slot />
		</main>
	</div>
</div>
