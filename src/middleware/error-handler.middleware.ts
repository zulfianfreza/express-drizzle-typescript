import { NextFunction, Request, Response } from 'express';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: 'Not found' });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);
  const status = err?.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err?.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
