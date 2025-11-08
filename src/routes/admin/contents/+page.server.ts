import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { turso } from '$lib/db/turso';

export const load: PageServerLoad = async ({ locals }) => {
	// コンテンツ一覧を取得
	const contentsResult = await turso.execute(`
		SELECT id, title, description, content_type, content_url, category, "order", created_at
		FROM contents
		ORDER BY "order" ASC, created_at DESC
	`);

	const contents = contentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		description: row.description as string | null,
		content_type: row.content_type as 'video' | 'text',
		content_url: row.content_url as string,
		category: row.category as string | null,
		order: row.order as number,
		created_at: row.created_at as string
	}));

	return {
		user: locals.user,
		contents
	};
};

export const actions = {
	createContent: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const content_type = data.get('content_type')?.toString();
		const content_url = data.get('content_url')?.toString();
		const category = data.get('category')?.toString();
		const order = data.get('order')?.toString();

		// バリデーション
		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		if (!content_type || (content_type !== 'video' && content_type !== 'text')) {
			return fail(400, { error: 'コンテンツ種別を選択してください' });
		}

		if (!content_url) {
			return fail(400, { error: 'コンテンツURLを入力してください' });
		}

		try {
			await turso.execute({
				sql: 'INSERT INTO contents (title, description, content_type, content_url, category, "order") VALUES (?, ?, ?, ?, ?, ?)',
				args: [
					title,
					description || null,
					content_type,
					content_url,
					category || null,
					order ? parseInt(order) : 0
				]
			});

			return { success: true, message: 'コンテンツを登録しました' };
		} catch (error) {
			console.error('Content creation error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	deleteContent: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'コンテンツIDが指定されていません' });
		}

		try {
			await turso.execute({
				sql: 'DELETE FROM contents WHERE id = ?',
				args: [parseInt(id)]
			});

			return { success: true, message: 'コンテンツを削除しました' };
		} catch (error) {
			console.error('Content delete error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
