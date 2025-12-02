<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>企業担当者向けマニュアル - WEBTHQAcademy</title>
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
	<header class="bg-gradient-to-r from-pink-600 to-pink-800 text-white py-12 no-print">
		<div class="max-w-5xl mx-auto px-6">
			<a href="/company/dashboard" class="inline-block text-white hover:text-pink-200 mb-4 transition-colors">
				← ダッシュボードに戻る
			</a>
			<h1 class="text-4xl font-bold mb-2">📚 企業担当者向けマニュアル</h1>
			<p class="text-pink-100 text-lg">WEBTHQAcademy - 企業担当者用操作ガイド</p>
		</div>
	</header>

	<!-- コンテンツ -->
	<div class="max-w-5xl mx-auto px-6 py-12">
		<!-- 目次 -->
		<nav class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
			<h2 class="text-xl font-bold text-pink-600 mb-4">📑 目次</h2>
			<ul class="space-y-2">
				<li><a href="#overview" class="text-blue-600 hover:underline">1. システム概要</a></li>
				<li><a href="#login" class="text-blue-600 hover:underline">2. ログイン方法</a></li>
				<li><a href="#contents" class="text-blue-600 hover:underline">3. コンテンツ閲覧</a></li>
				<li><a href="#company-contents" class="text-blue-600 hover:underline">4. 企業専用コンテンツ管理</a></li>
				<li><a href="#students" class="text-blue-600 hover:underline">5. 生徒管理</a></li>
				<li><a href="#staff" class="text-blue-600 hover:underline">6. 担当者管理</a></li>
				<li><a href="#editor" class="text-blue-600 hover:underline">7. リッチテキストエディタの使い方</a></li>
			</ul>
		</nav>

		<!-- セクション -->
		<div class="space-y-8">
			<!-- 1. システム概要 -->
			<section id="overview" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-pink-600 border-b-2 border-pink-600 pb-3 mb-4">1. システム概要</h2>
				<p class="mb-4">WEBTHQAcademyは、企業向けストレスチェック知識補完プラットフォームです。企業担当者として、自社の生徒管理とコンテンツ管理を行えます。</p>

				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
					<h3 class="font-bold text-blue-900 mb-2">主な機能</h3>
					<ul class="list-disc list-inside space-y-1 text-blue-900">
						<li>受講可能なコンテンツの閲覧</li>
						<li><strong>企業専用コンテンツの作成・編集・削除</strong></li>
						<li>自社生徒の一覧・登録・編集・削除</li>
						<li>自社担当者の一覧・登録・編集・削除</li>
						<li>動画のアップロード・管理（最大100MB）</li>
					</ul>
				</div>
			</section>

			<!-- 2. ログイン方法 -->
			<section id="login" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-pink-600 border-b-2 border-pink-600 pb-3 mb-4">2. ログイン方法</h2>

				<div class="space-y-4">
					<div class="bg-gray-50 border-l-4 border-pink-500 p-4">
						<div class="flex items-start">
							<span class="inline-flex items-center justify-center w-8 h-8 bg-pink-500 text-white rounded-full font-bold mr-3 flex-shrink-0">1</span>
							<div>
								<strong class="block mb-1">ログインページにアクセス</strong>
								<p class="text-gray-700">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/company/login</code></p>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 border-l-4 border-pink-500 p-4">
						<div class="flex items-start">
							<span class="inline-flex items-center justify-center w-8 h-8 bg-pink-500 text-white rounded-full font-bold mr-3 flex-shrink-0">2</span>
							<div>
								<strong class="block mb-1">ログイン情報を入力</strong>
								<p class="text-gray-700">ログインIDとパスワードを入力してください。</p>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 border-l-4 border-pink-500 p-4">
						<div class="flex items-start">
							<span class="inline-flex items-center justify-center w-8 h-8 bg-pink-500 text-white rounded-full font-bold mr-3 flex-shrink-0">3</span>
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

			<!-- 3. コンテンツ閲覧 -->
			<section id="contents" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-pink-600 border-b-2 border-pink-600 pb-3 mb-4">3. コンテンツ閲覧</h2>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 コンテンツ一覧</h3>
				<p class="mb-4">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/company/contents</code></p>
				<p class="mb-4">自社が閲覧可能なコンテンツを確認できます。管理者が許可したコンテンツのみ表示されます。</p>

				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
					<h4 class="font-bold text-blue-900 mb-2">コンテンツの種類</h4>
					<ul class="list-disc list-inside space-y-1 text-blue-900">
						<li><strong>共通コンテンツ</strong>: 管理者が作成し、許可された全企業が閲覧可能</li>
						<li><strong>企業専用コンテンツ</strong>: 自社専用に作成されたオリジナルコンテンツ</li>
					</ul>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
					<p class="text-yellow-900"><strong>💡 ヒント:</strong> コンテンツをクリックすると詳細ページで閲覧できます。動画やテキスト、添付ファイルなど様々な形式のコンテンツがあります。</p>
				</div>
			</section>

			<!-- 4. 企業専用コンテンツ管理 -->
			<section id="company-contents" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-pink-600 border-b-2 border-pink-600 pb-3 mb-4">4. 企業専用コンテンツ管理</h2>
				<p class="mb-4">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/company/company-contents</code></p>

				<div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
					<h3 class="font-bold text-green-900 mb-2">✅ 企業専用コンテンツとは</h3>
					<p class="text-green-900">自社専用のオリジナルコンテンツを作成・編集できます。作成したコンテンツは自社の生徒のみが閲覧できます。</p>
				</div>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 新規コンテンツ作成</h3>
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

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 コンテンツの編集</h3>
				<p class="mb-4">作成したコンテンツは後から編集できます。一覧から編集したいコンテンツをクリックして、内容を更新してください。</p>
			</section>

			<!-- 5. 生徒管理 -->
			<section id="students" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-pink-600 border-b-2 border-pink-600 pb-3 mb-4">5. 生徒管理</h2>
				<p class="mb-4">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/company/users</code></p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 生徒一覧</h3>
				<p class="mb-4">自社に所属する生徒の一覧を確認できます。各生徒の情報を編集・削除することも可能です。</p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 新規生徒登録</h3>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>ログインID（必須）</li>
					<li>パスワード（必須）</li>
					<li>名前（必須）</li>
				</ul>

				<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
					<p class="text-yellow-900"><strong>💡 ヒント:</strong> 生徒は自社が閲覧権限を持つコンテンツのみアクセスできます。コンテンツ権限の設定は管理者が行います。</p>
				</div>
			</section>

			<!-- 6. 担当者管理 -->
			<section id="staff" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-pink-600 border-b-2 border-pink-600 pb-3 mb-4">6. 担当者管理</h2>
				<p class="mb-4">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/company/staff</code></p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 担当者一覧</h3>
				<p class="mb-4">自社の企業担当者の一覧を確認できます。各担当者の情報を編集・削除することも可能です。</p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 新規担当者登録</h3>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>ログインID（必須）</li>
					<li>パスワード（必須）</li>
					<li>名前（必須）</li>
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

			<!-- 7. リッチテキストエディタの使い方 -->
			<section id="editor" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-pink-600 border-b-2 border-pink-600 pb-3 mb-4">7. リッチテキストエディタの使い方</h2>

				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
					<h3 class="font-bold text-blue-900 mb-2">2つのモード</h3>
					<ul class="list-disc list-inside space-y-1 text-blue-900">
						<li><strong>ビジュアルモード</strong>: Word感覚で直感的に編集</li>
						<li><strong>HTMLモード</strong>: HTMLコードを直接編集</li>
					</ul>
				</div>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 基本的な使い方</h3>
				<div class="space-y-3">
					<div class="bg-gray-50 border-l-4 border-pink-500 p-4">
						<strong class="block mb-1">📝 テキスト装飾</strong>
						<ul class="list-disc list-inside ml-4 space-y-1 text-gray-700">
							<li>太字、斜体、下線、取り消し線</li>
							<li>見出し（H1〜H6）</li>
							<li>文字色、背景色の変更</li>
						</ul>
					</div>

					<div class="bg-gray-50 border-l-4 border-pink-500 p-4">
						<strong class="block mb-1">📋 リスト</strong>
						<ul class="list-disc list-inside ml-4 space-y-1 text-gray-700">
							<li>箇条書きリスト（•）</li>
							<li>番号付きリスト（1, 2, 3...）</li>
						</ul>
					</div>

					<div class="bg-gray-50 border-l-4 border-pink-500 p-4">
						<strong class="block mb-1">🔗 リンクと画像</strong>
						<ul class="list-disc list-inside ml-4 space-y-1 text-gray-700">
							<li>ハイパーリンクの挿入</li>
							<li>画像の埋め込み（URL指定）</li>
						</ul>
					</div>

					<div class="bg-gray-50 border-l-4 border-pink-500 p-4">
						<strong class="block mb-1">📊 表</strong>
						<ul class="list-disc list-inside ml-4 space-y-1 text-gray-700">
							<li>表の挿入・編集</li>
							<li>行・列の追加・削除</li>
						</ul>
					</div>
				</div>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 HTMLモードの使い方</h3>
				<p class="mb-4">より高度なカスタマイズが必要な場合は、HTMLモードに切り替えてください。</p>
				<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
					<p class="text-yellow-900"><strong>⚠️ 注意:</strong> HTMLモードでは不正なタグを入力すると表示が崩れる可能性があります。基本的にはビジュアルモードの使用をおすすめします。</p>
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
						<td class="py-2">企業専用コンテンツ管理セクションを追加、コンテンツ閲覧セクションを分離</td>
					</tr>
					<tr class="border-b border-gray-200">
						<td class="py-2 pr-4 font-medium">v1.1.0</td>
						<td class="py-2 pr-4">2024/11/15</td>
						<td class="py-2">リッチテキストエディタの使い方を追加</td>
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
			<a href="/company/dashboard" class="inline-block px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors shadow-sm">
				ダッシュボードに戻る
			</a>
		</div>
	</div>
</div>
