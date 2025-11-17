import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const user = locals.user;

	if (!user || !user.company_id) {
		return {
			user: locals.user,
			contents: []
		};
	}

	// この企業が閲覧許可を持っているコンテンツのみを取得
	let contentsResult;
	try {
		contentsResult = await db.execute({
			sql: `
				SELECT c.id, c.title, c.description, c.category, c.created_at, c.content_type
				FROM contents c
				INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
				WHERE ccp.company_id = ?
				ORDER BY c.created_at DESC
			`,
			args: [user.company_id]
		});
	} catch (error) {
		console.error('Error fetching contents:', error);
		return {
			user: locals.user,
			contents: []
		};
	}

	const contents = contentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		description: (row.description as string) || '',
		category: (row.category as string) || '',
		created_at: row.created_at as string,
		content_type: row.content_type as string,
		viewCount: 0 // TODO: 後で閲覧履歴テーブルを作成して実装
	}));

	return {
		user: locals.user,
		contents
	};
};
