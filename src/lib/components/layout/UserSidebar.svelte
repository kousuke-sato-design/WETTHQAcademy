<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import type { User } from '$lib/auth/auth';

	export let user: User;
	export let contents: Array<{ id: number; title: string; sidebar_icon: string; sidebar_order: number; is_company_specific?: boolean }> = [];

	const dispatch = createEventDispatcher();

	$: currentPath = $page.url.pathname;
	$: sharedContents = contents.filter(c => !c.is_company_specific);
	$: companyContents = contents.filter(c => c.is_company_specific);

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
			books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
			video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
			image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
			text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>'
		};
		return icons[iconName] || '';
	}

	function handleLinkClick() {
		dispatch('linkClick');
	}
</script>

<aside class="w-64 bg-white border-r border-gray-200 min-h-screen overflow-y-auto">
	<nav class="p-4 space-y-1">
		<!-- ダッシュボード -->
		<a
			href="/user/dashboard"
			on:click={handleLinkClick}
			class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors {currentPath === '/user/dashboard'
				? 'bg-blue-50 text-blue-700 font-medium'
				: 'text-gray-700 hover:bg-gray-50'}"
		>
			<div class="w-5 h-5 {currentPath === '/user/dashboard' ? 'text-blue-600' : 'text-gray-500'}">
				{@html getIconSVG('home')}
			</div>
			<span>ダッシュボード</span>
		</a>

		<!-- 学習コンテンツ（共有） -->
		{#if sharedContents.length > 0}
			<div class="pt-4 mt-4 border-t border-gray-200">
				<p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
					学習コンテンツ
				</p>
				{#each sharedContents as content}
					<a
						href="/user/contents/{content.id}"
						on:click={handleLinkClick}
						class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors {currentPath === `/user/contents/${content.id}`
							? 'bg-blue-50 text-blue-700 font-medium'
							: 'text-gray-700 hover:bg-gray-50'}"
					>
						<div class="w-5 h-5 {currentPath === `/user/contents/${content.id}` ? 'text-blue-600' : 'text-gray-500'}">
							{@html getIconSVG(content.sidebar_icon)}
						</div>
						<span class="truncate">{content.title}</span>
					</a>
				{/each}
			</div>
		{/if}

		<!-- 企業専用コンテンツ -->
		{#if companyContents.length > 0}
			<div class="pt-4 mt-4 border-t border-gray-200">
				<p class="px-4 text-xs font-semibold text-green-600 uppercase tracking-wider mb-2 flex items-center space-x-1">
					<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
						<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
					</svg>
					<span>専用コンテンツ</span>
				</p>
				{#each companyContents as content}
					<a
						href="/user/contents/{content.id}"
						on:click={handleLinkClick}
						class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors {currentPath === `/user/contents/${content.id}`
							? 'bg-green-50 text-green-700 font-medium'
							: 'text-gray-700 hover:bg-gray-50'}"
					>
						<div class="w-5 h-5 {currentPath === `/user/contents/${content.id}` ? 'text-green-600' : 'text-gray-500'}">
							{@html getIconSVG(content.sidebar_icon)}
						</div>
						<span class="truncate">{content.title}</span>
						<span class="px-1.5 py-0.5 text-[10px] font-medium rounded bg-green-100 text-green-700">専用</span>
					</a>
				{/each}
			</div>
		{/if}
	</nav>
</aside>
