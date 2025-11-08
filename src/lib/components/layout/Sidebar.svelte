<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from '$lib/auth/auth';

	export let user: User;
	export let contents: Array<{ id: number; title: string; sidebar_icon: string; sidebar_order: number }> = [];

	$: currentPath = $page.url.pathname;

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
			books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
			company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
			users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
			video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
			image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
			text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>'
		};
		return icons[iconName] || '';
	}

	// ユーザーのロールに応じてダッシュボードのパスを決定
	$: dashboardPath = user.role === 'master' ? '/admin/dashboard' : user.role === 'company_admin' ? '/company/dashboard' : '/user/dashboard';

	const menuItems = [
		{ href: '/dashboard', label: 'ダッシュボード', icon: 'home' }
	];

	const companyMenuItems = [
		{ href: '/company/staff', label: '担当者管理', icon: 'users' },
		{ href: '/company/users', label: '生徒一覧', icon: 'users' },
		{ href: '/admin/contents', label: 'コンテンツ一覧', icon: 'books' }
	];

	const adminMenuItems = [
		{ href: '/admin/companies', label: '企業管理', icon: 'company' },
		{ href: '/company/staff', label: '担当者管理', icon: 'users' },
		{ href: '/admin/students', label: '生徒管理', icon: 'users' },
		{ href: '/admin/contents', label: 'コンテンツ管理', icon: 'document' }
	];
</script>

<aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
	<nav class="p-4 space-y-1">
		<!-- 通常メニュー -->
		{#each menuItems as item}
			{@const href = item.href === '/dashboard' ? dashboardPath : item.href}
			{@const isActive = item.href === '/dashboard' ? currentPath === dashboardPath : currentPath === item.href}
			<a
				{href}
				class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors {isActive
					? 'bg-blue-50 text-blue-700 font-medium'
					: 'text-gray-700 hover:bg-gray-50'}"
			>
				<div class="w-5 h-5 {isActive ? 'text-blue-600' : 'text-gray-500'}">
					{@html getIconSVG(item.icon)}
				</div>
				<span>{item.label}</span>
			</a>
		{/each}

		<!-- 企業担当者専用メニュー -->
		{#if user.role === 'company_admin'}
			<div class="pt-4 mt-4 border-t border-gray-200">
				<p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
					企業メニュー
				</p>
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
			</div>
		{/if}

		<!-- マスター専用メニュー -->
		{#if user.role === 'master'}
			<div class="pt-4 mt-4 border-t border-gray-200">
				<p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
					管理者メニュー
				</p>
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
			</div>
		{/if}

		<!-- 生徒用コンテンツメニュー -->
		{#if user.role === 'user' && contents.length > 0}
			<div class="pt-4 mt-4 border-t border-gray-200">
				<p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
					学習コンテンツ
				</p>
				{#each contents as content}
					<a
						href="/user/contents/{content.id}"
						class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors {currentPath === `/user/contents/${content.id}`
							? 'bg-blue-50 text-blue-700 font-medium'
							: 'text-gray-700 hover:bg-gray-50'}"
					>
						<div class="w-5 h-5 {currentPath === `/user/contents/${content.id}` ? 'text-blue-600' : 'text-gray-500'}">
							{@html getIconSVG(content.sidebar_icon)}
						</div>
						<span>{content.title}</span>
					</a>
				{/each}
			</div>
		{/if}
	</nav>
</aside>
