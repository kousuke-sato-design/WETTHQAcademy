# WEBTHQAcademy 要件定義書（簡易版）

## プロジェクト概要
**目的**: 企業向けストレスチェック知識補完プラットフォーム
**技術**: SvelteKit + Cloudflare D1 + TypeScript + Tailwind CSS
**ホスティング**: Cloudflare Pages

## ユーザーロール
1. **マスター管理者** (`/admin/login`) - 全機能アクセス
2. **企業担当者** (`/company/login`) - 自社データ管理
3. **生徒** (`/user/login`) - コンテンツ閲覧

## データベース構造（7テーブル）
- **admins**: マスター管理者
- **companies**: 企業情報
- **company_admins**: 企業担当者
- **students**: 生徒（統一ID/個別ID対応）
- **contents**: 学習コンテンツ
- **content_sections**: コンテンツのセクション（JSON形式でitems保存）
- **company_content_permissions**: 企業別コンテンツ閲覧権限

## 主要機能
### 認証
- 3ロール認証システム (master/company_admin/user)
- セッション管理 (Cookie-based)
- 統一IDシステム（全企業共通の生徒アカウント: login_id="user"）

### コンテンツ管理
- セクション形式のコンテンツ（導入/本文/動画解説など）
- YouTube/Vimeo動画埋め込み
- マークダウン対応
- 企業別権限管理

### 画面構成
- **レイアウト**: Header + Sidebar + Main Content
- **サイドバー**: ロール別（AdminSidebar/CompanySidebar/UserSidebar）

## 主要ルート
| URL | 役割 | 遷移先 |
|-----|------|--------|
| `/admin/login` | マスター管理者 | `/admin/dashboard` |
| `/company/login` | 企業担当者 | `/company/dashboard` |
| `/user/login` | 生徒 | `/user/dashboard` |
| `/admin/contents/[id]/edit` | コンテンツ編集 | - |
| `/user/contents/[id]` | コンテンツ閲覧 | - |

## Cloudflare設定
### D1データベース
- **Database Name**: webthqacademy-db
- **Database ID**: c72094d5-6b99-4afe-9d3e-aee016b5a10d
- **Binding Name**: DB

### デプロイメント
```bash
# ビルド
npm run build

# デプロイ
npm run deploy

# ローカル開発（D1付き）
npm run dev
```

### マイグレーション
```bash
# スキーマ作成
npm run db:migrate

# シードデータ投入
npm run db:seed
```

## 実装済み機能
- ✅ 3ロール認証システム
- ✅ 統一ID対応（use_unified_id フラグ）
- ✅ セクション形式コンテンツ管理
- ✅ 企業別コンテンツ権限
- ✅ レスポンシブデザイン
- ✅ ロール別サイドバー
- ✅ Cloudflare D1移行完了
- ✅ Cloudflare Pages デプロイ

## 今後の拡張予定
- 学習進捗管理
- 修了証発行
- コンテンツ検索
- Cloudflare R2による動画アップロード機能
