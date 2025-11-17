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

	// コンテンツ一覧を取得（生徒と同じ）
	const contentsResult = await db.execute({
		sql: 'SELECT * FROM contents ORDER BY "order" ASC'
	});

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
