import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform, request }) => {
	const { filename } = params;

	if (!filename) {
		return error(400, 'ファイル名が指定されていません');
	}

	if (!platform?.env?.VIDEOS) {
		return error(500, 'R2バケットが設定されていません');
	}

	try {
		// R2からファイルを取得
		const object = await platform.env.VIDEOS.get(filename);

		if (!object) {
			return error(404, '動画が見つかりません');
		}

		const size = object.size;
		const headers = new Headers();
		headers.set('Content-Type', object.httpMetadata?.contentType || 'video/mp4');
		headers.set('Accept-Ranges', 'bytes');
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');

		// Range Requestsのサポート（YouTubeと同じ仕組み）
		const range = request.headers.get('range');

		if (range && size) {
			// Range: bytes=start-end の形式をパース
			const parts = range.replace(/bytes=/, '').split('-');
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
			const chunksize = end - start + 1;

			// R2から指定範囲を取得
			const rangeObject = await platform.env.VIDEOS.get(filename, {
				range: { offset: start, length: chunksize }
			});

			if (!rangeObject) {
				return error(416, 'Range Not Satisfiable');
			}

			headers.set('Content-Length', chunksize.toString());
			headers.set('Content-Range', `bytes ${start}-${end}/${size}`);

			return new Response(rangeObject.body, {
				status: 206,
				headers
			});
		}

		// 通常のリクエスト（Range指定なし）
		if (size) {
			headers.set('Content-Length', size.toString());
		}

		return new Response(object.body, {
			headers
		});
	} catch (err) {
		console.error('動画取得エラー:', err);
		return error(500, '動画の取得に失敗しました');
	}
};
