import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getDb } from '$lib/db';
import { verifyCredentials } from '$lib/auth/auth';

export const actions = {
	login: async ({ request, cookies, locals }) => {
		const data = await request.formData();
		const login_id = data.get('login_id')?.toString();
		const password = data.get('password')?.toString();

		if (!login_id || !password) {
			return fail(400, { error: 'ログインIDとパスワードを入力してください' });
		}

		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const user = await verifyCredentials(db, login_id, password, 'master');

		if (!user) {
			return fail(401, { error: 'ログインIDまたはパスワードが正しくありません' });
		}

		// セッションを設定
		cookies.set('session', JSON.stringify({ userId: user.id, role: user.role }), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 1週間
		});

		throw redirect(303, '/admin/dashboard');
	}
} satisfies Actions;
