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

	// この企業が閲覧許可を持っているコンテンツのみを取得（サイドバー用）
	let contentsResult;
	if (companyId) {
		contentsResult = await db.execute({
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

	// コンテンツ詳細を取得（閲覧許可チェック付き）
	let contentResult;
	if (companyId) {
		contentResult = await db.execute({
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
		contentResult = await db.execute({
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
	const sectionsResult = await db.execute({
		sql: `
			SELECT id, section_type, title, items, "order"
			FROM content_sections
			WHERE content_id = ?
			ORDER BY "order" ASC
		`,
		args: [parseInt(contentId)]
	});

	const sections = sectionsResult.rows.map((row) => {
		let items = [];
		try {
			items = row.items && typeof row.items === 'string' ? JSON.parse(row.items) : [];
		} catch (e) {
			console.error('Failed to parse section items:', e);
			items = [];
		}
		return {
			id: row.id as number,
			sectionType: row.section_type as string,
			title: row.title as string | null,
			items,
			order: row.order as number
		};
	});

	return {
		user: locals.user,
		contents,
		content,
		sections
	};
};
