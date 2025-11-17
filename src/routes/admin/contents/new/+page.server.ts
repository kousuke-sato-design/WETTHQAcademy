import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	return {
		user,
		contents: []
	};
};

export const actions = {
	default: async ({ request, locals}) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const category = data.get('category')?.toString();
		const order = data.get('order')?.toString();
		const showInSidebar = data.get('showInSidebar') === 'on' ? 1 : 0;
		const sidebarIcon = data.get('sidebarIcon')?.toString() || 'document';
		const sidebarOrder = data.get('sidebarOrder')?.toString();

		// セクションデータ（JSON形式）
		const sectionsJson = data.get('sections')?.toString();

		// バリデーション
		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		try {
			// コンテンツを作成（sectionsカラムにJSON保存）
			const contentResult = await db.execute({
				sql: 'INSERT INTO contents (title, description, content_type, content_url, category, "order", show_in_sidebar, sidebar_icon, sidebar_order, sections) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
				args: [
					title,
					description || null,
					'text', // セクション形式のコンテンツは常に'text'
					'', // content_urlは空にする
					category || null,
					order ? parseInt(order) : 0,
					showInSidebar,
					sidebarIcon,
					sidebarOrder ? parseInt(sidebarOrder) : 0,
					sectionsJson || null
				]
			});

			const contentId = contentResult.rows[0].id as number;

			return { success: true, message: '保存しました', contentId };
		} catch (error: any) {
			console.error('Content creation error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
