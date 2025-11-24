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

	// この企業が閲覧許可を持っているコンテンツのみを取得（サイドバー用）
	let contentsResult;
	if (companyId && !isCompanyAdmin) {
		// 生徒の場合は許可されたコンテンツのみ
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
		// 統一IDユーザーまたは企業担当者の場合は全てのコンテンツを表示
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

	// コンテンツ詳細を取得（閲覧許可チェック付き、sectionsカラムも含む）
	let contentResult;
	if (companyId && !isCompanyAdmin) {
		// 生徒の場合は許可されたコンテンツのみ
		contentResult = await db.execute({
			sql: `
				SELECT c.id, c.title, c.description, c.category, c.sections
				FROM contents c
				INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
				WHERE c.id = ? AND ccp.company_id = ?
			`,
			args: [parseInt(contentId), companyId]
		});
	} else {
		// 統一IDユーザーまたは企業担当者の場合は全てのコンテンツにアクセス可能
		contentResult = await db.execute({
			sql: `
				SELECT id, title, description, category, sections
				FROM contents
				WHERE id = ?
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
