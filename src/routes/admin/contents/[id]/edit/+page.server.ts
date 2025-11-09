import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { turso } from '$lib/db/turso';

export const load: PageServerLoad = async ({ locals, params }) => {
	const contentId = parseInt(params.id);

	// コンテンツ情報を取得
	const contentResult = await turso.execute({
		sql: 'SELECT * FROM contents WHERE id = ?',
		args: [contentId]
	});

	if (contentResult.rows.length === 0) {
		throw error(404, 'コンテンツが見つかりません');
	}

	const content = contentResult.rows[0];

	// セクション情報を取得
	const sectionsResult = await turso.execute({
		sql: 'SELECT * FROM content_sections WHERE content_id = ? ORDER BY "order" ASC',
		args: [contentId]
	});

	const sections = sectionsResult.rows.map((row) => ({
		id: row.id as number,
		content_id: row.content_id as number,
		section_type: row.section_type as string,
		title: row.title as string | null,
		items: row.items ? JSON.parse(row.items as string) : [],
		order: row.order as number,
		created_at: row.created_at as string
	}));

	// サイドバー用のコンテンツ一覧を取得
	const contentsResult = await turso.execute({
		sql: `
			SELECT id, title, sidebar_icon, sidebar_order
			FROM contents
			WHERE show_in_sidebar = 1
			ORDER BY sidebar_order ASC, created_at ASC
		`
	});

	const contents = contentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		sidebar_icon: row.sidebar_icon as string,
		sidebar_order: row.sidebar_order as number
	}));

	return {
		user: locals.user,
		contents,
		content: {
			id: content.id as number,
			title: content.title as string,
			description: content.description as string | null,
			category: content.category as string | null,
			order: content.order as number,
			created_at: content.created_at as string
		},
		sections
	};
};

export const actions = {
	default: async ({ request, params }) => {
		const contentId = parseInt(params.id);
		const data = await request.formData();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const category = data.get('category')?.toString();
		const order = data.get('order')?.toString();

		// セクションデータ（JSON形式）
		const sectionsJson = data.get('sections')?.toString();

		// バリデーション
		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		try {
			console.log('Updating content:', { contentId, title, sectionsJson });

			// コンテンツを更新
			await turso.execute({
				sql: 'UPDATE contents SET title = ?, description = ?, category = ?, "order" = ? WHERE id = ?',
				args: [
					title,
					description || null,
					category || null,
					order ? parseInt(order) : 0,
					contentId
				]
			});

			// 既存のセクションを削除
			await turso.execute({
				sql: 'DELETE FROM content_sections WHERE content_id = ?',
				args: [contentId]
			});

			// 新しいセクションを保存
			if (sectionsJson) {
				const sections = JSON.parse(sectionsJson);
				console.log('Sections to save:', sections);

				for (const section of sections) {
					console.log('Saving section:', {
						contentId,
						sectionType: section.sectionType,
						title: section.title,
						items: section.items,
						order: section.order
					});

					await turso.execute({
						sql: 'INSERT INTO content_sections (content_id, section_type, title, items, "order") VALUES (?, ?, ?, ?, ?)',
						args: [
							contentId,
							section.sectionType,
							section.title || null,
							JSON.stringify(section.items || []),
							section.order
						]
					});
				}
			}

			return { success: true, message: '保存しました' };
		} catch (error: any) {
			console.error('Content update error:', error);
			console.error('Error details:', {
				message: error.message,
				stack: error.stack,
				cause: error.cause
			});
			return fail(500, { error: `データベースエラーが発生しました: ${error.message}` });
		}
	}
} satisfies Actions;
