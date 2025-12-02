<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>管理者向けマニュアル - WEBTHQAcademy</title>
	<style>
		@media print {
			.no-print {
				display: none;
			}
		}
	</style>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- ヘッダー -->
	<header class="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 no-print">
		<div class="max-w-5xl mx-auto px-6">
			<a href="/admin/dashboard" class="inline-block text-white hover:text-purple-200 mb-4 transition-colors">
				← ダッシュボードに戻る
			</a>
			<h1 class="text-4xl font-bold mb-2">📚 管理者向けマニュアル</h1>
			<p class="text-purple-100 text-lg">WEBTHQAcademy - マスター管理者用操作ガイド</p>
		</div>
	</header>

	<!-- コンテンツ -->
	<div class="max-w-5xl mx-auto px-6 py-12">
		<!-- 目次 -->
		<nav class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
			<h2 class="text-xl font-bold text-purple-600 mb-4">📑 目次</h2>
			<ul class="space-y-2">
				<li><a href="#overview" class="text-blue-600 hover:underline">1. システム概要</a></li>
				<li><a href="#login" class="text-blue-600 hover:underline">2. ログイン方法</a></li>
				<li><a href="#contents" class="text-blue-600 hover:underline">3. コンテンツ管理</a></li>
				<li><a href="#company-contents" class="text-blue-600 hover:underline">4. 企業専用コンテンツ管理</a></li>
				<li><a href="#companies" class="text-blue-600 hover:underline">5. 企業管理</a></li>
				<li><a href="#students" class="text-blue-600 hover:underline">6. 生徒管理</a></li>
				<li><a href="#staff" class="text-blue-600 hover:underline">7. 企業担当者管理</a></li>
			</ul>
		</nav>

		<!-- セクション -->
		<div class="space-y-8">
			<!-- 1. システム概要 -->
			<section id="overview" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-purple-600 border-b-2 border-purple-600 pb-3 mb-4">1. システム概要</h2>
				<p class="mb-4">WEBTHQAcademyは、企業向けストレスチェック知識補完プラットフォームです。マスター管理者として、全ての機能にアクセスし、システム全体を管理できます。</p>

				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
					<h3 class="font-bold text-blue-900 mb-2">主な機能</h3>
					<ul class="list-disc list-inside space-y-1 text-blue-900">
						<li>コンテンツの作成・編集・削除</li>
						<li>企業の登録・管理</li>
						<li>生徒アカウントの管理</li>
						<li>企業担当者の管理</li>
						<li>コンテンツ閲覧権限の設定</li>
						<li>動画のアップロード・管理（最大100MB）</li>
						<li><strong>企業専用コンテンツの作成・管理</strong></li>
						<li><strong>企業専用コンテンツの他企業へのコピー</strong></li>
					</ul>
				</div>
			</section>

			<!-- 2. ログイン方法 -->
			<section id="login" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-purple-600 border-b-2 border-purple-600 pb-3 mb-4">2. ログイン方法</h2>

				<div class="space-y-4">
					<div class="bg-gray-50 border-l-4 border-purple-500 p-4">
						<div class="flex items-start">
							<span class="inline-flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full font-bold mr-3 flex-shrink-0">1</span>
							<div>
								<strong class="block mb-1">ログインページにアクセス</strong>
								<p class="text-gray-700">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/admin/login</code></p>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 border-l-4 border-purple-500 p-4">
						<div class="flex items-start">
							<span class="inline-flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full font-bold mr-3 flex-shrink-0">2</span>
							<div>
								<strong class="block mb-1">ログイン情報を入力</strong>
								<p class="text-gray-700">ログインIDとパスワードを入力してください。</p>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 border-l-4 border-purple-500 p-4">
						<div class="flex items-start">
							<span class="inline-flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full font-bold mr-3 flex-shrink-0">3</span>
							<div>
								<strong class="block mb-1">ログインボタンをクリック</strong>
								<p class="text-gray-700">認証が成功すると、ダッシュボードに遷移します。</p>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
					<p class="text-yellow-900"><strong>⚠️ セキュリティについて:</strong> セッションは7日間有効です。共用PCを使用する場合は、必ずログアウトしてください。</p>
				</div>
			</section>

			<!-- 3. コンテンツ管理 -->
			<section id="contents" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-purple-600 border-b-2 border-purple-600 pb-3 mb-4">3. コンテンツ管理</h2>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 コンテンツ一覧</h3>
				<p class="mb-4">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/admin/contents</code></p>
				<p class="mb-4">登録されている全てのコンテンツを一覧表示します。</p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 新規コンテンツ作成</h3>
				<div class="space-y-3">
					<p class="font-semibold">基本情報を入力：</p>
					<ul class="list-disc list-inside ml-4 space-y-1">
						<li>タイトル（必須）</li>
						<li>説明</li>
						<li>カテゴリ</li>
						<li>表示順序</li>
					</ul>

					<p class="font-semibold mt-4">セクションタイプ：</p>
					<ul class="list-disc list-inside ml-4 space-y-1">
						<li><strong>HTMLテキスト</strong>: リッチテキストエディタで作成</li>
						<li><strong>動画URL</strong>: YouTube/Vimeoの動画を埋め込み</li>
						<li><strong>R2動画</strong>: Cloudflare R2に動画をアップロード（最大100MB）</li>
						<li><strong>Google Drive添付</strong>: Google Driveのファイルをリンク</li>
					</ul>
				</div>

				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
					<h4 class="font-bold text-blue-900 mb-2">R2動画アップロードの仕様</h4>
					<ul class="list-disc list-inside space-y-1 text-blue-900">
						<li><strong>対応形式</strong>: mp4, webm, ogg, mov</li>
						<li><strong>最大サイズ</strong>: 100MB（Cloudflare Workers制限）</li>
						<li><strong>プログレスバー</strong>: アップロード進行状況を表示</li>
					</ul>
				</div>
			</section>

			<!-- 4. 企業専用コンテンツ管理 -->
			<section id="company-contents" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-purple-600 border-b-2 border-purple-600 pb-3 mb-4">4. 企業専用コンテンツ管理</h2>
				<p class="mb-4">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/admin/company-contents</code></p>
				<p class="mb-4">各企業専用のコンテンツを作成・管理できます。企業専用コンテンツは、特定の企業のみが閲覧できるオリジナルコンテンツです。</p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 企業専用コンテンツ一覧</h3>
				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
					<h4 class="font-bold text-blue-900 mb-2">2つの表示モード</h4>
					<ul class="list-disc list-inside space-y-1 text-blue-900">
						<li><strong>企業一覧タブ</strong>: 企業ごとにコンテンツを管理</li>
						<li><strong>全コンテンツ一覧タブ</strong>: 全ての企業専用コンテンツを一覧表示</li>
					</ul>
				</div>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 全コンテンツ一覧タブの機能</h3>
				<ul class="list-disc list-inside ml-4 space-y-1 mb-4">
					<li><strong>検索</strong>: タイトルで検索</li>
					<li><strong>企業フィルター</strong>: 特定の企業のコンテンツのみ表示</li>
					<li><strong>並び替え</strong>: 企業名順・タイトル順・作成日順</li>
				</ul>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 コンテンツのコピー機能</h3>
				<div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
					<h4 class="font-bold text-green-900 mb-2">✅ 他企業へのコピー</h4>
					<p class="text-green-900 mb-2">作成した企業専用コンテンツを、他の企業にもコピーできます。</p>
					<ul class="list-disc list-inside space-y-1 text-green-900">
						<li>一覧画面の「コピー」ボタンをクリック</li>
						<li>コピー先の企業を選択</li>
						<li>「コピー実行」ボタンで完了</li>
					</ul>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
					<p class="text-yellow-900"><strong>💡 ヒント:</strong> コピーされたコンテンツは、コピー先企業の専用コンテンツとして独立して管理されます。コピー後に元のコンテンツを編集しても、コピー先には影響しません。</p>
				</div>
			</section>

			<!-- 5. 企業管理 -->
			<section id="companies" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-purple-600 border-b-2 border-purple-600 pb-3 mb-4">5. 企業管理</h2>
				<p class="mb-4">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/admin/companies</code></p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 企業登録</h3>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>企業名（必須）</li>
					<li>企業コード（任意）</li>
				</ul>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 企業編集</h3>
				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
					<h4 class="font-bold text-blue-900 mb-2">企業編集画面でできること</h4>
					<ul class="list-disc list-inside space-y-1 text-blue-900">
						<li>企業名・企業コードの変更</li>
						<li>統一ID設定（全企業共通アカウントの使用可否）</li>
						<li>コンテンツ閲覧権限の設定</li>
					</ul>
				</div>
			</section>

			<!-- 6. 生徒管理 -->
			<section id="students" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-purple-600 border-b-2 border-purple-600 pb-3 mb-4">6. 生徒管理</h2>
				<p class="mb-4">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/admin/students</code></p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 生徒登録</h3>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>ログインID（必須）</li>
					<li>パスワード（必須）</li>
					<li>名前（必須）</li>
					<li>所属企業（必須）</li>
				</ul>

				<div class="bg-green-50 border-l-4 border-green-500 p-4 mt-4">
					<h4 class="font-bold text-green-900 mb-2">✅ 統一IDのメリット</h4>
					<ul class="list-disc list-inside space-y-1 text-green-900">
						<li>企業ごとにアカウントを作成する必要がない</li>
						<li>全企業の生徒が同じIDでログイン可能</li>
						<li>企業ごとにコンテンツ閲覧権限を設定できる</li>
					</ul>
				</div>
			</section>

			<!-- 7. 企業担当者管理 -->
			<section id="staff" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-purple-600 border-b-2 border-purple-600 pb-3 mb-4">7. 企業担当者管理</h2>
				<p class="mb-4">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/admin/staff</code></p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 企業担当者登録</h3>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>ログインID（必須）</li>
					<li>パスワード（必須）</li>
					<li>名前（必須）</li>
					<li>所属企業（必須）</li>
				</ul>

				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
					<h4 class="font-bold text-blue-900 mb-2">企業担当者の権限</h4>
					<ul class="list-disc list-inside space-y-1 text-blue-900">
						<li>自社生徒の閲覧・管理</li>
						<li>自社スタッフの閲覧・管理</li>
						<li><strong>コンテンツの編集</strong>（管理者と同等の機能）</li>
						<li>閲覧権限のあるコンテンツの確認</li>
					</ul>
				</div>
			</section>
		</div>

		<!-- フッター -->
		<div class="mt-12 bg-green-50 border-l-4 border-green-500 p-6 rounded no-print">
			<h3 class="font-bold text-green-900 mb-2">📞 サポート</h3>
			<p class="text-green-900">ご不明な点がございましたら、システム管理者までお問い合わせください。</p>
		</div>

		<!-- バージョン履歴 -->
		<div class="mt-8 bg-gray-100 border border-gray-300 p-6 rounded">
			<h3 class="font-bold text-gray-700 mb-3">📋 更新履歴</h3>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-300">
						<th class="text-left py-2 pr-4 text-gray-600">バージョン</th>
						<th class="text-left py-2 pr-4 text-gray-600">更新日</th>
						<th class="text-left py-2 text-gray-600">更新内容</th>
					</tr>
				</thead>
				<tbody class="text-gray-700">
					<tr class="border-b border-gray-200">
						<td class="py-2 pr-4 font-medium">v1.2.0</td>
						<td class="py-2 pr-4">2024/12/02</td>
						<td class="py-2">企業専用コンテンツ管理・コピー機能のセクションを追加</td>
					</tr>
					<tr class="border-b border-gray-200">
						<td class="py-2 pr-4 font-medium">v1.1.0</td>
						<td class="py-2 pr-4">2024/11/15</td>
						<td class="py-2">R2動画アップロード機能の説明を追加</td>
					</tr>
					<tr>
						<td class="py-2 pr-4 font-medium">v1.0.0</td>
						<td class="py-2 pr-4">2024/10/01</td>
						<td class="py-2">初版作成</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- 戻るボタン -->
		<div class="mt-8 text-center no-print">
			<a href="/admin/dashboard" class="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
				ダッシュボードに戻る
			</a>
		</div>
	</div>
</div>
