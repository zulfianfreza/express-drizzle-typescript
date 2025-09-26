import { AccountPurpose } from '@/types/account-purpose.type';
import { BaseRepository } from './base.repository';
import { lkAccountPurposes } from '@/database/schema/account-purpose.schema';

export class AccountPurposeRepository extends BaseRepository<
  AccountPurpose,
  typeof lkAccountPurposes
> {
  constructor() {
    super(lkAccountPurposes);
  }

  async findByCode(code: string): Promise<AccountPurpose | null> {
    return this.findOne({
      where: {
        code,
      },
    });
  }

  async findActiveOnly(): Promise<AccountPurpose[]> {
    return this.findAllWithoutPaginate({
      is_active: true,
    });
  }
}
