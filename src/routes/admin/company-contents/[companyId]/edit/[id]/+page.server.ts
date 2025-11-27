import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const companyId = parseInt(params.companyId);
	const contentId = parseInt(params.id);

	console.log('=== COMPANY CONTENT LOAD ===');
	console.log('Company ID:', companyId);
	console.log('Content ID:', contentId);

	// 企業情報を取得
	const companyResult = await db.execute({
		sql: 'SELECT id, company_name, company_code FROM companies WHERE id = ?',
		args: [companyId]
	});

	if (companyResult.rows.length === 0) {
		throw error(404, '企業が見つかりません');
	}

	const company = {
		id: companyResult.rows[0].id as number,
		company_name: companyResult.rows[0].company_name as string,
		company_code: companyResult.rows[0].company_code as string
	};

	// コンテンツ情報を取得
	const contentResult = await db.execute({
		sql: 'SELECT id, title, description, category, "order", sections FROM contents WHERE id = ?',
		args: [contentId]
	});

	console.log('Content query result:', contentResult.rows.length, 'rows');

	if (contentResult.rows.length === 0) {
		throw error(404, 'コンテンツが見つかりません');
	}

	const content = contentResult.rows[0];

	// セクション情報をJSONから取得
	let sections = [];
	try {
		const sectionsJson = content.sections as string | null;
		sections = sectionsJson ? JSON.parse(sectionsJson) : [];
		console.log('Loaded sections:', sections.length, 'sections');
	} catch (e) {
		console.error('Failed to parse sections JSON:', e);
		sections = [];
	}

	return {
		user: locals.user,
		company,
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
	default: async ({ request, params, locals }) => {
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
		const sectionsJson = data.get('sections')?.toString();

		console.log('=== COMPANY CONTENT FORM DATA ===');
		console.log('Content ID:', contentId);
		console.log('Title:', title);
		console.log('Sections JSON length:', sectionsJson?.length);
		console.log('Sections JSON:', sectionsJson);

		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		try {
			// セクションJSONのバリデーション
			let sections = [];
			if (sectionsJson) {
				try {
					sections = JSON.parse(sectionsJson);
					console.log('Parsed sections count:', sections.length);
				} catch (parseError: any) {
					console.error('JSON parse error:', parseError);
					return fail(400, { error: `セクションデータのパースエラー: ${parseError.message}` });
				}
			}

			// コンテンツを更新
			console.log('Executing UPDATE...');
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
			const verifyResult = await db.execute({
				sql: 'SELECT id, title, sections FROM contents WHERE id = ?',
				args: [contentId]
			});

			if (verifyResult.rows.length > 0) {
				const savedSections = verifyResult.rows[0].sections ? JSON.parse(verifyResult.rows[0].sections as string) : [];
				console.log('Verification - saved sections count:', savedSections.length);
			}

			return { success: true, message: `保存しました（セクション${sections.length}個）` };
		} catch (err: any) {
			console.error('Content update error:', err);
			return fail(500, { error: `データベースエラーが発生しました: ${err.message}` });
		}
	}
} satisfies Actions;
