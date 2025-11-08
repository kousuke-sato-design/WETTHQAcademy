import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { turso } from '$lib/db/turso';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	// すでにログインしている場合はダッシュボードへリダイレクト
	if (locals.user?.role === 'user') {
		throw redirect(303, '/user/dashboard');
	}

	return {};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const company_code = data.get('company_code')?.toString();
		const login_id = data.get('login_id')?.toString();
		const password = data.get('password')?.toString();

		// バリデーション
		if (!company_code) {
			return fail(400, { error: '企業IDを入力してください' });
		}

		if (!login_id) {
			return fail(400, { error: 'ユーザーIDを入力してください' });
		}

		if (!password) {
			return fail(400, { error: 'パスワードを入力してください' });
		}

		try {
			// 企業コードから企業IDを取得
			const companyResult = await turso.execute({
				sql: 'SELECT id FROM companies WHERE company_code = ?',
				args: [company_code]
			});

			if (companyResult.rows.length === 0) {
				return fail(400, { error: '企業IDが正しくありません' });
			}

			const company_id = companyResult.rows[0].id as number;

			// ユーザーを検索（企業ID、ログインID、ロールで検索）
			const result = await turso.execute({
				sql: `
					SELECT id, login_id, password_hash, role, company_id, name
					FROM users
					WHERE company_id = ? AND login_id = ? AND role = 'user'
				`,
				args: [company_id, login_id]
			});

			if (result.rows.length === 0) {
				return fail(400, { error: 'ユーザーIDまたはパスワードが正しくありません' });
			}

			const user = result.rows[0];
			const passwordHash = user.password_hash as string;

			// パスワードを検証
			const validPassword = await bcrypt.compare(password, passwordHash);

			if (!validPassword) {
				return fail(400, { error: 'ユーザーIDまたはパスワードが正しくありません' });
			}

			// セッションを作成
			const sessionId = crypto.randomUUID();
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 7); // 7日間有効

			await turso.execute({
				sql: 'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
				args: [sessionId, user.id as number, expiresAt.toISOString()]
			});

			// クッキーにセッションIDを保存
			cookies.set('session', sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				expires: expiresAt,
				secure: process.env.NODE_ENV === 'production'
			});

			// ダッシュボードへリダイレクト
			throw redirect(303, '/user/dashboard');
		} catch (error: any) {
			if (error?.status === 303) {
				throw error;
			}
			console.error('Login error:', error);
			return fail(500, { error: 'ログインに失敗しました' });
		}
	}
} satisfies Actions;
