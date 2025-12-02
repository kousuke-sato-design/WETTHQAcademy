<script lang="ts">
	import Layout from '$lib/components/layout/Layout.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// フォームデータ
	let title = data.template.title;
	let subject = data.template.subject || '';
	let body = data.template.body;
	let description = data.template.description || '';
	let category = data.template.category || 'login';

	function getIconSVG(iconName: string) {
		const icons: Record<string, string> = {
			back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
			save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
			mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
			copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
			check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
		};
		return icons[iconName] || '';
	}

	let copySuccess = false;
	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copySuccess = true;
			setTimeout(() => copySuccess = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function openMailClient() {
		const subjectEncoded = encodeURIComponent(subject);
		const bodyEncoded = encodeURIComponent(body);
		window.location.href = `mailto:?subject=${subjectEncoded}&body=${bodyEncoded}`;
	}
</script>

<svelte:head>
	<title>テンプレート編集 - {data.company.company_name} - WEBTHQAcademy</title>
</svelte:head>

<Layout user={data.user}>
	<div class="max-w-4xl">
		<!-- ヘッダー -->
		<div class="mb-8">
			<div class="flex items-center space-x-4 mb-4">
				<a
					href="/admin/company-templates/{data.company.id}"
					class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
				>
					<div class="w-5 h-5 mr-1">{@html getIconSVG('back')}</div>
					<span>戻る</span>
				</a>
			</div>
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 mb-2">テンプレート編集</h1>
					<p class="text-gray-600">{data.company.company_name}専用</p>
				</div>
				<div class="flex items-center space-x-3">
					<button
						on:click={() => copyToClipboard(body)}
						class="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
					>
						{#if copySuccess}
							<div class="w-4 h-4 mr-2">{@html getIconSVG('check')}</div>
							<span>コピーしました</span>
						{:else}
							<div class="w-4 h-4 mr-2">{@html getIconSVG('copy')}</div>
							<span>本文コピー</span>
						{/if}
					</button>
					<button
						on:click={openMailClient}
						class="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
					>
						<div class="w-4 h-4 mr-2">{@html getIconSVG('mail')}</div>
						<span>メールで開く</span>
					</button>
				</div>
			</div>
		</div>

		<!-- エラー/成功メッセージ -->
		{#if form?.error}
			<div class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
				{form.error}
			</div>
		{/if}
		{#if form?.success}
			<div class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
				{form.message}
			</div>
		{/if}

		<!-- 編集フォーム -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<form method="POST" use:enhance>
				<div class="p-6 space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								タイトル <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="title"
								bind:value={title}
								required
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								placeholder="例: ログイン案内メール"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
							<select
								name="category"
								bind:value={category}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							>
								<option value="login">ログイン案内</option>
								<option value="reminder">リマインダー</option>
								<option value="notification">お知らせ</option>
								<option value="other">その他</option>
							</select>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">メール件名</label>
						<input
							type="text"
							name="subject"
							bind:value={subject}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							placeholder="例: 【WEBTHQAcademy】ログイン情報のお知らせ"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							本文 <span class="text-red-500">*</span>
						</label>
						<textarea
							name="body"
							bind:value={body}
							required
							rows="15"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
							placeholder="テンプレート本文を入力..."
						></textarea>
						<p class="text-xs text-gray-500 mt-1">
							変数: {'{{名前}}'}, {'{{ログインID}}'}, {'{{パスワード}}'}, {'{{ログインURL}}'}, {'{{企業名}}'}
						</p>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">説明（管理用メモ）</label>
						<textarea
							name="description"
							bind:value={description}
							rows="2"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							placeholder="このテンプレートの用途や注意点など..."
						></textarea>
					</div>
				</div>

				<div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
					<a
						href="/admin/company-templates/{data.company.id}"
						class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						キャンセル
					</a>
					<button
						type="submit"
						class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
					>
						<div class="w-4 h-4 mr-2">{@html getIconSVG('save')}</div>
						<span>保存</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</Layout>
