import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';
import { getTursoClient } from './client';

export const turso = getTursoClient(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN);
