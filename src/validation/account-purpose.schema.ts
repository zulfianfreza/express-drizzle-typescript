import Joi from 'joi';

export const createOrUpdateAccountPurposeSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  is_active: Joi.boolean().default(false),
});
