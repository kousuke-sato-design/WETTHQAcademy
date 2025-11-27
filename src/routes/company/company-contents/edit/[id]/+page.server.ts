import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const user = locals.user;
	if (!user || !user.company_id) {
		throw error(403, '権限がありません');
	}

	const companyId = user.company_id;
	const contentId = parseInt(params.id);

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

	// コンテンツ情報を取得（自社専用コンテンツのみ）
	const contentResult = await db.execute({
		sql: 'SELECT id, title, description, category, "order", sections, is_company_specific, target_company_id FROM contents WHERE id = ? AND is_company_specific = 1 AND target_company_id = ?',
		args: [contentId, companyId]
	});

	if (contentResult.rows.length === 0) {
		throw error(404, 'コンテンツが見つかりません');
	}

	const content = contentResult.rows[0];

	// セクション情報をJSONから取得
	let sections = [];
	try {
		const sectionsJson = content.sections as string | null;
		sections = sectionsJson ? JSON.parse(sectionsJson) : [];
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

		const user = locals.user;
		if (!user || !user.company_id) {
			return fail(403, { error: '権限がありません' });
		}

		const companyId = user.company_id;
		const contentId = parseInt(params.id);
		const data = await request.formData();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const category = data.get('category')?.toString();
		const order = data.get('order')?.toString();
		const sectionsJson = data.get('sections')?.toString();

		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		try {
			// セクションJSONのバリデーション
			let sections = [];
			if (sectionsJson) {
				try {
					sections = JSON.parse(sectionsJson);
				} catch (parseError: any) {
					return fail(400, { error: `セクションデータのパースエラー: ${parseError.message}` });
				}
			}

			// 自社コンテンツのみ更新可能
			await db.execute({
				sql: 'UPDATE contents SET title = ?, description = ?, category = ?, "order" = ?, sections = ? WHERE id = ? AND is_company_specific = 1 AND target_company_id = ?',
				args: [
					title,
					description || null,
					category || null,
					order ? parseInt(order) : 0,
					sectionsJson || null,
					contentId,
					companyId
				]
			});

			return { success: true, message: `保存しました（セクション${sections.length}個）` };
		} catch (err: any) {
			console.error('Content update error:', err);
			return fail(500, { error: `データベースエラーが発生しました: ${err.message}` });
		}
	}
} satisfies Actions;
