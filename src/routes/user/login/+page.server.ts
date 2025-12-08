import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	// すでにログインしている場合はダッシュボードへリダイレクト
	if (locals.user?.role === 'user') {
		throw redirect(303, '/user/dashboard');
	}

	return {};
};

export const actions = {
	default: async ({ request, cookies, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

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
			const companyResult = await db.execute({
				sql: 'SELECT id FROM companies WHERE company_code = ?',
				args: [company_code]
			});

			if (companyResult.rows.length === 0) {
				return fail(400, { error: '企業IDが正しくありません' });
			}

			const company_id = companyResult.rows[0].id as number;

			// ユーザーを検索（企業ID、ログインIDで検索 - 統一ID/個別IDを問わず）
			const result = await db.execute({
				sql: `
					SELECT id, login_id, password_hash, company_id, name, use_unified_id
					FROM students
					WHERE company_id = ? AND login_id = ?
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
			cookies.set('user_session', JSON.stringify({
				userId: user.id,
				role: 'user',
				company_id: company_id
			}), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
				maxAge: 60 * 60 * 24 * 7 // 1週間
			});

			// ダッシュボードへリダイレクト
			throw redirect(303, '/user/dashboard');
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
				throw error;
			}
			console.error('Login error:', error);
			return fail(500, { error: 'ログインに失敗しました' });
		}
	}
} satisfies Actions;
