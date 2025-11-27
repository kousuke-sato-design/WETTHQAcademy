import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const user = locals.user;

	if (!user || !user.company_id) {
		return {
			user: locals.user,
			contents: [],
			company: null
		};
	}

	// 企業情報を取得
	const companyResult = await db.execute({
		sql: 'SELECT id, company_name, company_code FROM companies WHERE id = ?',
		args: [user.company_id]
	});

	const company = companyResult.rows.length > 0 ? {
		id: companyResult.rows[0].id as number,
		company_name: companyResult.rows[0].company_name as string,
		company_code: companyResult.rows[0].company_code as string
	} : null;

	// 自社専用コンテンツを取得
	const contentsResult = await db.execute({
		sql: `
			SELECT id, title, description, category, "order", created_at
			FROM contents
			WHERE is_company_specific = 1 AND target_company_id = ?
			ORDER BY "order" ASC, created_at DESC
		`,
		args: [user.company_id]
	});

	const contents = contentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		description: (row.description as string) || '',
		category: (row.category as string) || '',
		order: row.order as number,
		created_at: row.created_at as string
	}));

	return {
		user: locals.user,
		contents,
		company
	};
};

export const actions = {
	deleteContent: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const user = locals.user;
		if (!user || !user.company_id) {
			return fail(403, { error: '権限がありません' });
		}

		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'コンテンツIDが指定されていません' });
		}

		try {
			// 自社のコンテンツかどうか確認して削除
			await db.execute({
				sql: 'DELETE FROM contents WHERE id = ? AND is_company_specific = 1 AND target_company_id = ?',
				args: [parseInt(id), user.company_id]
			});

			return { success: true, message: 'コンテンツを削除しました' };
		} catch (error) {
			console.error('Content delete error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
