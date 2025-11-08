<script lang="ts">
	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
			folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
			bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
		};
		return icons[iconName] || '';
	}

	const recommendedContents = [
		{ id: 1, title: 'ストレスチェック制度の概要', category: '基礎知識' },
		{ id: 2, title: '実施手順ガイド', category: '実施方法' },
		{ id: 3, title: '関連法令の解説', category: '法令' }
	];

	const categories = ['基礎知識', '実施方法', '法令'];
</script>

<aside class="w-80 bg-gray-50 border-l border-gray-200 p-6 space-y-6">
	<!-- おすすめコンテンツ -->
	<div class="bg-white rounded-lg shadow-sm p-4">
		<h3 class="text-sm font-semibold text-gray-800 mb-3 flex items-center">
			<div class="w-5 h-5 mr-2 text-blue-600">
				{@html getIconSVG('star')}
			</div>
			おすすめコンテンツ
		</h3>
		<ul class="space-y-2">
			{#each recommendedContents as content}
				<li>
					<a
						href="/contents/{content.id}"
						class="block p-2 rounded hover:bg-gray-50 transition-colors"
					>
						<p class="text-sm font-medium text-gray-900">{content.title}</p>
						<p class="text-xs text-gray-500">{content.category}</p>
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<!-- カテゴリ一覧 -->
	<div class="bg-white rounded-lg shadow-sm p-4">
		<h3 class="text-sm font-semibold text-gray-800 mb-3 flex items-center">
			<div class="w-5 h-5 mr-2 text-blue-600">
				{@html getIconSVG('folder')}
			</div>
			カテゴリ
		</h3>
		<ul class="space-y-1">
			{#each categories as category}
				<li>
					<a
						href="/contents?category={encodeURIComponent(category)}"
						class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
					>
						{category}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<!-- お知らせ -->
	<div class="bg-white rounded-lg shadow-sm p-4">
		<h3 class="text-sm font-semibold text-gray-800 mb-3 flex items-center">
			<div class="w-5 h-5 mr-2 text-blue-600">
				{@html getIconSVG('bell')}
			</div>
			お知らせ
		</h3>
		<div class="text-sm text-gray-600 space-y-2">
			<p class="text-xs">現在、新しいコンテンツを順次追加中です。</p>
		</div>
	</div>
</aside>
