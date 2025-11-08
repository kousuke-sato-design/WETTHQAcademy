import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { turso } from '$lib/db/turso';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user
	};
};

export const actions = {
	default: async ({ request }) => {
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
			// コンテンツを作成
			const contentResult = await turso.execute({
				sql: 'INSERT INTO contents (title, description, content_type, content_url, category, "order", show_in_sidebar, sidebar_icon, sidebar_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
				args: [
					title,
					description || null,
					'text', // セクション形式のコンテンツは常に'text'
					'', // content_urlは空にする
					category || null,
					order ? parseInt(order) : 0,
					showInSidebar,
					sidebarIcon,
					sidebarOrder ? parseInt(sidebarOrder) : 0
				]
			});

			const contentId = contentResult.rows[0].id as number;

			// セクションを保存
			if (sectionsJson) {
				const sections = JSON.parse(sectionsJson);
				for (const section of sections) {
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

			return { success: true, message: '保存しました', contentId };
		} catch (error: any) {
			console.error('Content creation error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
