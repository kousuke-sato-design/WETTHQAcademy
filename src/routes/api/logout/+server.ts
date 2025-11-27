import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	// 全てのセッションCookieを削除
	cookies.delete('admin_session', { path: '/' });
	cookies.delete('company_session', { path: '/' });
	cookies.delete('user_session', { path: '/' });
	cookies.delete('session', { path: '/' }); // 互換性のため
	return json({ success: true });
};
