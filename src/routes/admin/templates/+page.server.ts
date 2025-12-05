import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	// 共通メールテンプレート一覧を取得（is_company_specific = 0）
	const templatesResult = await db.execute({
		sql: `SELECT id, title, subject, body, description, category, created_at, updated_at
			FROM mail_templates
			WHERE is_company_specific = 0
			ORDER BY category, created_at DESC`,
		args: []
	});

	const templates = templatesResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		subject: row.subject as string | null,
		body: row.body as string,
		description: row.description as string | null,
		category: row.category as string,
		created_at: row.created_at as string,
		updated_at: row.updated_at as string
	}));

	// 企業一覧を取得（企業専用テンプレートタブ用）
	const companiesResult = await db.execute(`
		SELECT
			c.id,
			c.company_name,
			c.company_code,
			(SELECT COUNT(*) FROM mail_templates WHERE target_company_id = c.id) as template_count
		FROM companies c
		ORDER BY c.company_name ASC
	`);

	const companies = companiesResult.rows.map((row) => ({
		id: row.id as number,
		company_name: row.company_name as string,
		company_code: row.company_code as string | null,
		template_count: row.template_count as number
	}));

	return {
		user: locals.user,
		templates,
		companies
	};
};

export const actions = {
	createTemplate: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const title = data.get('title')?.toString();
		const subject = data.get('subject')?.toString();
		const body = data.get('body')?.toString();
		const description = data.get('description')?.toString();
		const category = data.get('category')?.toString() || 'login';

		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		if (!body) {
			return fail(400, { error: '本文を入力してください' });
		}

		try {
			await db.execute({
				sql: `INSERT INTO mail_templates (title, subject, body, description, category, is_company_specific) VALUES (?, ?, ?, ?, ?, 0)`,
				args: [title, subject || null, body, description || null, category]
			});

			return { success: true, message: 'テンプレートを作成しました' };
		} catch (error) {
			console.error('Template creation error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	updateTemplate: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const id = data.get('id')?.toString();
		const title = data.get('title')?.toString();
		const subject = data.get('subject')?.toString();
		const body = data.get('body')?.toString();
		const description = data.get('description')?.toString();
		const category = data.get('category')?.toString() || 'login';

		if (!id) {
			return fail(400, { error: 'テンプレートIDが指定されていません' });
		}

		if (!title) {
			return fail(400, { error: 'タイトルを入力してください' });
		}

		if (!body) {
			return fail(400, { error: '本文を入力してください' });
		}

		try {
			await db.execute({
				sql: `UPDATE mail_templates SET title = ?, subject = ?, body = ?, description = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_company_specific = 0`,
				args: [title, subject || null, body, description || null, category, parseInt(id)]
			});

			return { success: true, message: 'テンプレートを更新しました' };
		} catch (error) {
			console.error('Template update error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	deleteTemplate: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'テンプレートIDが指定されていません' });
		}

		try {
			await db.execute({
				sql: 'DELETE FROM mail_templates WHERE id = ? AND is_company_specific = 0',
				args: [parseInt(id)]
			});

			return { success: true, message: 'テンプレートを削除しました' };
		} catch (error) {
			console.error('Template delete error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
