import type { User } from '$lib/auth/auth';
import type { D1Wrapper } from '$lib/db/d1';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Locals {
			user?: User;
			db?: D1Wrapper;
		}
		interface Platform {
			env: {
				DB: D1Database;
				VIDEOS: R2Bucket;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
