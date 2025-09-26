import Joi from 'joi';

export const createOrUpdateAccountPurposeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
});
