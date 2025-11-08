import { getTursoClient } from './client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const turso = getTursoClient(
	process.env.TURSO_DATABASE_URL!,
	process.env.TURSO_AUTH_TOKEN!
);

async function removeUniqueConstraint() {
	try {
		console.log('usersテーブルのUNIQUE制約を削除中...');

		// SQLiteではALTER TABLEでUNIQUE制約を直接削除できないため、
		// 新しいテーブルを作成してデータを移行する必要があります

		// 1. 新しいテーブルを作成（UNIQUE制約なし）
		await turso.execute(`
			CREATE TABLE users_new (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				login_id TEXT NOT NULL,
				password_hash TEXT NOT NULL,
				role TEXT NOT NULL,
				company_id INTEGER,
				name TEXT,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (company_id) REFERENCES companies(id)
			)
		`);

		console.log('✓ 新しいusersテーブルを作成しました');

		// 2. データを移行
		await turso.execute(`
			INSERT INTO users_new (id, login_id, password_hash, role, company_id, name, created_at)
			SELECT id, login_id, password_hash, role, company_id, name, created_at
			FROM users
		`);

		console.log('✓ データを移行しました');

		// 3. 古いテーブルを削除
		await turso.execute('DROP TABLE users');

		console.log('✓ 古いusersテーブルを削除しました');

		// 4. 新しいテーブルの名前を変更
		await turso.execute('ALTER TABLE users_new RENAME TO users');

		console.log('✓ テーブル名を変更しました');
	} catch (error: any) {
		console.error('エラーが発生しました:', error);
		throw error;
	}
}

removeUniqueConstraint()
	.then(() => {
		console.log('マイグレーション完了: login_idのUNIQUE制約を削除しました');
		process.exit(0);
	})
	.catch((error) => {
		console.error('マイグレーション失敗:', error);
		process.exit(1);
	});
