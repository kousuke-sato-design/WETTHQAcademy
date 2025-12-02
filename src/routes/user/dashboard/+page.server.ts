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
		// 1. 共有コンテンツ（権限あり） + 2. 企業専用コンテンツ（権限あり）
		// 両方とも company_content_permissions の display_order を使用
		contentsResult = await db.execute({
			sql: `
				SELECT c.id, c.title, c.sidebar_icon, c.sidebar_order, ccp.display_order,
				       CASE WHEN c.is_company_specific = 1 THEN 1 ELSE 0 END as is_company_specific
				FROM contents c
				INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
				WHERE c.show_in_sidebar = 1
				AND ccp.company_id = ?
				ORDER BY ccp.display_order ASC, c.sidebar_order ASC
			`,
			args: [companyId]
		});
	} else {
		// 統一IDユーザーの場合は共有コンテンツのみ表示
		contentsResult = await db.execute({
			sql: `
				SELECT id, title, sidebar_icon, sidebar_order
				FROM contents
				WHERE show_in_sidebar = 1
				AND (is_company_specific = 0 OR is_company_specific IS NULL)
				ORDER BY sidebar_order ASC, created_at ASC
			`
		});
	}

	const contents = contentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		sidebar_icon: (row.sidebar_icon as string) || 'document',
		sidebar_order: typeof row.sidebar_order === 'number' ? row.sidebar_order : 0,
		is_company_specific: (row.is_company_specific as number) === 1
	}));

	return {
		user: locals.user,
		contents
	};
};
