<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>生徒向けマニュアル - WEBTHQAcademy</title>
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
	<header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 no-print">
		<div class="max-w-5xl mx-auto px-6">
			<a href="/user/dashboard" class="inline-block text-white hover:text-blue-200 mb-4 transition-colors">
				← ダッシュボードに戻る
			</a>
			<h1 class="text-4xl font-bold mb-2">📚 生徒向けマニュアル</h1>
			<p class="text-blue-100 text-lg">WEBTHQAcademy - 学習者用操作ガイド</p>
		</div>
	</header>

	<!-- コンテンツ -->
	<div class="max-w-5xl mx-auto px-6 py-12">
		<!-- 目次 -->
		<nav class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
			<h2 class="text-xl font-bold text-blue-600 mb-4">📑 目次</h2>
			<ul class="space-y-2">
				<li><a href="#overview" class="text-blue-600 hover:underline">1. WEBTHQAcademyとは</a></li>
				<li><a href="#login" class="text-blue-600 hover:underline">2. ログイン方法</a></li>
				<li><a href="#dashboard" class="text-blue-600 hover:underline">3. ダッシュボードの見方</a></li>
				<li><a href="#contents" class="text-blue-600 hover:underline">4. コンテンツの閲覧方法</a></li>
				<li><a href="#tips" class="text-blue-600 hover:underline">5. 学習のヒント</a></li>
				<li><a href="#troubleshooting" class="text-blue-600 hover:underline">6. よくある質問</a></li>
			</ul>
		</nav>

		<!-- セクション -->
		<div class="space-y-8">
			<!-- 1. WEBTHQAcademyとは -->
			<section id="overview" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">1. WEBTHQAcademyとは</h2>
				<p class="mb-4">WEBTHQAcademyは、企業向けストレスチェック知識補完プラットフォームです。職場のストレスチェックに関する基礎知識から実践的な対応方法まで、幅広く学習できます。</p>

				<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
					<h3 class="font-bold text-blue-900 mb-2">学習できる内容</h3>
					<ul class="list-disc list-inside space-y-1 text-blue-900">
						<li>ストレスチェック制度の基礎知識</li>
						<li>職場環境改善の方法</li>
						<li>メンタルヘルスケアの実践</li>
						<li>ケーススタディと事例紹介</li>
						<li>動画による分かりやすい解説</li>
					</ul>
				</div>
			</section>

			<!-- 2. ログイン方法 -->
			<section id="login" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">2. ログイン方法</h2>

				<div class="space-y-4">
					<div class="bg-gray-50 border-l-4 border-blue-500 p-4">
						<div class="flex items-start">
							<span class="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold mr-3 flex-shrink-0">1</span>
							<div>
								<strong class="block mb-1">ログインページにアクセス</strong>
								<p class="text-gray-700">URL: <code class="bg-gray-200 px-2 py-1 rounded text-sm">/user/login</code></p>
								<p class="text-gray-600 text-sm mt-1">ブラウザのブックマークに保存しておくと便利です。</p>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 border-l-4 border-blue-500 p-4">
						<div class="flex items-start">
							<span class="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold mr-3 flex-shrink-0">2</span>
							<div>
								<strong class="block mb-1">ログインIDとパスワードを入力</strong>
								<p class="text-gray-700">企業担当者から発行されたログインIDとパスワードを入力してください。</p>
							</div>
						</div>
					</div>

					<div class="bg-gray-50 border-l-4 border-blue-500 p-4">
						<div class="flex items-start">
							<span class="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold mr-3 flex-shrink-0">3</span>
							<div>
								<strong class="block mb-1">ログインボタンをクリック</strong>
								<p class="text-gray-700">認証が成功すると、学習ダッシュボードに遷移します。</p>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
					<p class="text-yellow-900"><strong>💡 ヒント:</strong> セッションは7日間有効です。7日以内に再度アクセスすれば、自動的にログインされます。</p>
				</div>

				<div class="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
					<p class="text-red-900"><strong>⚠️ 注意:</strong> 共用PCを使用する場合は、学習後に必ずログアウトしてください。</p>
				</div>
			</section>

			<!-- 3. ダッシュボードの見方 -->
			<section id="dashboard" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">3. ダッシュボードの見方</h2>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 統計カード</h3>
				<p class="mb-4">ダッシュボード上部には、あなたの学習状況が表示されます。</p>
				<ul class="list-disc list-inside ml-4 space-y-1 mb-4">
					<li><strong>利用可能なコンテンツ</strong>: あなたが閲覧できるコンテンツの総数</li>
					<li><strong>学習進捗</strong>: 今後実装予定の機能です</li>
					<li><strong>学習時間</strong>: 今後実装予定の機能です</li>
				</ul>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 学習コンテンツ一覧</h3>
				<p class="mb-4">ダッシュボードには、利用可能なすべてのコンテンツがカード形式で表示されます。カードをクリックすると、コンテンツの詳細ページに移動します。</p>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 サイドバーメニュー</h3>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li><strong>ダッシュボード</strong>: ホーム画面に戻ります</li>
					<li><strong>コンテンツ一覧</strong>: すべてのコンテンツを一覧表示します</li>
					<li><strong>ログアウト</strong>: システムからログアウトします</li>
				</ul>
			</section>

			<!-- 4. コンテンツの閲覧方法 -->
			<section id="contents" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">4. コンテンツの閲覧方法</h2>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 コンテンツの構成</h3>
				<p class="mb-4">各コンテンツは、以下のようなセクションで構成されています：</p>
				<ul class="list-disc list-inside ml-4 space-y-1 mb-4">
					<li><strong>導入</strong>: 学習内容の概要</li>
					<li><strong>本文</strong>: 詳細な説明とテキスト教材</li>
					<li><strong>動画解説</strong>: 分かりやすい動画コンテンツ</li>
					<li><strong>まとめ</strong>: 重要ポイントの復習</li>
					<li><strong>資料</strong>: ダウンロード可能な補足資料（Google Drive）</li>
				</ul>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 動画の視聴方法</h3>
				<div class="space-y-3">
					<div class="bg-gray-50 border-l-4 border-blue-500 p-4">
						<strong class="block mb-1">YouTube/Vimeo動画</strong>
						<p class="text-gray-700">埋め込まれたプレーヤーで直接視聴できます。再生速度の変更や字幕表示も可能です。</p>
					</div>

					<div class="bg-gray-50 border-l-4 border-blue-500 p-4">
						<strong class="block mb-1">R2動画（アップロード動画）</strong>
						<p class="text-gray-700">システムに直接アップロードされた動画です。ブラウザの標準プレーヤーで再生されます。</p>
					</div>
				</div>

				<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 資料のダウンロード</h3>
				<p class="mb-4">Google Drive添付セクションでは、補足資料をダウンロードできます。リンクをクリックすると、Google Driveの共有ページが開きます。</p>
			</section>

			<!-- 5. 学習のヒント -->
			<section id="tips" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">5. 学習のヒント</h2>

				<div class="space-y-4">
					<div class="bg-green-50 border-l-4 border-green-500 p-4">
						<h3 class="font-bold text-green-900 mb-2">✅ 効果的な学習方法</h3>
						<ul class="list-disc list-inside space-y-1 text-green-900">
							<li>まずは全体を一度ざっと読んで、概要を把握しましょう</li>
							<li>動画は1.5倍速や2倍速で視聴すると効率的です</li>
							<li>重要なポイントはメモを取りながら学習しましょう</li>
							<li>学んだ内容を実際の業務に活かすことを意識しましょう</li>
						</ul>
					</div>

					<div class="bg-blue-50 border-l-4 border-blue-500 p-4">
						<h3 class="font-bold text-blue-900 mb-2">📱 デバイス別の推奨</h3>
						<ul class="list-disc list-inside space-y-1 text-blue-900">
							<li><strong>PC</strong>: 快適に学習できます（推奨）</li>
							<li><strong>タブレット</strong>: 動画視聴に最適です</li>
							<li><strong>スマートフォン</strong>: 通勤時間の学習に便利です</li>
						</ul>
					</div>

					<div class="bg-red-50 border-l-4 border-red-500 p-4">
						<h3 class="font-bold text-red-900 mb-2">⚠️ スマートフォンでの動画視聴について</h3>
						<p class="text-red-900 mb-2"><strong>モバイルデータ通信で動画を視聴すると、データ通信容量を大きく消費します。</strong></p>
						<ul class="list-disc list-inside space-y-1 text-red-900">
							<li>Wi-Fi環境での視聴を強く推奨します</li>
							<li>動画コンテンツは数十MB〜数百MBのデータ量になることがあります</li>
							<li>通信制限がかかる可能性がありますのでご注意ください</li>
						</ul>
					</div>

					<div class="bg-purple-50 border-l-4 border-purple-500 p-4">
						<h3 class="font-bold text-purple-900 mb-2">⏰ 学習時間の確保</h3>
						<ul class="list-disc list-inside space-y-1 text-purple-900">
							<li>1日15〜30分の短い時間でも継続的に学習しましょう</li>
							<li>通勤時間や休憩時間を活用するのも効果的です</li>
							<li>週末にまとめて復習するのもおすすめです</li>
						</ul>
					</div>
				</div>
			</section>

			<!-- 6. よくある質問 -->
			<section id="troubleshooting" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-2xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">6. よくある質問</h2>

				<div class="space-y-6">
					<div class="border-l-4 border-gray-300 pl-4">
						<h3 class="font-bold text-gray-900 mb-2">Q1. ログインIDやパスワードを忘れてしまいました</h3>
						<p class="text-gray-700">A. 企業担当者にお問い合わせください。新しいパスワードを発行してもらえます。</p>
					</div>

					<div class="border-l-4 border-gray-300 pl-4">
						<h3 class="font-bold text-gray-900 mb-2">Q2. 動画が再生されません</h3>
						<p class="text-gray-700">A. 以下の点を確認してください：</p>
						<ul class="list-disc list-inside ml-4 space-y-1 text-gray-700">
							<li>インターネット接続を確認</li>
							<li>ブラウザを最新版に更新</li>
							<li>別のブラウザで試してみる（Chrome、Edge、Safariなど）</li>
							<li>ページを再読み込み（F5キーまたは更新ボタン）</li>
						</ul>
					</div>

					<div class="border-l-4 border-gray-300 pl-4">
						<h3 class="font-bold text-gray-900 mb-2">Q3. スマートフォンで見やすくするには？</h3>
						<p class="text-gray-700">A. システムはレスポンシブデザインに対応しています。縦向きでも横向きでも見やすく表示されます。動画視聴時は横向きがおすすめです。</p>
					</div>

					<div class="border-l-4 border-gray-300 pl-4">
						<h3 class="font-bold text-gray-900 mb-2">Q4. 学習の進捗は記録されますか？</h3>
						<p class="text-gray-700">A. 現在は進捗記録機能は準備中です。今後のアップデートで追加予定です。</p>
					</div>

					<div class="border-l-4 border-gray-300 pl-4">
						<h3 class="font-bold text-gray-900 mb-2">Q5. コンテンツが表示されません</h3>
						<p class="text-gray-700">A. 所属企業に閲覧権限がないコンテンツは表示されません。閲覧したいコンテンツがある場合は、企業担当者にご相談ください。</p>
					</div>

					<div class="border-l-4 border-gray-300 pl-4">
						<h3 class="font-bold text-gray-900 mb-2">Q6. 修了証は発行されますか？</h3>
						<p class="text-gray-700">A. 修了証発行機能は今後実装予定です。</p>
					</div>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
					<p class="text-yellow-900"><strong>💡 その他の質問:</strong> 上記で解決しない場合は、企業担当者またはシステム管理者にお問い合わせください。</p>
				</div>
			</section>
		</div>

		<!-- フッター -->
		<div class="mt-12 bg-green-50 border-l-4 border-green-500 p-6 rounded no-print">
			<h3 class="font-bold text-green-900 mb-2">📞 サポート</h3>
			<p class="text-green-900">ご不明な点がございましたら、企業担当者またはシステム管理者までお問い合わせください。</p>
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
						<td class="py-2 pr-4 font-medium">v1.1.0</td>
						<td class="py-2 pr-4">2024/12/02</td>
						<td class="py-2">スマートフォンでの動画視聴時のデータ通信に関する注意事項を追加</td>
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
			<a href="/user/dashboard" class="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
				ダッシュボードに戻る
			</a>
		</div>
	</div>
</div>
