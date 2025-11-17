import type { D1Wrapper } from './d1';

export async function initDatabase(db: D1Wrapper) {
	// 既存のテーブルを削除（必要な5つ+セクション以外は作らない）
	await db.execute('DROP TABLE IF EXISTS company_content_permissions');
	await db.execute('DROP TABLE IF EXISTS content_sections');
	await db.execute('DROP TABLE IF EXISTS contents');
	await db.execute('DROP TABLE IF EXISTS students');
	await db.execute('DROP TABLE IF EXISTS company_admins');
	await db.execute('DROP TABLE IF EXISTS admins');
	await db.execute('DROP TABLE IF EXISTS companies');

	// companies テーブル
	await db.execute(`
		CREATE TABLE IF NOT EXISTS companies (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			company_name TEXT NOT NULL,
			company_code TEXT UNIQUE,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// admins テーブル（マスター管理者）
	await db.execute(`
		CREATE TABLE IF NOT EXISTS admins (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			login_id TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			name TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// company_admins テーブル（企業担当者）
	await db.execute(`
		CREATE TABLE IF NOT EXISTS company_admins (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			login_id TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			company_id INTEGER NOT NULL,
			name TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
		)
	`);

	// students テーブル（生徒）
	await db.execute(`
		CREATE TABLE IF NOT EXISTS students (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			login_id TEXT NOT NULL,
			password_hash TEXT NOT NULL,
			company_id INTEGER NOT NULL,
			name TEXT NOT NULL,
			use_unified_id INTEGER DEFAULT 0,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
		)
	`);

	// contents テーブル
	await db.execute(`
		CREATE TABLE IF NOT EXISTS contents (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			description TEXT,
			content_type TEXT NOT NULL CHECK(content_type IN ('video', 'text')),
			content_url TEXT NOT NULL,
			category TEXT,
			"order" INTEGER DEFAULT 0,
			show_in_sidebar INTEGER DEFAULT 1,
			sidebar_icon TEXT DEFAULT 'document',
			sidebar_order INTEGER DEFAULT 0,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// content_sections テーブル（コンテンツのセクション）
	await db.execute(`
		CREATE TABLE IF NOT EXISTS content_sections (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			content_id INTEGER NOT NULL,
			section_type TEXT NOT NULL CHECK(section_type IN ('introduction', 'text', 'video', 'image', 'attachment')),
			title TEXT,
			items TEXT,
			"order" INTEGER DEFAULT 0,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
		)
	`);

	// company_content_permissions テーブル（企業ごとのコンテンツ閲覧許可）
	await db.execute(`
		CREATE TABLE IF NOT EXISTS company_content_permissions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			company_id INTEGER NOT NULL,
			content_id INTEGER NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
			FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
			UNIQUE(company_id, content_id)
		)
	`);

	console.log('Database initialized successfully');
}
