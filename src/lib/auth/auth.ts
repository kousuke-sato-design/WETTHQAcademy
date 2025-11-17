import bcrypt from 'bcryptjs';
import type { D1Wrapper } from '$lib/db/d1';

export type UserRole = 'master' | 'company_admin' | 'user';

export interface User {
	id: number;
	login_id: string;
	role: UserRole;
	company_id: number | null;
	name: string;
}

export async function verifyCredentials(
	db: D1Wrapper,
	login_id: string,
	password: string,
	expectedRole?: UserRole
): Promise<User | null> {
	try {
		let user: any = null;
		let passwordHash: string | null = null;
		let role: UserRole | null = null;

		// ロール指定がある場合は該当するテーブルのみ検索
		if (expectedRole === 'master') {
			const result = await db.execute({
				sql: 'SELECT id, login_id, password_hash, name FROM admins WHERE login_id = ?',
				args: [login_id]
			});
			if (result.rows.length > 0) {
				user = result.rows[0];
				passwordHash = user.password_hash as string;
				role = 'master';
			}
		} else if (expectedRole === 'company_admin') {
			const result = await db.execute({
				sql: 'SELECT id, login_id, password_hash, company_id, name FROM company_admins WHERE login_id = ?',
				args: [login_id]
			});
			if (result.rows.length > 0) {
				user = result.rows[0];
				passwordHash = user.password_hash as string;
				role = 'company_admin';
			}
		} else if (expectedRole === 'user') {
			const result = await db.execute({
				sql: 'SELECT id, login_id, password_hash, company_id, name FROM students WHERE login_id = ?',
				args: [login_id]
			});
			if (result.rows.length > 0) {
				user = result.rows[0];
				passwordHash = user.password_hash as string;
				role = 'user';
			}
		} else {
			// ロール指定がない場合は全テーブルを検索
			const adminResult = await db.execute({
				sql: 'SELECT id, login_id, password_hash, name FROM admins WHERE login_id = ?',
				args: [login_id]
			});
			if (adminResult.rows.length > 0) {
				user = adminResult.rows[0];
				passwordHash = user.password_hash as string;
				role = 'master';
			} else {
				const companyAdminResult = await db.execute({
					sql: 'SELECT id, login_id, password_hash, company_id, name FROM company_admins WHERE login_id = ?',
					args: [login_id]
				});
				if (companyAdminResult.rows.length > 0) {
					user = companyAdminResult.rows[0];
					passwordHash = user.password_hash as string;
					role = 'company_admin';
				} else {
					const studentResult = await db.execute({
						sql: 'SELECT id, login_id, password_hash, company_id, name FROM students WHERE login_id = ?',
						args: [login_id]
					});
					if (studentResult.rows.length > 0) {
						user = studentResult.rows[0];
						passwordHash = user.password_hash as string;
						role = 'user';
					}
				}
			}
		}

		if (!user || !passwordHash || !role) {
			return null;
		}

		// パスワード検証
		const isValid = await bcrypt.compare(password, passwordHash);
		if (!isValid) {
			return null;
		}

		return {
			id: user.id as number,
			login_id: user.login_id as string,
			role: role,
			company_id: (user.company_id as number) || null,
			name: user.name as string
		};
	} catch (error) {
		console.error('Authentication error:', error);
		return null;
	}
}

export function serializeUser(user: User): string {
	return JSON.stringify(user);
}

export function deserializeUser(data: string): User | null {
	try {
		const parsed = JSON.parse(data);

		// 新しい形式: { userId, role, company_id? }
		if (parsed.userId && parsed.role) {
			return {
				id: parsed.userId,
				login_id: '', // 簡易形式では不明
				role: parsed.role,
				company_id: parsed.company_id || null,
				name: '' // 簡易形式では不明
			};
		}

		// 完全な形式: User オブジェクト
		if (parsed.id && parsed.role) {
			return parsed as User;
		}

		return null;
	} catch {
		return null;
	}
}
