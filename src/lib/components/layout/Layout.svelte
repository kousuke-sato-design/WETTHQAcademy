<script lang="ts">
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';
	import type { User } from '$lib/auth/auth';

	export let user: User;
	export let contents: Array<{ id: number; title: string; sidebar_icon: string; sidebar_order: number }> = [];
</script>

<div class="min-h-screen bg-gray-50">
	<Header {user} />

	<div class="flex">
		<Sidebar {user} {contents} />

		<!-- メインコンテンツ -->
		<main class="flex-1 p-8">
			<slot />
		</main>
	</div>
</div>
