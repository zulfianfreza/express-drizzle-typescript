import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '../src/config/env';
import { seeders } from '../src/database/seeders';

async function runSeeders() {
  console.log('🌱 Starting database seeding...');

  const connection = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  });

  const db = drizzle(connection);

  try {
    // Run seeders in order
    for (const SeederClass of seeders) {
      const seeder = new SeederClass(db);
      await seeder.run();
    }

    console.log('✅ All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders();
}

export { runSeeders };
