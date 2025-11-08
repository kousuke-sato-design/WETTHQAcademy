import { getTursoClient } from './client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const turso = getTursoClient(
	process.env.TURSO_DATABASE_URL!,
	process.env.TURSO_AUTH_TOKEN!
);

async function addUseUnifiedIdColumn() {
	try {
		console.log('usersテーブルにuse_unified_id列を追加中...');

		// use_unified_id列を追加（デフォルトはfalse）
		await turso.execute(`
			ALTER TABLE users ADD COLUMN use_unified_id INTEGER DEFAULT 0
		`);

		console.log('✓ use_unified_id列を追加しました');

		// login_idが "user" の既存ユーザーをuse_unified_id = 1に設定
		await turso.execute(`
			UPDATE users SET use_unified_id = 1 WHERE login_id = 'user' AND role = 'user'
		`);

		console.log('✓ 既存の統一IDユーザーを更新しました');
	} catch (error: any) {
		console.error('エラーが発生しました:', error);
		throw error;
	}
}

addUseUnifiedIdColumn()
	.then(() => {
		console.log('マイグレーション完了: use_unified_id列を追加しました');
		process.exit(0);
	})
	.catch((error) => {
		console.error('マイグレーション失敗:', error);
		process.exit(1);
	});
