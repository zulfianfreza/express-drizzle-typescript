import { Request, Response } from 'express';
import {
  AccountPurpose,
  CreateAccountPurpose,
  UpdateAccountPurpose,
} from '@/types/account-purpose.type';
import { AccountPurposeService } from '@/services/internal/account-purpose.service';
import { AccountPurposeRepository } from '@/repositories/account-purpose.repository';
import catchAsync from '@/utils/catch-async';
import { convertToQueryOptions } from '@/utils/query';
import apiResponse from '@/utils/api-response';
import { message } from '@/constants/message.constant';
import ApiError from '@/utils/api-error';
import httpStatus from 'http-status';

export class AccountPurposeController {
  private accountPurposeService: AccountPurposeService;

  constructor() {
    const accountPurposeRepository = new AccountPurposeRepository();
    this.accountPurposeService = new AccountPurposeService(
      accountPurposeRepository,
    );
  }

  getAll = catchAsync(async (req: Request, res: Response) => {
    const queryOptions = convertToQueryOptions<AccountPurpose>(
      (req as any).parsedQuery || req.query,
    );

    const result = await this.accountPurposeService.findAll(queryOptions);

    apiResponse(res, message.COMMON.OK, result);
  });

  getById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.accountPurposeService.findById(parseInt(id));

    if (!result)
      throw new ApiError(httpStatus.NOT_FOUND, 'Account purpose not found');

    apiResponse(res, message.COMMON.OK, result);
  });

  getActive = catchAsync(async (req: Request, res: Response) => {
    const result = await this.accountPurposeService.getActiveAccountPurposes();

    apiResponse(res, message.COMMON.OK, result);
  });

  create = catchAsync(
    async (req: Request<{}, {}, CreateAccountPurpose>, res: Response) => {
      const data = req.body;
      const result = await this.accountPurposeService.createAccountPurpose(
        data,
      );

      apiResponse(res, message.COMMON.CREATED, result, httpStatus.CREATED);
    },
  );

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const result = await this.accountPurposeService.updateAccountPurpose(
      parseInt(id),
      data,
    );

    apiResponse(res, message.COMMON.UPDATED, result);
  });

  toggleStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.accountPurposeService.toggleStatus(parseInt(id));

    apiResponse(res, message.COMMON.UPDATED, result);
  });

  destroy = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.accountPurposeService.delete(parseInt(id));

    if (!result)
      throw new ApiError(httpStatus.NOT_FOUND, 'Account purpose not found');

    apiResponse(res, message.COMMON.DELETED, result);
  });
}
