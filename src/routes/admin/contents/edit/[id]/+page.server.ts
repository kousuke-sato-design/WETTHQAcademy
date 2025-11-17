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

	// コンテンツ情報を取得（sectionsカラムも含む）
	const contentResult = await db.execute({
		sql: 'SELECT id, title, description, category, "order", sections FROM contents WHERE id = ?',
		args: [contentId]
	});
	console.log('Content query result:', contentResult.rows.length, 'rows');

	if (contentResult.rows.length === 0) {
		throw error(404, 'コンテンツが見つかりません');
	}

	const content = contentResult.rows[0];
	console.log('Content:', content);

	// セクション情報をJSONから取得
	let sections = [];
	try {
		const sectionsJson = content.sections as string | null;
		sections = sectionsJson ? JSON.parse(sectionsJson) : [];
		console.log('Parsed sections from JSON:', JSON.stringify(sections, null, 2));
	} catch (e) {
		console.error('Failed to parse sections JSON:', e);
		sections = [];
	}

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

		console.log('=== FORM DATA RECEIVED ===');
		console.log('Title:', title);
		console.log('Sections JSON raw:', sectionsJson);
		console.log('Sections JSON length:', sectionsJson?.length);

		// バリデーション
		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		try {
			console.log('=== SERVER SAVE START ===');
			console.log('Content ID:', contentId);
			console.log('Title:', title);
			console.log('Sections JSON received:', sectionsJson);

			// セクションJSONのバリデーション
			let sections = [];
			if (sectionsJson) {
				try {
					sections = JSON.parse(sectionsJson);
					console.log('Parsed sections:', sections);
					console.log('Number of sections:', sections.length);
				} catch (parseError: any) {
					console.error('JSON parse error:', parseError);
					return fail(400, { error: `セクションデータのパースエラー: ${parseError.message}` });
				}
			}

			// コンテンツとセクションを1つのUPDATE文で保存
			console.log('Updating content with sections...');
			const updateResult = await db.execute({
				sql: 'UPDATE contents SET title = ?, description = ?, category = ?, "order" = ?, sections = ? WHERE id = ?',
				args: [
					title,
					description || null,
					category || null,
					order ? parseInt(order) : 0,
					sectionsJson || null,
					contentId
				]
			});

			console.log('Update result:', {
				success: updateResult.success,
				changes: updateResult.meta?.changes
			});

			// 保存確認
			console.log('Verifying saved data...');
			const verifyResult = await db.execute({
				sql: 'SELECT id, title, sections FROM contents WHERE id = ?',
				args: [contentId]
			});

			if (verifyResult.rows.length > 0) {
				const savedContent = verifyResult.rows[0];
				const savedSections = savedContent.sections ? JSON.parse(savedContent.sections as string) : [];
				console.log('Verification - saved sections count:', savedSections.length);
				console.log('=== SERVER SAVE END - SUCCESS ===');
			}

			return { success: true, message: `保存しました（セクション${sections.length}個）` };
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
