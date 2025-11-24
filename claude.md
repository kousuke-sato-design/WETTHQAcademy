# WEBTHQAcademy 要件定義書

## プロジェクト概要
**目的**: 企業向けストレスチェック知識補完プラットフォーム
**技術**: SvelteKit + Cloudflare D1 + Cloudflare R2 + TypeScript + Tailwind CSS
**ホスティング**: Cloudflare Pages

## ユーザーロール
1. **マスター管理者** (`/admin/login`) - 全機能アクセス
2. **企業担当者** (`/company/login`) - 自社データ管理・コンテンツ編集
3. **生徒** (`/user/login`) - コンテンツ閲覧

## データベース構造（6テーブル）
- **admins**: マスター管理者
- **companies**: 企業情報（company_code含む）
- **company_admins**: 企業担当者
- **students**: 生徒（統一ID/個別ID対応、use_unified_id フラグ）
- **contents**: 学習コンテンツ（sections列にJSON形式でセクション保存）
- **company_content_permissions**: 企業別コンテンツ閲覧権限

### 主要テーブル詳細

#### contents テーブル
- `id`: コンテンツID
- `title`: タイトル
- `description`: 説明
- `content_type`: コンテンツタイプ（'video' | 'text'）
- `content_url`: コンテンツURL
- `category`: カテゴリ
- `order`: 表示順序
- `show_in_sidebar`: サイドバー表示フラグ
- `sidebar_icon`: サイドバーアイコン
- `sidebar_order`: サイドバー表示順序
- `sections`: **JSON形式のセクションデータ**（後述）
- `created_at`: 作成日時

#### sections データ構造（contentsテーブルのsections列）
JSON形式で以下の構造を保存：
```json
[
  {
    "title": "セクションタイトル",
    "sectionType": "text | video | r2_video | attachment",
    "items": [
      {
        "type": "text | video | r2_video | attachment",
        "content": "コンテンツ本体"
      }
    ],
    "order": 0
  }
]
```

**セクションタイプ**:
- `text`: HTMLテキスト（リッチテキストエディタで編集）
- `video`: YouTube/Vimeo動画URL
- `r2_video`: Cloudflare R2にアップロードした動画
- `attachment`: Google Driveファイル添付

## 主要機能

### 認証システム
- 3ロール認証（master/company_admin/user）
- Cookie-basedセッション管理
- 統一IDシステム（全企業共通の生徒アカウント: login_id="user"）
- セッション有効期限: 7日間

### コンテンツ管理
- **セクション形式のコンテンツ**
  - HTMLテキスト（リッチテキストエディタ）
  - YouTube/Vimeo動画埋め込み
  - Cloudflare R2動画アップロード（最大100MB）
  - Google Drive添付ファイル
- **リッチテキストエディタ機能**
  - ビジュアル編集モード/HTMLコードモード切替
  - 太字、斜体、見出し、リスト、カラー、マーカー
  - 絵文字パレット（26種類）
- **企業別権限管理**（company_content_permissions）
- **コンテンツプレビュー**（編集画面でリアルタイムプレビュー）

### Cloudflare R2動画管理
- **動画アップロード**: `/api/upload/video`
  - 対応形式: mp4, webm, ogg, mov
  - 最大ファイルサイズ: 100MB（Cloudflare Workers制限）
  - プログレスバー表示
- **動画一覧取得**: `/api/videos/list`
- **動画配信**: `/api/video/[filename]`
- **R2バケット**: webthqacademy-videos

### 企業担当者機能
- 自社生徒の管理
- **コンテンツ編集**（`/company/contents/edit/[id]`）
  - マスター管理者と同等の編集機能
  - R2動画アップロード
  - リッチテキストエディタ
- 自社スタッフ管理

### 画面構成
- **レイアウト**: Header + Sidebar + Main Content
- **サイドバー**: ロール別（AdminSidebar/CompanySidebar/UserSidebar）
- **レスポンシブデザイン**: モバイル対応

## 主要ルート

### 認証
| URL | 役割 | 遷移先 |
|-----|------|--------|
| `/admin/login` | マスター管理者ログイン | `/admin/dashboard` |
| `/company/login` | 企業担当者ログイン | `/company/dashboard` |
| `/user/login` | 生徒ログイン | `/user/dashboard` |
| `/api/logout` | ログアウト | ログイン画面 |

