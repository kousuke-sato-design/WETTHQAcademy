import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const user = locals.user;

	if (!user) {
		return { contents: [] };
	}

	// コンテンツ一覧を取得
	const result = await db.execute({
		sql: 'SELECT id, title, description, content_type, category FROM contents ORDER BY "order" ASC LIMIT 6',
		args: []
	});

	const contents = result.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		description: row.description as string | null,
		content_type: row.content_type as string,
		category: row.category as string | null
	}));

	return {
		user,
		contents
	};
};
