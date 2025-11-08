import type { PageServerLoad } from './$types';
import { turso } from '$lib/db/turso';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	const category = url.searchParams.get('category');

	if (!user) {
		return { contents: [], categories: [] };
	}

	// カテゴリ一覧を取得
	const categoriesResult = await turso.execute({
		sql: 'SELECT DISTINCT category FROM contents WHERE category IS NOT NULL',
		args: []
	});

	const categories = categoriesResult.rows.map((row) => row.category as string);

	// コンテンツ一覧を取得
	let sql = 'SELECT * FROM contents ORDER BY "order" ASC';
	let args: any[] = [];

	if (category) {
		sql = 'SELECT * FROM contents WHERE category = ? ORDER BY "order" ASC';
		args = [category];
	}

	const result = await turso.execute({ sql, args });

	const contents = result.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		description: row.description as string | null,
		content_type: row.content_type as string,
		content_url: row.content_url as string,
		category: row.category as string | null
	}));

	return {
		user,
		contents,
		categories,
		selectedCategory: category
	};
};