### マスター管理者
| URL | 役割 |
|-----|------|
| `/admin/dashboard` | ダッシュボード |
| `/admin/contents` | コンテンツ一覧 |
| `/admin/contents/new` | コンテンツ新規作成 |
| `/admin/contents/edit/[id]` | コンテンツ編集 |
| `/admin/companies` | 企業一覧 |
| `/admin/companies/[id]/edit` | 企業編集 |
| `/admin/students` | 生徒一覧 |
| `/admin/staff` | 企業担当者一覧 |

### 企業担当者
| URL | 役割 |
|-----|------|
| `/company/dashboard` | ダッシュボード |
| `/company/contents` | コンテンツ一覧（閲覧権限のあるもの） |
| `/company/contents/edit/[id]` | **コンテンツ編集** |
| `/company/users` | 自社生徒一覧 |
| `/company/staff` | 自社スタッフ一覧 |

### 生徒
| URL | 役割 |
|-----|------|
| `/user/dashboard` | ダッシュボード |
| `/user/contents/[id]` | コンテンツ閲覧 |

### API
| URL | 役割 |
|-----|------|
| `/api/logout` | ログアウト |
| `/api/upload/video` | R2動画アップロード（POST） |
| `/api/videos/list` | R2動画一覧取得（GET） |
| `/api/video/[filename]` | R2動画配信（GET） |

## Cloudflare設定

### D1データベース
- **Database Name**: webthqacademy-db
- **Database ID**: c72094d5-6b99-4afe-9d3e-aee016b5a10d
- **Binding Name**: DB

### R2バケット
- **Bucket Name**: webthqacademy-videos
- **Binding Name**: VIDEOS
- **用途**: 動画ファイルストレージ（最大100MB/ファイル）

### デプロイメント
```bash
# ローカル開発（D1付き）
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# デプロイ
npm run deploy
```

### マイグレーション
```bash
# スキーマ作成
npm run db:migrate

# シードデータ投入
npm run db:seed
```

### wrangler.toml 設定
```toml
name = "webthqacademy"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".svelte-kit/cloudflare"

# D1データベース
[[d1_databases]]
binding = "DB"
database_name = "webthqacademy-db"
database_id = "c72094d5-6b99-4afe-9d3e-aee016b5a10d"

# R2バケット
[[r2_buckets]]
binding = "VIDEOS"
bucket_name = "webthqacademy-videos"
```

## 実装済み機能
- ✅ 3ロール認証システム
- ✅ 統一ID対応（use_unified_id フラグ）
- ✅ セクション形式コンテンツ管理（contentsテーブルに統合）
- ✅ 企業別コンテンツ権限
- ✅ レスポンシブデザイン
- ✅ ロール別サイドバー
- ✅ Cloudflare D1移行完了
- ✅ Cloudflare Pages デプロイ
- ✅ **Cloudflare R2動画アップロード・配信**
- ✅ **企業担当者のコンテンツ編集機能**
- ✅ **リッチテキストエディタ（ビジュアル/コード編集）**
- ✅ **R2動画セクションタイプ**
- ✅ **リアルタイムプレビュー機能**

## 技術スタック
- **フロントエンド**: SvelteKit 2.x, Svelte 5.x, TypeScript
- **スタイリング**: Tailwind CSS 4.x
- **バックエンド**: Cloudflare Workers, Cloudflare Pages Functions
- **データベース**: Cloudflare D1 (SQLite)
- **ストレージ**: Cloudflare R2
- **認証**: bcryptjs（パスワードハッシュ化）
- **ビルドツール**: Vite 7.x

## セキュリティ
- パスワードハッシュ化（bcryptjs、salt rounds: 10）
- セッション管理（HttpOnly Cookie）
- CSRF対策（SvelteKitデフォルト機能）
- ファイルサイズ制限（動画アップロード: 最大100MB）
- ファイルタイプ検証（動画: mp4, webm, ogg, mov のみ）

## 今後の拡張予定
- 学習進捗管理
- 修了証発行
- コンテンツ検索機能
- R2動画のトランスコーディング対応
- R2カスタムドメイン設定
- コンテンツバージョン管理
- 生徒のコメント機能
