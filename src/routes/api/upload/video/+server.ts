import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		console.log('=== アップロード開始 ===');
		const startTime = Date.now();

		console.log('FormData読み取り開始...');
		const formData = await request.formData();
		console.log(`FormData読み取り完了 (${Date.now() - startTime}ms)`);

		const file = formData.get('file') as File;

		if (!file) {
			return error(400, 'ファイルが指定されていません');
		}

		console.log(`ファイル情報: ${file.name}, サイズ: ${(file.size / 1024 / 1024).toFixed(2)}MB, タイプ: ${file.type}`);

		// ファイルサイズチェック（100MB以下 - Cloudflare Workers制限）
		const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
		if (file.size > MAX_FILE_SIZE) {
			return error(400, 'ファイルサイズが大きすぎます（最大100MB）');
		}

		// 動画ファイル形式チェック
		const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
		if (!allowedTypes.includes(file.type)) {
			return error(400, 'サポートされていないファイル形式です（mp4, webm, ogg, mov のみ）');
		}

		if (!platform?.env?.VIDEOS) {
			console.error('R2バケットが設定されていません');
			return error(500, 'R2バケットが設定されていません');
		}

		// ファイル名をユニークにする
		const timestamp = Date.now();
		const randomString = Math.random().toString(36).substring(2, 15);
		const fileExtension = file.name.split('.').pop();
		const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;

		console.log(`R2アップロード開始: ${uniqueFileName}`);
		const r2StartTime = Date.now();

		// R2にアップロード（ストリーミングで大きなファイルに対応）
		await platform.env.VIDEOS.put(uniqueFileName, file.stream(), {
			httpMetadata: {
				contentType: file.type
			}
		});

		console.log(`R2アップロード完了 (${Date.now() - r2StartTime}ms)`);
		console.log(`=== 全体処理時間: ${Date.now() - startTime}ms ===`);

		// 公開URLを生成（カスタムドメインを設定している場合はそれを使用）
		// 現時点ではバケット名とファイル名を返す
		const publicUrl = `https://pub-<ACCOUNT_ID>.r2.dev/${uniqueFileName}`;

		return json({
			success: true,
			fileName: uniqueFileName,
			url: publicUrl,
			size: file.size,
			type: file.type
		});
	} catch (err) {
		console.error('動画アップロードエラー:', err);
		return error(500, `アップロードに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
	}
};
