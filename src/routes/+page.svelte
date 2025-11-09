<script lang="ts">
	import { goto } from '$app/navigation';

	const features = [
		{
			icon: 'video',
			title: '動画で学ぶ',
			description: '10分程度のわかりやすい解説動画で、いつでもどこでも学習できます'
		},
		{
			icon: 'document',
			title: 'PDF資料',
			description: '詳細な資料をダウンロードして、じっくり読むことができます'
		},
		{
			icon: 'book',
			title: '豊富なコンテンツ',
			description: '基礎知識から実践まで、体系的に学べるコンテンツを用意'
		},
		{
			icon: 'check',
			title: '実務に直結',
			description: '職場で使える実践的な知識とノウハウを提供します'
		}
	];

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
			document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
			book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
			check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
			login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>',
			select: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg>',
			learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
			brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M18 11a3 3 0 0 0-3 3v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a3 3 0 0 0-3-3"/><path d="M6 15a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z"/><path d="M18 15a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z"/></svg>'
		};
		return icons[iconName] || '';
	}

	const contentCategories = [
		{ name: 'ストレスチェック制度の基礎', count: '15本' },
		{ name: '実施手順と運用', count: '12本' },
		{ name: '関連法令の解説', count: '8本' },
		{ name: '職場のメンタルヘルス対策', count: '20本' }
	];
</script>

