import {
  AccountPurpose,
  CreateAccountPurpose,
  UpdateAccountPurpose,
} from '@/types/account-purpose.type';
import { BaseService } from '../base.service';
import { lkAccountPurposes } from '@/database/schema/account-purpose.schema';
import { AccountPurposeRepository } from '@/repositories/account-purpose.repository';
import ApiError from '@/utils/api-error';
import httpStatus from 'http-status';

export class AccountPurposeService extends BaseService<
  AccountPurpose,
  typeof lkAccountPurposes,
  AccountPurposeRepository
> {
  constructor(repository: AccountPurposeRepository) {
    super(repository);
  }

  // Custom business logic methods
  async createAccountPurpose(
    data: CreateAccountPurpose,
  ): Promise<AccountPurpose> {
    // Check if code already exists
    const existing = await this.repository.findByCode(data.code);
    if (existing)
      throw new ApiError(
        httpStatus.CONFLICT,
        `Account purpose with code '${data.code}' already exists`,
      );

    return this.create(data);
  }

  async updateAccountPurpose(
    id: number,
    data: UpdateAccountPurpose,
  ): Promise<AccountPurpose> {
    // Check if account purpose exists
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Account purpose not found');
    }

    // Check if code is being changed and already exists
    if (data.code && data.code !== existing.code) {
      const codeExists = await this.repository.findByCode(data.code);
      if (codeExists) {
        throw new Error(
          `Account purpose with code '${data.code}' already exists`,
        );
      }
    }

    return this.update(id, data);
  }

  async getActiveAccountPurposes(): Promise<AccountPurpose[]> {
    return this.repository.findActiveOnly();
  }

  async toggleStatus(id: number): Promise<AccountPurpose> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Account purpose not found');
    }

    return this.update(id, {
      is_active: !existing.is_active,
    });
  }
}
