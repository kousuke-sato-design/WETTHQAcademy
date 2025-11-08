import dotenv from 'dotenv';
import { getTursoClient } from '../src/lib/db/client';
import { initDatabase, seedDatabase } from '../src/lib/db/schema';

// .env.local を読み込む
dotenv.config({ path: '.env.local' });

async function main() {
	const url = process.env.TURSO_DATABASE_URL;
	const authToken = process.env.TURSO_AUTH_TOKEN;

	if (!url || !authToken) {
		throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
	}

	const turso = getTursoClient(url, authToken);

	console.log('Initializing database...');
	await initDatabase(turso);

	console.log('Seeding database...');
	await seedDatabase(turso);

	console.log('Done!');
	process.exit(0);
}

main().catch((error) => {
	console.error('Error:', error);
	process.exit(1);
});
