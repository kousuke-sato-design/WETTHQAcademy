import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const db = locals.db;
	if (!db) {
		throw new Error('Database not available');
	}

	const companyId = params.id;

	// 企業情報を取得
	const companyResult = await db.execute({
		sql: 'SELECT id, company_name, company_code FROM companies WHERE id = ?',
		args: [parseInt(companyId)]
	});

	if (companyResult.rows.length === 0) {
		throw redirect(303, '/admin/companies');
	}

	const company = {
		id: companyResult.rows[0].id as number,
		company_name: companyResult.rows[0].company_name as string,
		company_code: companyResult.rows[0].company_code as string | null
	};

	// 担当者一覧を取得（company_adminsテーブルから）
	const staffResult = await db.execute({
		sql: `
			SELECT id, name, login_id, created_at
			FROM company_admins
			WHERE company_id = ?
			ORDER BY created_at DESC
		`,
		args: [parseInt(companyId)]
	});

	const staff = staffResult.rows.map((row) => ({
		id: row.id as number,
		name: row.name as string,
		login_id: row.login_id as string,
		created_at: row.created_at as string
	}));

	// 生徒一覧を取得（studentsテーブルから）
	const studentsResult = await db.execute({
		sql: `
			SELECT id, name, login_id, created_at, use_unified_id
			FROM students
			WHERE company_id = ?
			ORDER BY created_at DESC
		`,
		args: [parseInt(companyId)]
	});

	const students = studentsResult.rows.map((row) => ({
		id: row.id as number,
		name: row.name as string,
		login_id: row.login_id as string,
		created_at: row.created_at as string,
		use_unified_id: row.use_unified_id as number
	}));

	// 全コンテンツを取得
	const contentsResult = await db.execute({
		sql: `
			SELECT id, title, category, created_at
			FROM contents
			ORDER BY created_at DESC
		`,
		args: []
	});

	// この企業が閲覧許可を持っているコンテンツIDと表示順序、編集権限を取得
	const permissionsResult = await db.execute({
		sql: `
			SELECT content_id, display_order, can_edit
			FROM company_content_permissions
			WHERE company_id = ?
		`,
		args: [parseInt(companyId)]
	});

	const permittedContentIds = new Set(permissionsResult.rows.map(row => row.content_id as number));
	const contentDisplayOrders = new Map(
		permissionsResult.rows.map(row => [row.content_id as number, row.display_order as number])
	);
	const contentEditPermissions = new Map(
		permissionsResult.rows.map(row => [row.content_id as number, (row.can_edit as number) === 1])
	);

	const contents = contentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		category: row.category as string | null,
		created_at: row.created_at as string,
		permitted: permittedContentIds.has(row.id as number),
		display_order: contentDisplayOrders.get(row.id as number) || 0,
		can_edit: contentEditPermissions.get(row.id as number) || false
	}));

	return {
		user: locals.user,
		company,
		staff,
		students,
		contents
	};
};

export const actions = {
	updateCompany: async ({ request, params, locals}) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const companyId = params.id;
		const data = await request.formData();
		const company_name = data.get('company_name')?.toString();

		if (!company_name) {
			return fail(400, { error: '企業名を入力してください' });
		}

		try {
			// 企業名のみを更新（企業コードは変更不可）
			await db.execute({
				sql: 'UPDATE companies SET company_name = ? WHERE id = ?',
				args: [company_name, parseInt(companyId)]
			});

			throw redirect(303, '/admin/companies');
		} catch (error: any) {
			if (error?.status === 303) {
				throw error;
			}
			console.error('Company update error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	},

	updatePermissions: async ({ request, params, locals }) => {
		const db = locals.db;
		if (!db) {
			return fail(500, { error: 'データベース接続エラー' });
		}

		const companyId = params.id;
		const data = await request.formData();

		try {
			// 現在の許可を全て削除
			await db.execute({
				sql: 'DELETE FROM company_content_permissions WHERE company_id = ?',
				args: [parseInt(companyId)]
			});

			// チェックされたコンテンツの許可を追加
			const contentIds = data.getAll('content_ids[]');
			console.log(`[受講許可更新] 企業ID: ${companyId}, コンテンツ数: ${contentIds.length}`);

			for (const contentId of contentIds) {
				// 表示順序を取得（未指定の場合は0）
				const displayOrder = data.get(`display_order_${contentId}`)?.toString() || '0';
				// 編集権限を取得（チェックされている場合は1、それ以外は0）
				const canEdit = data.get(`can_edit_${contentId}`) ? 1 : 0;

				await db.execute({
					sql: 'INSERT INTO company_content_permissions (company_id, content_id, display_order, can_edit) VALUES (?, ?, ?, ?)',
					args: [parseInt(companyId), parseInt(contentId.toString()), parseInt(displayOrder), canEdit]
				});
			}

			console.log(`[受講許可更新完了] ${contentIds.length}件のコンテンツ許可を設定しました`);
			return { success: true, message: '受講許可の更新が完了しました' };
		} catch (error: any) {
			console.error('Permission update error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
