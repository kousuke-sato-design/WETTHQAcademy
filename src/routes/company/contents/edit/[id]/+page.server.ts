import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const db = locals.db;
	const user = locals.user;

	console.log('[Company Edit] User:', JSON.stringify(user));
	console.log('[Company Edit] company_id:', user?.company_id);
	console.log('[Company Edit] role:', user?.role);

	if (!db || !user || user.role !== 'company_admin' || !user.company_id) {
		console.log('[Company Edit] Validation failed - redirecting to login');
		throw redirect(303, '/company/login');
	}

	const contentId = params.id;
	console.log('[Company Edit] Loading content:', contentId, 'for company:', user.company_id);

	try {
		// 編集権限を確認
		const permissionCheck = await db.execute({
			sql: `
				SELECT can_edit
				FROM company_content_permissions
				WHERE company_id = ? AND content_id = ? AND can_edit = 1
			`,
			args: [user.company_id, parseInt(contentId)]
		});

		console.log('[Company Edit] Permission check result:', permissionCheck.rows.length);

		if (permissionCheck.rows.length === 0) {
			console.log('[Company Edit] No edit permission - redirecting to contents');
			throw redirect(303, '/company/contents');
		}

		// コンテンツ情報を取得
		const contentResult = await db.execute({
			sql: 'SELECT id, title, description, category, sidebar_order as "order" FROM contents WHERE id = ?',
			args: [parseInt(contentId)]
		});

		if (contentResult.rows.length === 0) {
			console.log('[Company Edit] Content not found');
			throw redirect(303, '/company/contents');
		}

		const content = {
			id: contentResult.rows[0].id as number,
			title: contentResult.rows[0].title as string,
			description: (contentResult.rows[0].description as string) || '',
			category: (contentResult.rows[0].category as string) || '',
			order: contentResult.rows[0].order as number
		};

		// セクション情報を取得
		const sectionsResult = await db.execute({
			sql: 'SELECT section_type, title, items, section_order FROM content_sections WHERE content_id = ? ORDER BY section_order ASC',
			args: [parseInt(contentId)]
		});

		const sections = sectionsResult.rows.map((row: any) => {
			const items = typeof row.items === 'string' ? JSON.parse(row.items) : row.items;
			return {
				sectionType: row.section_type,
				title: row.title,
				items: items,
				order: row.section_order
			};
		});

		// コンテンツ一覧を取得（サイドバー用）
		const contentsResult = await db.execute({
			sql: `
				SELECT c.id, c.title, c.sidebar_icon, c.sidebar_order
				FROM contents c
				INNER JOIN company_content_permissions ccp ON c.id = ccp.content_id
				WHERE c.show_in_sidebar = 1 AND ccp.company_id = ?
				ORDER BY ccp.display_order ASC, c.sidebar_order ASC, c.created_at ASC
			`,
			args: [user.company_id]
		});

		const contents = contentsResult.rows.map(row => ({
			id: row.id as number,
			title: row.title as string,
			sidebar_icon: row.sidebar_icon as string,
			sidebar_order: row.sidebar_order as number
		}));

		console.log('[Company Edit] Successfully loaded content');

		return {
			user,
			content,
			sections,
			contents
		};
	} catch (error: any) {
		console.error('[Company Edit] Error loading content:', error);
		console.error('[Company Edit] Error message:', error?.message);
		console.error('[Company Edit] Error stack:', error?.stack);
		// エラーの詳細を表示するため、エラーメッセージを含めて再スロー
		throw new Error(`Failed to load content: ${error?.message || String(error)}`);
	}
};

export const actions = {
	default: async ({ request, params, locals }) => {
		const db = locals.db;
		const user = locals.user;

		if (!db || !user || user.role !== 'company_admin' || !user.company_id) {
			return fail(401, { error: '権限がありません' });
		}

		const contentId = params.id;

		// 編集権限を再確認
		const permissionCheck = await db.execute({
			sql: `
				SELECT can_edit
				FROM company_content_permissions
				WHERE company_id = ? AND content_id = ? AND can_edit = 1
			`,
			args: [user.company_id, parseInt(contentId)]
		});

		if (permissionCheck.rows.length === 0) {
			return fail(403, { error: '編集権限がありません' });
		}

		const data = await request.formData();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString() || '';
		const category = data.get('category')?.toString() || '';
		const order = parseInt(data.get('order')?.toString() || '0');
		const sectionsJson = data.get('sections')?.toString();

		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		try {
			// コンテンツ基本情報を更新
			await db.execute({
				sql: 'UPDATE contents SET title = ?, description = ?, category = ?, sidebar_order = ? WHERE id = ?',
				args: [title, description, category, order, parseInt(contentId)]
			});

			// セクションを更新
			if (sectionsJson) {
				const sections = JSON.parse(sectionsJson);

				// 既存のセクションを削除
				await db.execute({
					sql: 'DELETE FROM content_sections WHERE content_id = ?',
					args: [parseInt(contentId)]
				});

				// 新しいセクションを挿入
				for (const section of sections) {
					await db.execute({
						sql: 'INSERT INTO content_sections (content_id, section_type, title, items, section_order) VALUES (?, ?, ?, ?, ?)',
						args: [
							parseInt(contentId),
							section.sectionType,
							section.title,
							JSON.stringify(section.items),
							section.order
						]
					});
				}
			}

			return { success: true, message: '保存しました' };
		} catch (error: any) {
			console.error('Content update error:', error);
			return fail(500, { error: '保存に失敗しました' });
		}
	}
} satisfies Actions;
