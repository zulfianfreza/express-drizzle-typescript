import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const lkAccountPurposes = mysqlTable('lk_account_purposes', {
  id: int('id').primaryKey().autoincrement(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  is_active: int('is_active').default(1),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});
