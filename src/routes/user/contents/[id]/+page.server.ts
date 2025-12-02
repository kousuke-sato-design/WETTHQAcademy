import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const contentId = params.id;
	const user = locals.user;
	const companyId = user?.company_id;
	const isCompanyAdmin = user?.role === 'company_admin';

	// この企業が閲覧許可を持っているコンテンツを取得（サイドバー用）
	// 共有コンテンツも企業専用コンテンツも company_content_permissions の display_order を使用
	let contentsResult;
	if (companyId) {
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
				SELECT id, title, sidebar_icon, sidebar_order, 0 as display_order, 0 as is_company_specific
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

	// コンテンツ詳細を取得（閲覧許可チェック付き）
	// 共有コンテンツの権限チェック + 企業専用コンテンツのチェック
	let contentResult;
	if (companyId) {
		// 共有コンテンツ（権限あり）または企業専用コンテンツ
		contentResult = await db.execute({
			sql: `
				SELECT c.id, c.title, c.description, c.category, c.sections
				FROM contents c
				LEFT JOIN company_content_permissions ccp ON c.id = ccp.content_id AND ccp.company_id = ?
				WHERE c.id = ?
				AND (
					(ccp.id IS NOT NULL AND (c.is_company_specific = 0 OR c.is_company_specific IS NULL))
					OR (c.is_company_specific = 1 AND c.target_company_id = ?)
				)
			`,
			args: [companyId, parseInt(contentId), companyId]
		});
	} else {
		// 統一IDユーザーの場合は共有コンテンツのみ
		contentResult = await db.execute({
			sql: `
				SELECT id, title, description, category, sections
				FROM contents
				WHERE id = ?
				AND (is_company_specific = 0 OR is_company_specific IS NULL)
			`,
			args: [parseInt(contentId)]
		});
	}

	if (contentResult.rows.length === 0) {
		throw error(404, 'コンテンツが見つかりません、または閲覧権限がありません');
	}

	const content = {
		id: contentResult.rows[0].id as number,
		title: contentResult.rows[0].title as string,
		description: contentResult.rows[0].description as string | null,
		category: contentResult.rows[0].category as string | null
	};

	// セクションをJSONから取得
	let sections = [];
	try {
		const sectionsJson = contentResult.rows[0].sections as string | null;
		sections = sectionsJson ? JSON.parse(sectionsJson) : [];
	} catch (e) {
		console.error('Failed to parse sections JSON:', e);
		sections = [];
	}

	return {
		user: locals.user,
		contents,
		content,
		sections
	};
};
