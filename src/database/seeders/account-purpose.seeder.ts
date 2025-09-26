import { Database } from '..';
import { lkAccountPurposes } from '../schema';
import { BaseSeeder } from './base.seeder';

export class AccountPurposesSeeder extends BaseSeeder {
  async run(): Promise<void> {
    console.log('🌱 Seeding account purposes...');

    // Optional: Clear existing data
    await this.truncateTable('lk_account_purposes');

    const accountPurposes = [
      {
        code: 'SAVINGS',
        name: 'Savings Account',
        description: 'Personal savings account for individuals',
        isActive: 1,
      },
      {
        code: 'CHECKING',
        name: 'Checking Account',
        description: 'Daily transaction account',
        isActive: 1,
      },
      {
        code: 'INVESTMENT',
        name: 'Investment Account',
        description: 'Investment and portfolio management',
        isActive: 1,
      },
      {
        code: 'BUSINESS',
        name: 'Business Account',
        description: 'Business banking account',
        isActive: 1,
      },
      {
        code: 'LOAN',
        name: 'Loan Account',
        description: 'Loan and credit account',
        isActive: 0,
      },
    ];

    await this.db.insert(lkAccountPurposes).values(accountPurposes);
    console.log(`✅ Inserted ${accountPurposes.length} account purposes`);
  }
}
