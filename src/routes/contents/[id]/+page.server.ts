import type { PageServerLoad } from './$types';
import { turso } from '$lib/db/turso';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = locals.user;

	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const contentId = parseInt(params.id);

	if (isNaN(contentId)) {
		throw error(400, 'Invalid content ID');
	}

	// コンテンツを取得
	const result = await turso.execute({
		sql: 'SELECT * FROM contents WHERE id = ?',
		args: [contentId]
	});

	if (result.rows.length === 0) {
		throw error(404, 'Content not found');
	}

	const row = result.rows[0];
	const content = {
		id: row.id as number,
		title: row.title as string,
		description: row.description as string | null,
		content_type: row.content_type as string,
		content_url: row.content_url as string,
		category: row.category as string | null
	};

	// 関連コンテンツを取得
	const relatedResult = await turso.execute({
		sql: 'SELECT id, title, content_type, category FROM contents WHERE category = ? AND id != ? LIMIT 3',
		args: [content.category, contentId]
	});

	const relatedContents = relatedResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		content_type: row.content_type as string,
		category: row.category as string | null
	}));

	return {
		user,
		content,
		relatedContents
	};
};
