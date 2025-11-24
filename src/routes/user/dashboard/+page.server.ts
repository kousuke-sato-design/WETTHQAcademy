import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const user = locals.user;

	// 生徒の企業IDを取得
	const companyId = user?.company_id;

	let contentsResult;

	if (companyId) {
		// この企業が閲覧許可を持っているコンテンツのみを取得
		// 企業ごとの表示順序（display_order）を優先
		contentsResult = await db.execute({
			sql: `
				SELECT c.id, c.title, c.sidebar_icon, c.sidebar_order, ccp.display_order
				FROM contents c
				INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
				WHERE c.show_in_sidebar = 1
				AND ccp.company_id = ?
				ORDER BY ccp.display_order ASC, c.sidebar_order ASC, c.created_at ASC
			`,
			args: [companyId]
		});
	} else {
		// 統一IDユーザーの場合は全てのコンテンツを表示
		contentsResult = await db.execute({
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
		sidebar_icon: (row.sidebar_icon as string) || 'document',
		sidebar_order: typeof row.sidebar_order === 'number' ? row.sidebar_order : 0
	}));

	return {
		user: locals.user,
		contents
	};
};
