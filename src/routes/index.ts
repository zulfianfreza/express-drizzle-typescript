import { Router } from 'express';
import accountPurposeRoutes from './account-purpose.routes';

const router = Router();

router.use('/v1/account-purposes', accountPurposeRoutes);

export default router;
