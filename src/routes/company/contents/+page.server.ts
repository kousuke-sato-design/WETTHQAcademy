import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const user = locals.user;
	const companyId = user?.company_id;

	if (!companyId) {
		return {
			user: locals.user,
			contents: [],
			allContents: []
		};
	}

	// この企業が閲覧許可を持っているコンテンツを取得
	const permittedContentsResult = await db.execute({
		sql: `
			SELECT c.id, c.title, c.description, c.category, c.created_at
			FROM contents c
			INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
			WHERE ccp.company_id = ?
			ORDER BY c."order" ASC, c.created_at DESC
		`,
		args: [companyId]
	});

	const permittedContents = permittedContentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		description: (row.description as string) || '',
		category: (row.category as string) || '',
		created_at: row.created_at as string,
		hasPermission: true
	}));

	// 全コンテンツを取得（権限の有無を表示するため）
	const allContentsResult = await db.execute({
		sql: 'SELECT id, title, description, category, created_at FROM contents ORDER BY "order" ASC, created_at DESC'
	});

	const permittedIds = new Set(permittedContents.map((c) => c.id));

	const allContents = allContentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		description: (row.description as string) || '',
		category: (row.category as string) || '',
		created_at: row.created_at as string,
		hasPermission: permittedIds.has(row.id as number)
	}));

	return {
		user: locals.user,
		contents: permittedContents,
		allContents
	};
};
