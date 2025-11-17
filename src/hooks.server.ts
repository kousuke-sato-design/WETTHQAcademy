import { deserializeUser } from '$lib/auth/auth';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getD1Client } from '$lib/db/d1';

export const handle: Handle = async ({ event, resolve }) => {
	// Cloudflare D1バインディングを取得
	if (event.platform?.env?.DB) {
		event.locals.db = getD1Client(event.platform.env.DB);
	}

	const session = event.cookies.get('session');

	if (session) {
		const user = deserializeUser(session);
		if (user) {
			event.locals.user = user;
		}
	}

	// 認証が必要なルートの保護
	const protectedRoutes = ['/user/dashboard', '/company/dashboard', '/admin/dashboard', '/contents'];
	const isProtectedRoute = protectedRoutes.some((route) => event.url.pathname.startsWith(route));

	if (isProtectedRoute && !event.locals.user) {
		// ロールに応じてリダイレクト先を決定
		if (event.url.pathname.startsWith('/admin/')) {
			throw redirect(303, '/admin');
		} else if (event.url.pathname.startsWith('/company/')) {
			throw redirect(303, '/company');
		} else {
			throw redirect(303, '/user');
		}
	}

	// ロール別ルートの保護
	if (event.url.pathname.startsWith('/admin/dashboard') && event.locals.user?.role !== 'master') {
		throw redirect(303, '/company/dashboard');
	}

	if (event.url.pathname.startsWith('/company/dashboard') && event.locals.user?.role === 'user') {
		throw redirect(303, '/user/dashboard');
	}

	return resolve(event);
};
