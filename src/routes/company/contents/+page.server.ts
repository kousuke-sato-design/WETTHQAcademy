import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const user = locals.user;
	const companyId = user?.company_id;

	if (!companyId) {
		return {
			user: locals.user,
			contents: [],
			allContents: []
		};
	}

	try {
		// 全コンテンツを取得（権限の有無を表示するため）
		const allContentsResult = await db.execute({
			sql: `SELECT id, title, description, category, created_at
			      FROM contents
			      ORDER BY "order" ASC, created_at DESC`
		});

		// この企業が閲覧許可を持っているコンテンツIDを取得
		let permittedIds = new Set<number>();
		try {
			const permissionsResult = await db.execute({
				sql: `SELECT content_id FROM company_content_permissions WHERE company_id = ?`,
				args: [companyId]
			});
			permittedIds = new Set(permissionsResult.rows.map((row) => row.content_id as number));
		} catch (err) {
			console.error('Error fetching permissions:', err);
			// 権限テーブルが存在しない場合は空のセットを使用
		}

		// 全コンテンツに権限情報を追加
		const allContents = allContentsResult.rows.map((row) => ({
			id: row.id as number,
			title: row.title as string,
			description: (row.description as string) || '',
			category: (row.category as string) || '',
			created_at: row.created_at as string,
			hasPermission: permittedIds.has(row.id as number)
		}));

		// 権限のあるコンテンツのみをフィルター
		const permittedContents = allContents.filter((c) => c.hasPermission);

		return {
			user: locals.user,
			contents: permittedContents,
			allContents
		};
	} catch (error) {
		console.error('Error loading company contents:', error);
		// エラーが発生しても空のデータを返す
		return {
			user: locals.user,
			contents: [],
			allContents: [],
			error: 'コンテンツの読み込み中にエラーが発生しました'
		};
	}
};
