// データベースクライアント統合ファイル
// Cloudflare D1を使用

import type { RequestEvent } from '@sveltejs/kit';
import type { D1Wrapper } from './d1';

export function getDb(event: RequestEvent): D1Wrapper {
	if (!event.locals.db) {
		throw new Error('Database not available. Make sure you are running on Cloudflare Pages.');
	}
	return event.locals.db;
}

// 開発環境用のフォールバック（ローカル開発時）
export async function getDevDb() {
	// ローカル開発時は wrangler dev を使うか、
	// D1のローカルバインディングを使用してください
	throw new Error(
		'Development database not configured. Please use "wrangler pages dev" for local development.'
	);
}
