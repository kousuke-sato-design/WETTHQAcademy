import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { turso } from '$lib/db/turso';
import { verifyCredentials } from '$lib/auth/auth';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const login_id = data.get('login_id')?.toString();
		const password = data.get('password')?.toString();

		if (!login_id || !password) {
			return fail(400, { error: 'ログインIDとパスワードを入力してください' });
		}

		const user = await verifyCredentials(turso, login_id, password, 'company_admin');

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

		throw redirect(303, '/company/dashboard');
	}
} satisfies Actions;
