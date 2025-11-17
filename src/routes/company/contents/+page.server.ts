import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const user = locals.user;

	if (!user || !user.company_id) {
		return {
			user: locals.user,
			totalContents: 0,
			permittedContents: 0
		};
	}

	// 全コンテンツ数を取得
	const contentsResult = await db.execute({
		sql: 'SELECT COUNT(*) as count FROM contents',
		args: []
	});
	const totalContents = contentsResult.rows[0].count as number;

	// この企業が閲覧許可を持っているコンテンツ数を取得（テーブルが存在しない場合は0）
	let permittedContents = 0;
	try {
		const permittedResult = await db.execute({
			sql: 'SELECT COUNT(*) as count FROM company_content_permissions WHERE company_id = ?',
			args: [user.company_id]
		});
		permittedContents = permittedResult.rows[0].count as number;
	} catch (err) {
		console.error('company_content_permissions table not found:', err);
		permittedContents = 0;
	}

	return {
		user: locals.user,
		totalContents,
		permittedContents
	};
};
