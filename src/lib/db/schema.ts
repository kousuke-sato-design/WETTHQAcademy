import type { Client } from '@libsql/client';

export async function initDatabase(turso?: Client) {
	if (!turso) {
		const { turso: defaultClient } = await import('./turso');
		turso = defaultClient;
	}

	// 既存のテーブルを削除（必要な5つ+セクション以外は作らない）
	await turso.execute('DROP TABLE IF EXISTS company_content_permissions');
	await turso.execute('DROP TABLE IF EXISTS content_sections');
	await turso.execute('DROP TABLE IF EXISTS contents');
	await turso.execute('DROP TABLE IF EXISTS students');
	await turso.execute('DROP TABLE IF EXISTS company_admins');
	await turso.execute('DROP TABLE IF EXISTS admins');
	await turso.execute('DROP TABLE IF EXISTS companies');

	// companies テーブル
	await turso.execute(`
		CREATE TABLE IF NOT EXISTS companies (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			company_name TEXT NOT NULL,
			company_code TEXT UNIQUE,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// admins テーブル（マスター管理者）
	await turso.execute(`
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
	await turso.execute(`
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
	await turso.execute(`
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
	await turso.execute(`
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
	await turso.execute(`
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
	await turso.execute(`
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

export async function seedDatabase(turso?: Client) {
	if (!turso) {
		const { turso: defaultClient } = await import('./turso');
		turso = defaultClient;
	}
	// マスター管理者を作成
	const bcrypt = await import('bcryptjs');
	const masterPasswordHash = await bcrypt.hash('14541454', 10);

	try {
		await turso.execute({
			sql: `INSERT INTO admins (login_id, password_hash, name) VALUES (?, ?, ?)`,
			args: ['kousuke-sato@sipe-selye.co.jp', masterPasswordHash, 'システム管理者']
		});
		console.log('Admin created: login_id=kousuke-sato@sipe-selye.co.jp, password=14541454');
	} catch (error) {
		console.log('Admin already exists');
	}

	// サンプル企業を作成
	try {
		await turso.execute({
			sql: `INSERT INTO companies (company_name, company_code) VALUES (?, ?)`,
			args: ['サンプル株式会社', '1001']
		});

		// 企業担当者を作成（パスワード: company123）
		const companyPasswordHash = await bcrypt.hash('company123', 10);
		await turso.execute({
			sql: `INSERT INTO company_admins (login_id, password_hash, company_id, name) VALUES (?, ?, ?, ?)`,
			args: ['company001', companyPasswordHash, 1, 'サンプル企業担当者']
		});
		console.log('Sample company admin created: login_id=company001, password=company123');

		// 統一ID生徒を作成
		const unifiedPassword = await bcrypt.hash('14541454', 10);
		await turso.execute({
			sql: `INSERT INTO students (login_id, password_hash, company_id, name, use_unified_id) VALUES (?, ?, ?, ?, ?)`,
			args: ['user', unifiedPassword, 1, '統一ID生徒', 1]
		});
		console.log('Unified ID student created: login_id=user, password=14541454');
	} catch (error) {
		console.log('Sample company already exists');
	}

	// サンプルコンテンツを作成
	const sampleContents = [
		{
			title: 'ストレスチェック制度の概要',
			description: 'ストレスチェック制度の基本的な説明',
			content_type: 'video',
			content_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
			category: '基礎知識',
			order: 1
		},
		{
			title: '実施手順ガイド',
			description: 'ストレスチェックの実施手順について',
			content_type: 'video',
			content_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
			category: '実施方法',
			order: 2
		},
		{
			title: '関連法令の解説',
			description: 'ストレスチェックに関する法令について',
			content_type: 'text',
			content_url: '/content/law.md',
			category: '法令',
			order: 3
		}
	];

	for (const content of sampleContents) {
		try {
			await turso.execute({
				sql: `INSERT INTO contents (title, description, content_type, content_url, category, "order") VALUES (?, ?, ?, ?, ?, ?)`,
				args: [
					content.title,
					content.description,
					content.content_type,
					content.content_url,
					content.category,
					content.order
				]
			});
		} catch (error) {
			// Already exists
		}
	}
	console.log('Sample contents created');
}
