import { AccountPurposesSeeder } from './account-purpose.seeder';
import { BaseSeeder } from './base.seeder';

export const seeders: (new (db: any) => BaseSeeder)[] = [AccountPurposesSeeder];

export * from './account-purpose.seeder';
