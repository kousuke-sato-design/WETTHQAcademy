import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const companyId = parseInt(params.companyId);
	const templateId = parseInt(params.id);

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

	// テンプレートを取得
	const templateResult = await db.execute({
		sql: `SELECT id, title, subject, body, description, category
			  FROM mail_templates
			  WHERE id = ? AND is_company_specific = 1 AND target_company_id = ?`,
		args: [templateId, companyId]
	});

	if (templateResult.rows.length === 0) {
		throw error(404, 'テンプレートが見つかりません');
	}

	const template = {
		id: templateResult.rows[0].id as number,
		title: templateResult.rows[0].title as string,
		subject: templateResult.rows[0].subject as string | null,
		body: templateResult.rows[0].body as string,
		description: templateResult.rows[0].description as string | null,
		category: templateResult.rows[0].category as string | null
	};

	return {
		user: locals.user,
		company,
		template
	};
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const companyId = parseInt(params.companyId);
		const templateId = parseInt(params.id);
		const data = await request.formData();
		const title = data.get('title')?.toString();
		const subject = data.get('subject')?.toString();
		const body = data.get('body')?.toString();
		const description = data.get('description')?.toString();
		const category = data.get('category')?.toString();

		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}
		if (!body) {
			return fail(400, { error: '本文を入力してください' });
		}

		try {
			await db.execute({
				sql: `UPDATE mail_templates
					  SET title = ?, subject = ?, body = ?, description = ?, category = ?, updated_at = datetime('now')
					  WHERE id = ? AND is_company_specific = 1 AND target_company_id = ?`,
				args: [title, subject || null, body, description || null, category || 'other', templateId, companyId]
			});

			return { success: true, message: 'テンプレートを更新しました' };
		} catch (err) {
			console.error('Template update error:', err);
			return fail(500, { error: 'テンプレートの更新に失敗しました' });
		}
	}
} satisfies Actions;
