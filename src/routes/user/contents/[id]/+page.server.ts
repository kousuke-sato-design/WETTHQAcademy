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

	// この企業が閲覧許可を持っているコンテンツ + 企業専用コンテンツを取得（サイドバー用）
	let contentsResult;
	if (companyId && !isCompanyAdmin) {
		// 生徒の場合は許可された共有コンテンツ + 企業専用コンテンツ
		contentsResult = await db.execute({
			sql: `
				SELECT c.id, c.title, c.sidebar_icon, c.sidebar_order, ccp.display_order, 0 as is_company_specific
				FROM contents c
				INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
				WHERE c.show_in_sidebar = 1
				AND ccp.company_id = ?
				AND (c.is_company_specific = 0 OR c.is_company_specific IS NULL)

				UNION ALL

				SELECT c.id, c.title, c.sidebar_icon, c.sidebar_order, c.sidebar_order as display_order, 1 as is_company_specific
				FROM contents c
				WHERE c.show_in_sidebar = 1
				AND c.is_company_specific = 1
				AND c.target_company_id = ?

				ORDER BY display_order ASC, sidebar_order ASC
			`,
			args: [companyId, companyId]
		});
	} else {
		// 統一IDユーザーまたは企業担当者の場合は許可されたコンテンツを表示
		contentsResult = await db.execute({
			sql: `
				SELECT c.id, c.title, c.sidebar_icon, c.sidebar_order, ccp.display_order, 0 as is_company_specific
				FROM contents c
				INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
				WHERE c.show_in_sidebar = 1
				AND ccp.company_id = ?
				AND (c.is_company_specific = 0 OR c.is_company_specific IS NULL)

				UNION ALL

				SELECT c.id, c.title, c.sidebar_icon, c.sidebar_order, c.sidebar_order as display_order, 1 as is_company_specific
				FROM contents c
				WHERE c.show_in_sidebar = 1
				AND c.is_company_specific = 1
				AND c.target_company_id = ?

				ORDER BY display_order ASC, sidebar_order ASC
			`,
			args: [companyId, companyId]
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
