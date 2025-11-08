<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let selectedCompanyId = '';
	let loginId = '';
	let password = '';

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			student: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
			company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
			user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
			lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
		};
		return icons[iconName] || '';
	}
</script>

<svelte:head>
	<title>生徒ログイン - WEBTHQAcademy</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<!-- ロゴ・タイトル -->
		<div class="text-center mb-8">
			<div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 shadow-lg">
				<div class="w-10 h-10 text-white">
					{@html getIconSVG('student')}
				</div>
			</div>
			<h1 class="text-3xl font-bold text-gray-900 mb-2">生徒ログイン</h1>
			<p class="text-gray-600">WEBTHQAcademy 学習システム</p>
		</div>

		<!-- ログインフォーム -->
		<div class="bg-white rounded-2xl shadow-xl p-8">
			{#if form?.error}
				<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-red-800 text-sm font-medium">{form.error}</p>
				</div>
			{/if}

			<form method="POST" use:enhance class="space-y-6">
				<!-- 企業ID入力 -->
				<div>
					<label for="company_code" class="block text-sm font-medium text-gray-700 mb-2">
						<div class="flex items-center space-x-2">
							<div class="w-4 h-4 text-gray-500">
								{@html getIconSVG('company')}
							</div>
							<span>企業ID</span>
						</div>
					</label>
					<input
						type="text"
						id="company_code"
						name="company_code"
						bind:value={selectedCompanyId}
						required
						placeholder="企業IDを入力"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
					<p class="mt-1 text-sm text-gray-500">
						企業から提供された企業IDを入力してください
					</p>
				</div>

				<!-- ユーザーID -->
				<div>
					<label for="login_id" class="block text-sm font-medium text-gray-700 mb-2">
						<div class="flex items-center space-x-2">
							<div class="w-4 h-4 text-gray-500">
								{@html getIconSVG('user')}
							</div>
							<span>ユーザーID</span>
						</div>
					</label>
					<input
						type="text"
						id="login_id"
						name="login_id"
						bind:value={loginId}
						required
						placeholder="社員番号またはuser"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
				</div>

				<!-- パスワード -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						<div class="flex items-center space-x-2">
							<div class="w-4 h-4 text-gray-500">
								{@html getIconSVG('lock')}
							</div>
							<span>パスワード</span>
						</div>
					</label>
					<input
						type="password"
						id="password"
						name="password"
						bind:value={password}
						required
						placeholder="パスワードを入力"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
					/>
				</div>

				<!-- ログインボタン -->
				<button
					type="submit"
					class="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
				>
					ログイン
				</button>
			</form>

			<!-- ヘルプテキスト -->
			<div class="mt-6 pt-6 border-t border-gray-200">
				<p class="text-sm text-gray-600 text-center">
					ログイン情報がわからない場合は、担当者にお問い合わせください
				</p>
			</div>
		</div>

		<!-- その他のログインリンク -->
		<div class="mt-6 text-center space-y-2">
			<p class="text-sm text-gray-600">
				<a href="/admin/login" class="text-blue-600 hover:text-blue-700 font-medium">管理者の方はこちら</a>
			</p>
			<p class="text-sm text-gray-600">
				<a href="/company/login" class="text-blue-600 hover:text-blue-700 font-medium">企業担当者の方はこちら</a>
			</p>
		</div>
	</div>
</div>
