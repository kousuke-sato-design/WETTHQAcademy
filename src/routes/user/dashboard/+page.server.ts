import type { PageServerLoad } from './$types';
import { turso } from '$lib/db/turso';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	// 生徒の企業IDを取得
	const companyId = user?.company_id;

	let contentsResult;

	if (companyId) {
		// この企業が閲覧許可を持っているコンテンツのみを取得
		contentsResult = await turso.execute({
			sql: `
				SELECT c.id, c.title, c.sidebar_icon, c.sidebar_order
				FROM contents c
				INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
				WHERE c.show_in_sidebar = 1
				AND ccp.company_id = ?
				ORDER BY c.sidebar_order ASC, c.created_at ASC
			`,
			args: [companyId]
		});
	} else {
		// 統一IDユーザーの場合は全てのコンテンツを表示
		contentsResult = await turso.execute({
			sql: `
				SELECT id, title, sidebar_icon, sidebar_order
				FROM contents
				WHERE show_in_sidebar = 1
				ORDER BY sidebar_order ASC, created_at ASC
			`
		});
	}

	const contents = contentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		sidebar_icon: row.sidebar_icon as string,
		sidebar_order: row.sidebar_order as number
	}));

	return {
		user: locals.user,
		contents
	};
};
