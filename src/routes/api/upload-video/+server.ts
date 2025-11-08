import { put } from '@vercel/blob';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return json({ error: 'ファイルが選択されていません' }, { status: 400 });
		}

		// ファイルサイズチェック（100MB以下）
		const maxSize = 100 * 1024 * 1024; // 100MB
		if (file.size > maxSize) {
			return json({ error: 'ファイルサイズは100MB以下にしてください' }, { status: 400 });
		}

		// 動画ファイル形式チェック
		const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
		if (!allowedTypes.includes(file.type)) {
			return json({ error: '対応している動画形式: MP4, WebM, OGG' }, { status: 400 });
		}

		// Vercel Blobにアップロード
		const blob = await put(file.name, file, {
			access: 'public'
		});

		return json({ url: blob.url, success: true });
	} catch (error: any) {
		console.error('Upload error:', error);
		return json({ error: `アップロードエラー: ${error.message}` }, { status: 500 });
	}
};
