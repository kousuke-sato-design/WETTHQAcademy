import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { verifyCredentials } from '$lib/auth/auth';

export const actions = {
	login: async ({ request, cookies, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const company_code = data.get('company_code')?.toString();
		const login_id = data.get('login_id')?.toString();
		const password = data.get('password')?.toString();

		if (!company_code || !login_id || !password) {
			return fail(400, { error: '全ての項目を入力してください' });
		}

		// 企業コードで企業を検索
		const companyResult = await db.execute({
			sql: 'SELECT id FROM companies WHERE company_code = ?',
			args: [company_code]
		});

		if (companyResult.rows.length === 0) {
			return fail(401, { error: '企業コードが正しくありません' });
		}

		const companyId = companyResult.rows[0].id as number;

		// 担当者IDとパスワードで認証（企業IDも照合）
		const adminResult = await db.execute({
			sql: 'SELECT id, login_id, password_hash, company_id, name FROM company_admins WHERE login_id = ? AND company_id = ?',
			args: [login_id, companyId]
		});

		if (adminResult.rows.length === 0) {
			return fail(401, { error: '担当者IDまたはパスワードが正しくありません' });
		}

		const admin = adminResult.rows[0];

		// パスワード検証
		const bcrypt = await import('bcryptjs');
		const isPasswordValid = await bcrypt.compare(password, admin.password_hash as string);

		if (!isPasswordValid) {
			return fail(401, { error: '担当者IDまたはパスワードが正しくありません' });
		}

		// セッションを設定
		cookies.set('company_session', JSON.stringify({
			userId: admin.id,
			role: 'company_admin',
			company_id: companyId
		}), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 1週間
		});

		throw redirect(303, '/company/dashboard');
	}
} satisfies Actions;
