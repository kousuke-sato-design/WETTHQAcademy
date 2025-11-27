import { fail, error } from '@sveltejs/kit';
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

	// この企業専用のコンテンツ一覧を取得
	const contentsResult = await db.execute({
		sql: `
			SELECT id, title, description, content_type, content_url, category, "order", created_at
			FROM contents
			WHERE is_company_specific = 1 AND target_company_id = ?
			ORDER BY created_at ASC
		`,
		args: [companyId]
	});

	const contents = contentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		description: row.description as string | null,
		content_type: row.content_type as 'video' | 'text',
		content_url: row.content_url as string,
		category: row.category as string | null,
		order: row.order as number,
		created_at: row.created_at as string
	}));

	return {
		user: locals.user,
		company,
		contents
	};
};

export const actions = {
	deleteContent: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'コンテンツIDが指定されていません' });
		}

		try {
			await db.execute({
				sql: 'DELETE FROM contents WHERE id = ?',
				args: [parseInt(id)]
			});

			return { success: true, message: 'コンテンツを削除しました' };
		} catch (err) {
			console.error('Content delete error:', err);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
