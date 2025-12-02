import { error, fail } from '@sveltejs/kit';
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

	// この企業専用のテンプレート一覧を取得
	const templatesResult = await db.execute({
		sql: `SELECT id, title, subject, body, description, category, created_at, updated_at
			  FROM mail_templates
			  WHERE is_company_specific = 1 AND target_company_id = ?
			  ORDER BY created_at ASC`,
		args: [companyId]
	});

	const templates = templatesResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		subject: row.subject as string | null,
		body: row.body as string,
		description: row.description as string | null,
		category: row.category as string | null,
		created_at: row.created_at as string,
		updated_at: row.updated_at as string | null
	}));

	// 他の企業一覧を取得（コピー先選択用）
	const otherCompaniesResult = await db.execute({
		sql: 'SELECT id, company_name, company_code FROM companies WHERE id != ? ORDER BY company_name',
		args: [companyId]
	});

	const otherCompanies = otherCompaniesResult.rows.map((row) => ({
		id: row.id as number,
		company_name: row.company_name as string,
		company_code: row.company_code as string
	}));

	// 全企業一覧を取得
	const allCompaniesResult = await db.execute({
		sql: 'SELECT id, company_name, company_code FROM companies ORDER BY company_name',
		args: []
	});

	const allCompanies = allCompaniesResult.rows.map((row) => ({
		id: row.id as number,
		company_name: row.company_name as string,
		company_code: row.company_code as string
	}));

	// 全企業テンプレートを取得（コピー元選択用）
	const allTemplatesResult = await db.execute({
		sql: `
			SELECT t.id, t.title, t.subject, t.body, t.description, t.category, t.created_at, t.target_company_id,
				   comp.company_name, comp.company_code
			FROM mail_templates t
			LEFT JOIN companies comp ON t.target_company_id = comp.id
			WHERE t.is_company_specific = 1
			ORDER BY comp.company_name, t.created_at ASC
		`,
		args: []
	});

	const allTemplates = allTemplatesResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		subject: row.subject as string | null,
		body: row.body as string,
		description: row.description as string | null,
		category: row.category as string | null,
		created_at: row.created_at as string,
		target_company_id: row.target_company_id as number,
		company_name: row.company_name as string,
		company_code: row.company_code as string
	}));

	return {
		user: locals.user,
		company,
		templates,
		otherCompanies,
		allCompanies,
		allTemplates
	};
};

export const actions = {
	createTemplate: async ({ request, locals, params }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const companyId = parseInt(params.companyId);
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
				sql: `INSERT INTO mail_templates (title, subject, body, description, category, is_company_specific, target_company_id, created_at, updated_at)
					  VALUES (?, ?, ?, ?, ?, 1, ?, datetime('now'), datetime('now'))`,
				args: [title, subject || null, body, description || null, category || 'other', companyId]
			});

			return { success: true, message: 'テンプレートを作成しました' };
		} catch (err) {
			console.error('Template create error:', err);
			return fail(500, { error: 'テンプレートの作成に失敗しました' });
		}
	},

	deleteTemplate: async ({ request, locals, params }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const companyId = parseInt(params.companyId);
		const data = await request.formData();
		const templateId = data.get('templateId')?.toString();

		if (!templateId) {
			return fail(400, { error: 'テンプレートIDが指定されていません' });
		}

		try {
			await db.execute({
				sql: 'DELETE FROM mail_templates WHERE id = ? AND is_company_specific = 1 AND target_company_id = ?',
				args: [parseInt(templateId), companyId]
			});

			return { success: true, message: 'テンプレートを削除しました' };
		} catch (err) {
			console.error('Template delete error:', err);
			return fail(500, { error: 'テンプレートの削除に失敗しました' });
		}
	},

	copyTemplate: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const templateId = data.get('templateId')?.toString();
		const targetCompanyIds = data.getAll('targetCompanyIds').map(id => id.toString());

		if (!templateId) {
			return fail(400, { error: 'テンプレートIDが指定されていません' });
		}

		if (targetCompanyIds.length === 0) {
			return fail(400, { error: 'コピー先の企業を選択してください' });
		}

		try {
			// 元のテンプレートを取得
			const originalTemplate = await db.execute({
				sql: `SELECT title, subject, body, description, category FROM mail_templates WHERE id = ?`,
				args: [parseInt(templateId)]
			});

			if (originalTemplate.rows.length === 0) {
				return fail(404, { error: 'テンプレートが見つかりません' });
			}

			const template = originalTemplate.rows[0];
			let copiedCount = 0;

			// 各企業にコピー
			for (const targetCompanyId of targetCompanyIds) {
				await db.execute({
					sql: `INSERT INTO mail_templates (title, subject, body, description, category, is_company_specific, target_company_id, created_at, updated_at)
						  VALUES (?, ?, ?, ?, ?, 1, ?, datetime('now'), datetime('now'))`,
					args: [
						template.title,
						template.subject,
						template.body,
						template.description,
						template.category,
						parseInt(targetCompanyId)
					]
				});
				copiedCount++;
			}

			return { success: true, message: `${copiedCount}社にテンプレートをコピーしました`, action: 'copy' };
		} catch (err) {
			console.error('Template copy error:', err);
			return fail(500, { error: 'コピー中にエラーが発生しました' });
		}
	}
} satisfies Actions;
