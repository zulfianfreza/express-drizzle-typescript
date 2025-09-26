import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '@/config/env';
import * as schema from './schema';
import logger from '@/config/logger';

// Create connection pool
const connection = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create Drizzle database instance
export const db = drizzle(connection, {
  schema,
  mode: 'default',
  logger: {
    logQuery: (query: string, params: unknown[]) => {
      logger.debug('Database query executed');
    },
  },
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const conn = await connection.getConnection();
    await conn.ping();
    conn.release();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Failed to connect to database');
    return false;
  }
};

// Close database connection
export const closeConnection = async (): Promise<void> => {
  try {
    await connection.end();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection');
  }
};

export { connection };
export type Database = typeof db;
