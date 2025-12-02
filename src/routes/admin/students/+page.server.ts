import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	// 生徒を取得（studentsテーブルから）
	const studentsResult = await db.execute(`
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
		students,
		companies
	};
};

export const actions = {
	createStudent: async ({ request, locals}) => {
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
				sql: 'INSERT INTO students (login_id, password_hash, company_id, name, use_unified_id) VALUES (?, ?, ?, ?, ?)',
				args: [login_id, passwordHash, parseInt(company_id), name, 0]
			});

			return { success: true, message: '生徒を登録しました' };
		} catch (error) {
			console.error('Student creation error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	deleteStudent: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: '生徒IDが指定されていません' });
		}

		try {
			await db.execute({
				sql: 'DELETE FROM students WHERE id = ?',
				args: [parseInt(id)]
			});

			return { success: true, message: '生徒を削除しました' };
		} catch (error) {
			console.error('Student delete error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	updateStudent: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const id = data.get('id')?.toString();
		const login_id = data.get('login_id')?.toString();
		const password = data.get('password')?.toString();

		// バリデーション
		if (!id) {
			return fail(400, { error: '生徒IDが指定されていません' });
		}

		if (!login_id) {
			return fail(400, { error: 'ユーザーIDを入力してください' });
		}

		if (login_id.length < 2) {
			return fail(400, { error: 'ユーザーIDは2文字以上で入力してください' });
		}

		try {
			// 生徒が存在するか確認（統一IDのみ更新可能）
			const studentResult = await db.execute({
				sql: 'SELECT id, use_unified_id, login_id FROM students WHERE id = ?',
				args: [parseInt(id)]
			});

			if (studentResult.rows.length === 0) {
				return fail(404, { error: '生徒が見つかりません' });
			}

			const student = studentResult.rows[0];
			if (student.use_unified_id !== 1) {
				return fail(400, { error: '統一ID以外の生徒は編集できません' });
			}

			// ログインIDの重複チェック（自分以外で同じログインIDがないか）
			const duplicateCheck = await db.execute({
				sql: 'SELECT id FROM students WHERE login_id = ? AND id != ?',
				args: [login_id, parseInt(id)]
			});

			if (duplicateCheck.rows.length > 0) {
				return fail(400, { error: 'このユーザーIDは既に使用されています' });
			}

			// パスワードが入力されている場合はハッシュ化して更新
			if (password && password.length > 0) {
				if (password.length < 4) {
					return fail(400, { error: 'パスワードは4文字以上で入力してください' });
				}
				const passwordHash = await bcrypt.hash(password, 10);
				await db.execute({
					sql: 'UPDATE students SET login_id = ?, password_hash = ? WHERE id = ?',
					args: [login_id, passwordHash, parseInt(id)]
				});
				console.log(`[統一ID生徒更新] ID: ${id} のユーザーIDとパスワードを更新しました`);
				return { success: true, message: 'ユーザーIDとパスワードを更新しました' };
			} else {
				// パスワードが空の場合はログインIDのみ更新
				await db.execute({
					sql: 'UPDATE students SET login_id = ? WHERE id = ?',
					args: [login_id, parseInt(id)]
				});
				console.log(`[統一ID生徒更新] ID: ${id} のユーザーIDを更新しました`);
				return { success: true, message: 'ユーザーIDを更新しました' };
			}
		} catch (error) {
			console.error('Student update error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
