<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from '$lib/auth/auth';

	export let user: User;

	$: currentPath = $page.url.pathname;

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
			company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
			users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
			lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
		};
		return icons[iconName] || '';
	}

	const adminMenuItems = [
		{ href: '/admin/dashboard', label: 'ダッシュボード', icon: 'home' },
		{ href: '/admin/companies', label: '企業管理', icon: 'company' },
		{ href: '/admin/staff', label: '担当者管理', icon: 'users' },
		{ href: '/admin/students', label: '生徒管理', icon: 'users' },
		{ href: '/admin/contents', label: '共有コンテンツ', icon: 'document' },
		{ href: '/admin/company-contents', label: '企業専用コンテンツ', icon: 'lock' }
	];
</script>

<aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
	<nav class="p-4 space-y-1">
		{#each adminMenuItems as item}
			<a
				href={item.href}
				class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors {currentPath.startsWith(
					item.href
				)
					? 'bg-purple-50 text-purple-700 font-medium'
					: 'text-gray-700 hover:bg-gray-50'}"
			>
				<div class="w-5 h-5 {currentPath.startsWith(item.href) ? 'text-purple-600' : 'text-gray-500'}">
					{@html getIconSVG(item.icon)}
				</div>
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>
</aside>
