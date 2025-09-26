import { message } from '@/constants/message.constant';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

type Location = 'body' | 'query' | 'params';

export function validate(
  schema: Joi.ObjectSchema,
  location: Location = 'body',
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const target =
      location === 'body'
        ? req.body
        : location === 'query'
        ? req.query
        : req.params;

    const { error, value } = schema.validate(target, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      res.status(400).json({
        message: message.COMMON.VALIDATION_ERROR,
        data: error.details,
      });
      return; // Explicit return untuk menghentikan eksekusi
    }

    // Update request object dengan validated value
    if (location === 'body') req.body = value;
    if (location === 'query') req.query = value as any;
    if (location === 'params') req.params = value as any;

    next();
  };
}
