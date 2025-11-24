import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	try {
		if (!platform?.env?.VIDEOS) {
			return error(500, 'R2バケットが設定されていません');
		}

		console.log('R2バケット内の動画一覧を取得中...');

		// R2バケット内の全オブジェクトを取得
		const listed = await platform.env.VIDEOS.list();

		// ファイル情報を整形
		const videos = listed.objects.map((obj) => ({
			key: obj.key,
			size: obj.size,
			uploaded: obj.uploaded.toISOString(),
			// ファイル名から拡張子を取得
			extension: obj.key.split('.').pop(),
		}));

		console.log(`動画ファイル数: ${videos.length}`);

		return json({
			success: true,
			videos,
			truncated: listed.truncated,
		});
	} catch (err) {
		console.error('動画一覧取得エラー:', err);
		return error(500, `動画一覧の取得に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
	}
};
