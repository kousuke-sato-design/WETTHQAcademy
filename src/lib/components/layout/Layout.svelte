<script lang="ts">
	import Header from './Header.svelte';
	import AdminSidebar from './AdminSidebar.svelte';
	import CompanySidebar from './CompanySidebar.svelte';
	import UserSidebar from './UserSidebar.svelte';
	import type { User } from '$lib/auth/auth';

	export let user: User;
	export let contents: Array<{ id: number; title: string; sidebar_icon: string; sidebar_order: number }> = [];

	// デバッグ用
	$: console.log('Layout - user.role:', user?.role, 'user:', user);
</script>

<div class="min-h-screen bg-gray-50">
	<Header {user} />

	<div class="flex">
		{#if user.role === 'master'}
			<AdminSidebar {user} />
		{:else if user.role === 'company_admin'}
			<CompanySidebar {user} />
		{:else if user.role === 'user'}
			<UserSidebar {user} {contents} />
		{/if}

		<!-- メインコンテンツ -->
		<main class="flex-1 p-8">
			<slot />
		</main>
	</div>
</div>
