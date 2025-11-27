import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	// 企業一覧を取得
	const companiesResult = await db.execute(`
		SELECT c.id, c.company_name, c.company_code,
			(SELECT COUNT(*) FROM contents WHERE is_company_specific = 1 AND target_company_id = c.id) as content_count
		FROM companies c
		ORDER BY c.company_name ASC
	`);

	const companies = companiesResult.rows.map((row) => ({
		id: row.id as number,
		company_name: row.company_name as string,
		company_code: row.company_code as string,
		content_count: row.content_count as number
	}));

	return {
		user: locals.user,
		companies
	};
};
