import { getTursoClient } from './client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const turso = getTursoClient(
	process.env.TURSO_DATABASE_URL!,
	process.env.TURSO_AUTH_TOKEN!
);

async function addCompanyCode() {
	try {
		console.log('企業テーブルに company_code カラムを追加中...');

		// company_code カラムを追加
		await turso.execute(`
			ALTER TABLE companies ADD COLUMN company_code TEXT
		`);

		console.log('✓ company_code カラムを追加しました');
	} catch (error: any) {
		if (error.message?.includes('duplicate column name')) {
			console.log('company_code カラムは既に存在します');
		} else {
			console.error('エラーが発生しました:', error);
			throw error;
		}
	}
}

addCompanyCode()
	.then(() => {
		console.log('マイグレーション完了');
		process.exit(0);
	})
	.catch((error) => {
		console.error('マイグレーション失敗:', error);
		process.exit(1);
	});
