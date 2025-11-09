# WEBTHQAcademy 要件定義書（簡易版）

## プロジェクト概要
**目的**: 企業向けストレスチェック知識補完プラットフォーム
**技術**: SvelteKit + Turso (libSQL) + TypeScript + Tailwind CSS
**ホスティング**: Vercel

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
- YouTube動画埋め込み
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

## 環境変数
```bash
TURSO_DATABASE_URL="libsql://..."
TURSO_AUTH_TOKEN="..."
```

## 実装済み機能
- ✅ 3ロール認証システム
- ✅ 統一ID対応（use_unified_id フラグ）
- ✅ セクション形式コンテンツ管理
- ✅ 企業別コンテンツ権限
- ✅ レスポンシブデザイン
- ✅ ロール別サイドバー

## 今後の拡張予定
- 学習進捗管理
- 修了証発行
- コンテンツ検索
