import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Response sent', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};

export const errorLogger = (err: Error, req: Request, _res: Response, next: NextFunction) => {
  logger.error('Error occurred', {
    error: {
      message: err.message,
      stack: err.stack,
    },
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
  });
  next(err);
};