<svelte:head>
	<title>WEBTHQAcademy - メンタルヘルス学習プラットフォーム</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- ヘッダー -->
	<header class="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
		<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-14 sm:h-16">
				<div class="flex items-center space-x-2 sm:space-x-3">
					<div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
						<div class="w-5 h-5 sm:w-6 sm:h-6">
							{@html getIconSVG('brain')}
						</div>
					</div>
					<div>
						<h1 class="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							WEBTHQAcademy
						</h1>
						<p class="hidden sm:block text-xs text-gray-500">株式会社総合心理教育研究所</p>
					</div>
				</div>
				<div class="flex items-center gap-2 sm:gap-3">
					<button
						on:click={() => goto('/company/login')}
						class="hidden sm:block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
					>
						担当者
					</button>
					<button
						on:click={() => goto('/user/login')}
						class="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors shadow-sm"
					>
						ログイン
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- ヒーローセクション -->
	<section class="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
		<div class="max-w-7xl mx-auto">
			<div class="text-center">
				<div class="inline-block mb-4 sm:mb-6">
					<span class="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold border border-blue-200">
						THQ受検企業様限定プラットフォーム
					</span>
				</div>
				<div class="mb-4 sm:mb-6">
					<p class="text-sm sm:text-base md:text-lg text-gray-600 mb-2 sm:mb-3">総合心理教育研究所監修</p>
					<h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 leading-tight px-2">
						<span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							WEBTHQAcademy
						</span>
					</h2>
					<p class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">メンタルヘルスプログラム</p>
				</div>
				<p class="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4">
					ストレスチェック制度の実施から職場のメンタルヘルス対策まで、<br class="hidden sm:block" />
					実務に必要な知識を体系的に学習できるオンラインプラットフォーム
				</p>
				<p class="text-xs sm:text-sm text-gray-500 mb-8 sm:mb-12">
					株式会社総合心理教育研究所のTHQサービスをご利用の企業様専用
				</p>
				<div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
					<button
						on:click={() => goto('/user/login')}
						class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
					>
						学習を始める →
					</button>
					<button
						on:click={() => {
							document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
						}}
						class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all shadow-lg border border-gray-200"
					>
						詳しく見る
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- 特徴セクション -->
	<section id="features" class="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-10 sm:mb-12 md:mb-16">
				<h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
					WEBTHQAcademyの特徴
				</h3>
				<p class="text-base sm:text-lg text-gray-600">
					効果的な学習をサポートする4つの特徴
				</p>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
				{#each features as feature}
					<div class="bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
						<div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 text-white">
							<div class="w-6 h-6 sm:w-8 sm:h-8">
								{@html getIconSVG(feature.icon)}
							</div>
						</div>
						<h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h4>
						<p class="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- コンテンツカテゴリセクション -->
	<section class="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-10 sm:mb-12 md:mb-16">
				<h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
					豊富な学習コンテンツ
				</h3>
				<p class="text-base sm:text-lg text-gray-600">
					基礎から実践まで、段階的に学べるカリキュラム
				</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
				{#each contentCategories as category}
					<div class="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:border-blue-300">
						<div class="flex items-center justify-between mb-3">
							<h4 class="text-base sm:text-lg font-bold text-gray-900">{category.name}</h4>
							<span class="px-2.5 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap">
								{category.count}
							</span>
						</div>
						<div class="flex items-center text-gray-600 text-xs sm:text-sm">
							<div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white mr-2 flex-shrink-0">
								<div class="w-3 h-3">
									{@html getIconSVG('book')}
								</div>
							</div>
							<span>動画・PDF資料を用意</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 学習の流れセクション -->
	<section class="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-10 sm:mb-12 md:mb-16">
				<h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
					学習の流れ
				</h3>
				<p class="text-base sm:text-lg text-gray-600">
					3つのステップで効率的に学習
				</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
				<div class="text-center">
					<div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
						<div class="w-7 h-7 sm:w-8 sm:h-8">
							{@html getIconSVG('login')}
						</div>
					</div>
					<h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">ログイン</h4>
					<p class="text-sm sm:text-base text-gray-600">
						企業IDでログインして<br />学習を開始
					</p>
				</div>
				<div class="text-center">
					<div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
						<div class="w-7 h-7 sm:w-8 sm:h-8">
							{@html getIconSVG('select')}
						</div>
					</div>
					<h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">コンテンツ選択</h4>
					<p class="text-sm sm:text-base text-gray-600">
						目的に合わせた<br />コンテンツを選択
					</p>
				</div>
				<div class="text-center">
					<div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
						<div class="w-7 h-7 sm:w-8 sm:h-8">
							{@html getIconSVG('learn')}
						</div>
					</div>
					<h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">学習</h4>
					<p class="text-sm sm:text-base text-gray-600">
						動画・PDFで<br />いつでも学習
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTAセクション -->
	<section class="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
		<div class="max-w-4xl mx-auto text-center">
			<h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
				今すぐ学習を始めませんか？
			</h3>
			<p class="text-base sm:text-lg md:text-xl text-blue-100 mb-2">
				THQサービスをご利用の企業様は追加料金なしでご利用いただけます
			</p>
			<p class="text-xs sm:text-sm text-blue-200 mb-6 sm:mb-8">
				株式会社総合心理教育研究所が提供する特別な学習プログラム
			</p>
			<button
				on:click={() => goto('/user/login')}
				class="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl text-base sm:text-lg"
			>
				ログインして始める
			</button>
		</div>
	</section>

	<!-- フッター -->
	<footer class="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto text-center">
			<div class="flex items-center justify-center space-x-3 mb-4">
				<div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
					<div class="w-6 h-6">
						{@html getIconSVG('brain')}
					</div>
				</div>
				<h1 class="text-2xl font-bold">WEBTHQAcademy</h1>
			</div>
			<p class="text-gray-400 mb-2">
				メンタルヘルス学習プラットフォーム
			</p>
			<p class="text-sm text-gray-500 mb-6">
				株式会社総合心理教育研究所
			</p>
			<p class="text-sm text-gray-600">
				© 2025 株式会社総合心理教育研究所. All rights reserved.
			</p>
			<div class="mt-6">
				<a
					href="/admin/login"
					class="text-xs text-gray-700 hover:text-gray-500 transition-colors"
				>
					管理者
				</a>
			</div>
		</div>
	</footer>
</div>
