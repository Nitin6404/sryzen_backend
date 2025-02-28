import { Response, Request, NextFunction } from 'express';
import logger from '../../utils/logger';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error('Application Error:', {
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack
    });

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  logger.error('Unhandled Error:', {
    error: err,
    stack: err.stack
  });

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};