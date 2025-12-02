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

	// 全企業コンテンツを取得（コピー元選択用）
	const allContentsResult = await db.execute({
		sql: `
			SELECT c.id, c.title, c.description, c.content_type, c.category, c.created_at, c.target_company_id,
				   comp.company_name, comp.company_code
			FROM contents c
			LEFT JOIN companies comp ON c.target_company_id = comp.id
			WHERE c.is_company_specific = 1
			ORDER BY comp.company_name, c.created_at ASC
		`,
		args: []
	});

	const allContents = allContentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		description: row.description as string | null,
		content_type: row.content_type as 'video' | 'text',
		category: row.category as string | null,
		created_at: row.created_at as string,
		target_company_id: row.target_company_id as number,
		company_name: row.company_name as string,
		company_code: row.company_code as string
	}));

	return {
		user: locals.user,
		company,
		contents,
		otherCompanies,
		allCompanies,
		allContents
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
	},

	copyContent: async ({ request, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const data = await request.formData();
		const contentId = data.get('contentId')?.toString();
		const targetCompanyIds = data.getAll('targetCompanyIds').map(id => id.toString());

		if (!contentId) {
			return fail(400, { error: 'コンテンツIDが指定されていません' });
		}

		if (targetCompanyIds.length === 0) {
			return fail(400, { error: 'コピー先の企業を選択してください' });
		}

		try {
			// 元のコンテンツを取得
			const originalContent = await db.execute({
				sql: `SELECT title, description, content_type, content_url, category, "order", sections, show_in_sidebar, sidebar_icon, sidebar_order
					  FROM contents WHERE id = ?`,
				args: [parseInt(contentId)]
			});

			if (originalContent.rows.length === 0) {
				return fail(404, { error: 'コンテンツが見つかりません' });
			}

			const content = originalContent.rows[0];
			let copiedCount = 0;

			// 各企業にコピー
			for (const targetCompanyId of targetCompanyIds) {
				await db.execute({
					sql: `INSERT INTO contents (title, description, content_type, content_url, category, "order", sections, show_in_sidebar, sidebar_icon, sidebar_order, is_company_specific, target_company_id, created_at)
						  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, datetime('now'))`,
					args: [
						content.title,
						content.description,
						content.content_type,
						content.content_url,
						content.category,
						content.order,
						content.sections,
						content.show_in_sidebar,
						content.sidebar_icon,
						content.sidebar_order,
						parseInt(targetCompanyId)
					]
				});
				copiedCount++;
			}

			return { success: true, message: `${copiedCount}社にコンテンツをコピーしました`, action: 'copy' };
		} catch (err) {
			console.error('Content copy error:', err);
			return fail(500, { error: 'コピー中にエラーが発生しました' });
		}
	}
} satisfies Actions;
