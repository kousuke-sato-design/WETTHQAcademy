import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const companyId = parseInt(params.companyId);

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

	return {
		user: locals.user,
		company
	};
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const companyId = parseInt(params.companyId);

		const data = await request.formData();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const category = data.get('category')?.toString();
		const order = data.get('order')?.toString();
		const showInSidebar = data.get('showInSidebar') === 'on' ? 1 : 0;
		const sidebarIcon = data.get('sidebarIcon')?.toString() || 'document';
		const sidebarOrder = data.get('sidebarOrder')?.toString();
		const sectionsJson = data.get('sections')?.toString();

		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		try {
			// 企業専用コンテンツとして作成
			const contentResult = await db.execute({
				sql: `INSERT INTO contents (title, description, content_type, content_url, category, "order", show_in_sidebar, sidebar_icon, sidebar_order, sections, is_company_specific, target_company_id)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?) RETURNING id`,
				args: [
					title,
					description || null,
					'text',
					'',
					category || null,
					order ? parseInt(order) : 0,
					showInSidebar,
					sidebarIcon,
					sidebarOrder ? parseInt(sidebarOrder) : 0,
					sectionsJson || null,
					companyId
				]
			});

			const contentId = contentResult.rows[0].id as number;

			return { success: true, message: '保存しました', contentId };
		} catch (err: any) {
			console.error('Content creation error:', err);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
