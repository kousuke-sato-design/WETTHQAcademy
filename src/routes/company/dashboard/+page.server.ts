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
			totalStudents: 0,
			totalContents: 0,
			permittedContents: 0
		};
	}

	// この企業の生徒数を取得
	const studentsResult = await db.execute({
		sql: 'SELECT COUNT(*) as count FROM students WHERE company_id = ?',
		args: [user.company_id]
	});
	const totalStudents = studentsResult.rows[0].count as number;

	// 全コンテンツ数を取得
	const contentsResult = await db.execute({
		sql: 'SELECT COUNT(*) as count FROM contents',
		args: []
	});
	const totalContents = contentsResult.rows[0].count as number;

	// この企業が閲覧許可を持っているコンテンツ数を取得
	const permittedResult = await db.execute({
		sql: 'SELECT COUNT(*) as count FROM company_content_permissions WHERE company_id = ?',
		args: [user.company_id]
	});
	const permittedContents = permittedResult.rows[0].count as number;

	return {
		user: locals.user,
		totalStudents,
		totalContents,
		permittedContents
	};
};
