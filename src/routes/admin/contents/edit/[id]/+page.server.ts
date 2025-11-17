import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const contentId = parseInt(params.id);
	console.log('=== SERVER LOAD START ===');
	console.log('Loading content ID:', contentId);

	// コンテンツ情報を取得（基本情報のみ）
	const contentResult = await db.execute({
		sql: 'SELECT id, title, description, category, "order" FROM contents WHERE id = ?',
		args: [contentId]
	});
	console.log('Content query result:', contentResult.rows.length, 'rows');

	if (contentResult.rows.length === 0) {
		throw error(404, 'コンテンツが見つかりません');
	}

	const content = contentResult.rows[0];
	console.log('Content:', content);

	// セクション情報を取得
	const sectionsResult = await db.execute({
		sql: 'SELECT id, content_id, section_type, title, items, "order" FROM content_sections WHERE content_id = ? ORDER BY "order" ASC',
		args: [contentId]
	});
	console.log('Sections query result:', sectionsResult.rows.length, 'rows');
	console.log('Raw sections data:', JSON.stringify(sectionsResult.rows, null, 2));

	const sections = sectionsResult.rows.map((row) => {
		let items = [];
		try {
			items = row.items && typeof row.items === 'string' ? JSON.parse(row.items) : [];
		} catch (e) {
			console.error('Failed to parse items for section:', row.id, e);
			items = [];
		}
		return {
			id: row.id as number,
			content_id: row.content_id as number,
			section_type: row.section_type as string,
			title: row.title as string | null,
			items,
			order: row.order as number
		};
	});

	console.log('Mapped sections:', JSON.stringify(sections, null, 2));
	console.log('=== SERVER LOAD END ===');

	return {
		user: locals.user,
		contents: [],
		content: {
			id: content.id as number,
			title: (content.title as string) || '',
			description: (content.description as string) || null,
			category: (content.category as string) || null,
			order: typeof content.order === 'number' ? content.order : 0
		},
		sections
	};
};

export const actions = {
	default: async ({ request, params, locals}) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

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
			console.log('=== SERVER SAVE START ===');
			console.log('Content ID:', contentId);
			console.log('Title:', title);
			console.log('Sections JSON:', sectionsJson);

			// コンテンツを更新
			const updateResult = await db.execute({
				sql: 'UPDATE contents SET title = ?, description = ?, category = ?, "order" = ? WHERE id = ?',
				args: [
					title,
					description || null,
					category || null,
					order ? parseInt(order) : 0,
					contentId
				]
			});
			console.log('Update result:', JSON.stringify(updateResult));

			// 既存のセクションを削除
			const deleteResult = await db.execute({
				sql: 'DELETE FROM content_sections WHERE content_id = ?',
				args: [contentId]
			});
			console.log('Delete result:', JSON.stringify(deleteResult));

			// 新しいセクションを保存
			if (sectionsJson) {
				const sections = JSON.parse(sectionsJson);
				console.log('Parsed sections:', JSON.stringify(sections, null, 2));
				console.log('Number of sections to save:', sections.length);

				for (let i = 0; i < sections.length; i++) {
					const section = sections[i];
					console.log(`\n--- Saving section ${i + 1}/${sections.length} ---`);
					console.log('Section data:', JSON.stringify({
						contentId,
						sectionType: section.sectionType,
						title: section.title,
						items: section.items,
						order: section.order
					}));

					try {
						const insertResult = await db.execute({
							sql: 'INSERT INTO content_sections (content_id, section_type, title, items, "order") VALUES (?, ?, ?, ?, ?)',
							args: [
								contentId,
								section.sectionType,
								section.title || null,
								JSON.stringify(section.items || []),
								section.order
							]
						});
						console.log(`Section ${i + 1} insert result:`, JSON.stringify(insertResult));
					} catch (insertError: any) {
						console.error(`Failed to insert section ${i + 1}:`, insertError);
						throw insertError;
					}
				}
			} else {
				console.log('No sections JSON provided');
			}

			// 保存後の確認
			const verifyResult = await db.execute({
				sql: 'SELECT COUNT(*) as count FROM content_sections WHERE content_id = ?',
				args: [contentId]
			});
			console.log('Verification - sections count:', verifyResult.rows[0]);
			console.log('=== SERVER SAVE END ===');

			return { success: true, message: '保存しました' };
		} catch (error: any) {
			console.error('=== SERVER SAVE ERROR ===');
			console.error('Error:', error);
			console.error('Error details:', {
				message: error.message,
				stack: error.stack,
				cause: error.cause
			});
			return fail(500, { error: `データベースエラーが発生しました: ${error.message}` });
		}
	}
} satisfies Actions;
