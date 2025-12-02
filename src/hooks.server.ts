import { deserializeUser } from '$lib/auth/auth';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getD1Client } from '$lib/db/d1';

export const handle: Handle = async ({ event, resolve }) => {
	// Cloudflare D1バインディングを取得
	if (event.platform?.env?.DB) {
		event.locals.db = getD1Client(event.platform.env.DB);
	}

	// URLパスに基づいて適切なセッションクッキーを取得
	const path = event.url.pathname;
	let session: string | undefined;

	if (path.startsWith('/admin')) {
		session = event.cookies.get('admin_session');
	} else if (path.startsWith('/company')) {
		session = event.cookies.get('company_session');
	} else if (path.startsWith('/user')) {
		session = event.cookies.get('user_session');
	}

	if (session) {
		const user = deserializeUser(session);
		if (user) {
			event.locals.user = user;
		}
	}

	// 認証が必要なルートの保護
	// /admin/*, /company/*, /user/* 配下のすべてのページを保護（ログインページを除く）
	const isAdminRoute = path.startsWith('/admin/') && path !== '/admin/login';
	const isCompanyRoute = path.startsWith('/company/') && path !== '/company/login';
	const isUserRoute = path.startsWith('/user/') && path !== '/user/login';
	const isProtectedRoute = isAdminRoute || isCompanyRoute || isUserRoute;

	if (isProtectedRoute && !event.locals.user) {
		// ロールに応じてリダイレクト先を決定
		if (path.startsWith('/admin/')) {
			throw redirect(303, '/admin/login');
		} else if (path.startsWith('/company/')) {
			throw redirect(303, '/company/login');
		} else {
			throw redirect(303, '/user/login');
		}
	}

	// ロール別ルートの保護
	// /admin/* へのアクセスはmasterロールが必要
	if (isAdminRoute && event.locals.user && event.locals.user.role !== 'master') {
		throw redirect(303, '/admin/login');
	}

	// /company/* へのアクセスはcompany_adminまたはmasterロールが必要
	if (isCompanyRoute && event.locals.user && event.locals.user.role === 'user') {
		throw redirect(303, '/user/dashboard');
	}

	return resolve(event);
};
