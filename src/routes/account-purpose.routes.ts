import { AccountPurposeController } from '@/controllers/account-purpose.controller';
import { queryParserMiddleware } from '@/middleware/query-parser.middleware';
import { validate } from '@/middleware/validate.middleware';
import { createOrUpdateAccountPurposeSchema } from '@/validation/account-purpose.schema';
import { Router } from 'express';

const router = Router();

const controller = new AccountPurposeController();

router.post(
  '/',
  validate(createOrUpdateAccountPurposeSchema),
  controller.create,
);
router.get(
  '/',
  queryParserMiddleware({
    allowedFilters: ['code', 'name', 'is_active', 'created_at'],
    allowedSortFields: ['code', 'name', 'is_active', 'created_at'],
    searchableFields: ['code', 'name'],
  }),
  controller.getAll,
);
router.get('/:id', controller.getById);
router.put(
  '/:id',
  validate(createOrUpdateAccountPurposeSchema),
  controller.update,
);
router.delete('/:id', controller.destroy);

export default router;
