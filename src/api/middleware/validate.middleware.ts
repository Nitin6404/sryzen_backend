import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { RequestHandler } from 'express';

export const validateRequest = (
  schema: Schema,
  property: 'body' | 'query' | 'params' = 'body',
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error } = schema.validate(req[property], { abortEarly: false });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors,
        });
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
