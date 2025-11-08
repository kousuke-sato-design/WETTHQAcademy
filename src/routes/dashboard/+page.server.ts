import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/user');
	}

	// ユーザーのロールに応じて適切なダッシュボードにリダイレクト
	if (locals.user.role === 'master') {
		throw redirect(303, '/admin/dashboard');
	} else if (locals.user.role === 'company_admin') {
		throw redirect(303, '/company/dashboard');
	} else {
		throw redirect(303, '/user/dashboard');
	}
};
