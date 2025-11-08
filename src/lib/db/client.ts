import { createClient } from '@libsql/client';

export function getTursoClient(url: string, authToken: string) {
	return createClient({
		url,
		authToken
	});
}
