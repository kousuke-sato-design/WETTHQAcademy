import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { turso } from '$lib/db/turso';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	// 企業一覧を取得
	const companiesResult = await turso.execute('SELECT id, company_name FROM companies ORDER BY company_name');

	const companies = companiesResult.rows.map((row) => ({
		id: row.id as number,
		company_name: row.company_name as string
	}));

	// 担当者一覧を取得（company_adminsテーブルから）
	const staffResult = await turso.execute(`
		SELECT ca.id, ca.name, ca.login_id, ca.created_at, c.company_name, ca.company_id
		FROM company_admins ca
		LEFT JOIN companies c ON ca.company_id = c.id
		ORDER BY ca.created_at DESC
	`);

	const staff = staffResult.rows.map((row) => ({
		id: row.id as number,
		name: row.name as string,
		login_id: row.login_id as string,
		company_name: row.company_name as string,
		company_id: row.company_id as number,
		created_at: row.created_at as string
	}));

	return {
		user: locals.user,
		companies,
		staff
	};
};

export const actions = {
	createStaff: async ({ request }) => {
		const data = await request.formData();
		const company_id = data.get('company_id')?.toString();
		const name = data.get('name')?.toString();
		const login_id = data.get('login_id')?.toString();
		const password = data.get('password')?.toString();

		// バリデーション
		if (!company_id || !name || !login_id || !password) {
			return fail(400, { error: 'すべてのフィールドを入力してください' });
		}

		if (password.length < 8) {
			return fail(400, { error: 'パスワードは8文字以上で設定してください' });
		}

		try {
			// パスワードをハッシュ化
			const passwordHash = await bcrypt.hash(password, 10);

			// 担当者を登録
			await turso.execute({
				sql: 'INSERT INTO company_admins (login_id, password_hash, company_id, name) VALUES (?, ?, ?, ?)',
				args: [login_id, passwordHash, parseInt(company_id), name]
			});

			return { success: true, message: '担当者の登録が完了しました' };
		} catch (error) {
			console.error('Staff creation error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	updateStaff: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const company_id = data.get('company_id')?.toString();
		const name = data.get('name')?.toString();
		const login_id = data.get('login_id')?.toString();
		const password = data.get('password')?.toString();

		// バリデーション
		if (!id || !company_id || !name || !login_id) {
			return fail(400, { error: 'すべての必須フィールドを入力してください' });
		}

		// パスワードが入力されている場合は長さチェック
		if (password && password.length < 8) {
			return fail(400, { error: 'パスワードは8文字以上で設定してください' });
		}

		try {
			// パスワードを変更する場合
			if (password) {
				const passwordHash = await bcrypt.hash(password, 10);
				await turso.execute({
					sql: 'UPDATE company_admins SET login_id = ?, password_hash = ?, company_id = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
					args: [login_id, passwordHash, parseInt(company_id), name, parseInt(id)]
				});
			} else {
				// パスワードを変更しない場合
				await turso.execute({
					sql: 'UPDATE company_admins SET login_id = ?, company_id = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
					args: [login_id, parseInt(company_id), name, parseInt(id)]
				});
			}

			return { success: true, message: '担当者情報を更新しました' };
		} catch (error) {
			console.error('Staff update error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	deleteStaff: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: '担当者IDが指定されていません' });
		}

		try {
			await turso.execute({
				sql: 'DELETE FROM company_admins WHERE id = ?',
				args: [parseInt(id)]
			});

			return { success: true, message: '担当者を削除しました' };
		} catch (error) {
			console.error('Staff delete error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
