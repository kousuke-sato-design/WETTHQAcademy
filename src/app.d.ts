import type { User } from '$lib/auth/auth';

declare global {
	namespace App {
		interface Locals {
			user?: User;
		}
	}
}

export {};
