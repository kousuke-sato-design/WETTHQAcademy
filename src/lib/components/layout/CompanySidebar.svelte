<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from '$lib/auth/auth';

	export let user: User;

	$: currentPath = $page.url.pathname;

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
			users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
		};
		return icons[iconName] || '';
	}

	const companyMenuItems = [
		{ href: '/company/dashboard', label: 'ダッシュボード', icon: 'home' },
		{ href: '/company/contents', label: 'コンテンツ管理', icon: 'books' },
		{ href: '/company/staff', label: '担当者管理', icon: 'users' },
		{ href: '/company/users', label: '生徒一覧', icon: 'users' }
	];
</script>

<aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
	<nav class="p-4 space-y-1">
		{#each companyMenuItems as item}
			<a
				href={item.href}
				class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors {currentPath.startsWith(
					item.href
				)
					? 'bg-green-50 text-green-700 font-medium'
					: 'text-gray-700 hover:bg-gray-50'}"
			>
				<div class="w-5 h-5 {currentPath.startsWith(item.href) ? 'text-green-600' : 'text-gray-500'}">
					{@html getIconSVG(item.icon)}
				</div>
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>
</aside>
