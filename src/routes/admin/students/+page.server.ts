import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { turso } from '$lib/db/turso';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	// 生徒を取得（studentsテーブルから）
	const studentsResult = await turso.execute(`
		SELECT
			s.id,
			s.name,
			s.login_id,
			s.company_id,
			s.created_at,
			s.use_unified_id,
			c.company_name
		FROM students s
		LEFT JOIN companies c ON s.company_id = c.id
		ORDER BY s.created_at DESC
	`);

	const students = studentsResult.rows.map((row) => ({
		id: row.id as number,
		name: row.name as string,
		login_id: row.login_id as string,
		company_id: row.company_id as number | null,
		company_name: row.company_name as string | null,
		created_at: row.created_at as string,
		use_unified_id: row.use_unified_id as number
	}));

	// 企業一覧を取得（プルダウン用）
	const companiesResult = await turso.execute(`
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
		students,
		companies
	};
};

export const actions = {
	createStudent: async ({ request }) => {
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
			await turso.execute({
				sql: 'INSERT INTO students (login_id, password_hash, company_id, name, use_unified_id) VALUES (?, ?, ?, ?, ?)',
				args: [login_id, passwordHash, parseInt(company_id), name, 0]
			});

			return { success: true, message: '生徒を登録しました' };
		} catch (error) {
			console.error('Student creation error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	deleteStudent: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: '生徒IDが指定されていません' });
		}

		try {
			await turso.execute({
				sql: 'DELETE FROM students WHERE id = ?',
				args: [parseInt(id)]
			});

			return { success: true, message: '生徒を削除しました' };
		} catch (error) {
			console.error('Student delete error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
