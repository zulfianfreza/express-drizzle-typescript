import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import { env } from '../src/config/env';
import path from 'path';

async function runMigrations() {
  console.log('🚀 Starting database migrations...');

  const connection = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    multipleStatements: true,
  });

  const db = drizzle(connection);

  try {
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), 'src/database/migrations'),
    });

    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations };
