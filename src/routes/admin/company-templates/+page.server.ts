import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	// 企業一覧を取得（テンプレート数付き）
	const companiesResult = await db.execute(`
		SELECT c.id, c.company_name, c.company_code,
			(SELECT COUNT(*) FROM mail_templates WHERE is_company_specific = 1 AND target_company_id = c.id) as template_count
		FROM companies c
		ORDER BY c.company_name ASC
	`);

	const companies = companiesResult.rows.map((row) => ({
		id: row.id as number,
		company_name: row.company_name as string,
		company_code: row.company_code as string,
		template_count: row.template_count as number
	}));

	// 全企業テンプレートを取得（検索・コピー用）
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
		companies,
		allTemplates
	};
};

export const actions = {
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

			return { success: true, message: `${copiedCount}社にテンプレートをコピーしました` };
		} catch (err) {
			console.error('Template copy error:', err);
			return fail(500, { error: 'コピー中にエラーが発生しました' });
		}
	}
} satisfies Actions;
