import { Database } from '..';

export abstract class BaseSeeder {
  constructor(protected db: Database) {}

  abstract run(): Promise<void>;

  protected async truncateTable(tableName: string): Promise<void> {
    console.log(`🗑️  Truncating ${tableName}...`);
    await this.db.execute(`SET FOREIGN_KEY_CHECKS = 0`);
    await this.db.execute(`TRUNCATE TABLE ${tableName}`);
    await this.db.execute(`SET FOREIGN_KEY_CHECKS = 1`);
  }

  protected log(message: string): void {
    console.log(`  ${message}`);
  }
}
