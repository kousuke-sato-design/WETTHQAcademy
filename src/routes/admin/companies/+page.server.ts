import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	// 企業一覧を取得（担当者数と生徒数も含む）
	const companiesResult = await db.execute(`
		SELECT
			c.id,
			c.company_name,
			c.company_code,
			c.created_at,
			COUNT(DISTINCT ca.id) as admin_count,
			COUNT(DISTINCT s.id) as student_count
		FROM companies c
		LEFT JOIN company_admins ca ON c.id = ca.company_id
		LEFT JOIN students s ON c.id = s.company_id
		GROUP BY c.id, c.company_name, c.company_code, c.created_at
		ORDER BY c.id ASC
	`);

	const companies = companiesResult.rows.map((row) => ({
		id: row.id as number,
		company_name: row.company_name as string,
		company_code: row.company_code as string | null,
		user_count: row.user_count as number,
		created_at: row.created_at as string
	}));

	return {
		user: locals.user,
		companies
	};
};

export const actions = {
	createCompany: async ({ request, locals}) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const company_name = data.get('company_name')?.toString();
		const company_code = data.get('company_code')?.toString();

		// バリデーション
		if (!company_name || !company_code) {
			return fail(400, { error: 'すべてのフィールドを入力してください' });
		}

		// 企業コードが数値のみかチェック
		if (!/^\d+$/.test(company_code)) {
			return fail(400, { error: '企業コードは数値のみで入力してください' });
		}

		try {
			// 企業コードの重複チェック
			const existingCompany = await db.execute({
				sql: 'SELECT id FROM companies WHERE company_code = ?',
				args: [company_code]
			});

			if (existingCompany.rows.length > 0) {
				return fail(400, { error: 'この企業コードは既に使用されています' });
			}

			// 企業を登録
			const companyResult = await db.execute({
				sql: 'INSERT INTO companies (company_name, company_code) VALUES (?, ?) RETURNING id',
				args: [company_name, company_code]
			});

			// 登録された企業のIDを取得
			const companyId = companyResult.rows[0].id as number;

			// 統一ID用の生徒アカウントを自動作成
			const unifiedPassword = '14541454';
			const passwordHash = await bcrypt.hash(unifiedPassword, 10);

			await db.execute({
				sql: 'INSERT INTO students (login_id, password_hash, company_id, name, use_unified_id) VALUES (?, ?, ?, ?, ?)',
				args: ['user', passwordHash, companyId, '統一ID生徒', 1]
			});

			return { success: true, message: '企業の登録が完了しました（統一ID生徒アカウントも作成されました）' };
		} catch (error) {
			console.error('Company creation error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	deleteCompany: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: '企業IDが指定されていません' });
		}

		try {
			// 企業を削除（CASCADE設定により関連する担当者と生徒も削除される）
			await db.execute({
				sql: 'DELETE FROM companies WHERE id = ?',
				args: [parseInt(id)]
			});

			return { success: true, message: '企業を削除しました' };
		} catch (error) {
			console.error('Company delete error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
