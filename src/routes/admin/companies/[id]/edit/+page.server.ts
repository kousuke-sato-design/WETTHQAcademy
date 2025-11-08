import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { turso } from '$lib/db/turso';

export const load: PageServerLoad = async ({ locals, params }) => {
	const companyId = params.id;

	// 企業情報を取得
	const companyResult = await turso.execute({
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
	const staffResult = await turso.execute({
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
	const studentsResult = await turso.execute({
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
	const contentsResult = await turso.execute({
		sql: `
			SELECT id, title, category, created_at
			FROM contents
			ORDER BY created_at DESC
		`,
		args: []
	});

	// この企業が閲覧許可を持っているコンテンツIDを取得
	const permissionsResult = await turso.execute({
		sql: `
			SELECT content_id
			FROM company_content_permissions
			WHERE company_id = ?
		`,
		args: [parseInt(companyId)]
	});

	const permittedContentIds = new Set(permissionsResult.rows.map(row => row.content_id as number));

	const contents = contentsResult.rows.map((row) => ({
		id: row.id as number,
		title: row.title as string,
		category: row.category as string | null,
		created_at: row.created_at as string,
		permitted: permittedContentIds.has(row.id as number)
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
	updateCompany: async ({ request, params }) => {
		const companyId = params.id;
		const data = await request.formData();
		const company_name = data.get('company_name')?.toString();

		if (!company_name) {
			return fail(400, { error: '企業名を入力してください' });
		}

		try {
			// 企業名のみを更新（企業コードは変更不可）
			await turso.execute({
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

	updatePermissions: async ({ request, params }) => {
		const companyId = params.id;
		const data = await request.formData();

		try {
			// 現在の許可を全て削除
			await turso.execute({
				sql: 'DELETE FROM company_content_permissions WHERE company_id = ?',
				args: [parseInt(companyId)]
			});

			// チェックされたコンテンツの許可を追加
			const contentIds = data.getAll('content_ids[]');
			for (const contentId of contentIds) {
				await turso.execute({
					sql: 'INSERT INTO company_content_permissions (company_id, content_id) VALUES (?, ?)',
					args: [parseInt(companyId), parseInt(contentId.toString())]
				});
			}

			return { success: true, message: 'コンテンツの受講許可を更新しました' };
		} catch (error) {
			console.error('Permission update error:', error);
			return fail(500, { error: 'データベースエラーが発生しました' });
		}
	}
} satisfies Actions;
