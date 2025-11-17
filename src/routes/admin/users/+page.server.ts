import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	// 企業担当者を取得（company_adminsテーブルから）
	const usersResult = await db.execute(`
		SELECT
			ca.id,
			ca.name,
			ca.login_id,
			ca.company_id,
			ca.created_at,
			c.company_name
		FROM company_admins ca
		LEFT JOIN companies c ON ca.company_id = c.id
		ORDER BY ca.created_at DESC
	`);

	const users = usersResult.rows.map((row) => ({
		id: row.id as number,
		name: row.name as string,
		login_id: row.login_id as string,
		role: 'company_admin' as string,
		company_id: row.company_id as number | null,
		company_name: row.company_name as string | null,
		created_at: row.created_at as string,
		use_unified_id: 0 as number
	}));

	// 企業一覧を取得（プルダウン用）
	const companiesResult = await db.execute(`
		SELECT id, company_name, company_code
		FROM companies
		ORDER BY company_name ASC
	`);

	const companies = companiesResult.rows.map((row) => ({
		id: row.id as number,
		company_name: row.company_name as string,
		company_code: row.company_code as string | null
	}));

	return {
		user: locals.user,
		users,
		companies
	};
};

export const actions = {
	createUser: async ({ request, locals}) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const company_id = data.get('company_id')?.toString();
		const employee_number = data.get('employee_number')?.toString();
		const name = data.get('name')?.toString();

		// バリデーション
		if (!company_id) {
			return fail(400, { error: '企業を選択してください' });
		}

		if (!employee_number) {
			return fail(400, { error: '社員番号を入力してください' });
		}

		if (!name) {
			return fail(400, { error: '名前を入力してください' });
		}

		// 社員番号をログインIDとして使用、パスワードも社員番号と同じ
		const login_id = employee_number;
		const password = employee_number;

		const passwordHash = await bcrypt.hash(password, 10);

		try {
			await db.execute({
				sql: 'INSERT INTO company_admins (login_id, password_hash, company_id, name) VALUES (?, ?, ?, ?)',
				args: [login_id, passwordHash, parseInt(company_id), name]
			});

			return { success: true, message: '企業担当者を登録しました' };
		} catch (error) {
			console.error('User creation error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	deleteUser: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ユーザーIDが指定されていません' });
		}

		try {
			await db.execute({
				sql: 'DELETE FROM company_admins WHERE id = ?',
				args: [parseInt(id)]
			});

			return { success: true, message: '企業担当者を削除しました' };
		} catch (error) {
			console.error('User delete error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
