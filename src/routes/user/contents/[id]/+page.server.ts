import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { turso } from '$lib/db/turso';

export const load: PageServerLoad = async ({ locals, params }) => {
	const contentId = params.id;
	const user = locals.user;
	const companyId = user?.company_id;

	// この企業が閲覧許可を持っているコンテンツのみを取得（サイドバー用）
	let contentsResult;
	if (companyId) {
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

	// コンテンツ詳細を取得（閲覧許可チェック付き）
	let contentResult;
	if (companyId) {
		contentResult = await turso.execute({
			sql: `
				SELECT c.id, c.title, c.description, c.category
				FROM contents c
				INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
				WHERE c.id = ? AND ccp.company_id = ?
			`,
			args: [parseInt(contentId), companyId]
		});
	} else {
		// 統一IDユーザーの場合は全てのコンテンツにアクセス可能
		contentResult = await turso.execute({
			sql: `
				SELECT id, title, description, category
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

	// セクションを取得
	const sectionsResult = await turso.execute({
		sql: `
			SELECT id, section_type, title, items, "order"
			FROM content_sections
			WHERE content_id = ?
			ORDER BY "order" ASC
		`,
		args: [parseInt(contentId)]
	});

	const sections = sectionsResult.rows.map((row) => ({
		id: row.id as number,
		sectionType: row.section_type as string,
		title: row.title as string | null,
		items: JSON.parse(row.items as string),
		order: row.order as number
	}));

	return {
		user: locals.user,
		contents,
		content,
		sections
	};
};
