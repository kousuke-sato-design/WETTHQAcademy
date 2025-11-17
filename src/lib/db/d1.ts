// Cloudflare D1データベース接続
// プラットフォームコンテキストから取得したD1バインディングを使用します

import type { D1Database } from '@cloudflare/workers-types';

// D1バインディングのラッパークラス
export class D1Wrapper {
	constructor(private db: D1Database) {}

	async execute(query: string | { sql: string; args: unknown[] }) {
		if (typeof query === 'string') {
			const result = await this.db.prepare(query).all();
			return {
				rows: result.results || [],
				rowsAffected: result.meta.changes || 0
			};
		} else {
			const stmt = this.db.prepare(query.sql);
			const result = await stmt.bind(...query.args).all();
			return {
				rows: result.results || [],
				rowsAffected: result.meta.changes || 0
			};
		}
	}

	async batch(queries: Array<{ sql: string; args: unknown[] }>) {
		const statements = queries.map((q) => this.db.prepare(q.sql).bind(...q.args));
		const results = await this.db.batch(statements);
		return results.map((result) => ({
			rows: result.results || [],
			rowsAffected: result.meta.changes || 0
		}));
	}
}

export function getD1Client(db: D1Database) {
	return new D1Wrapper(db);
}
