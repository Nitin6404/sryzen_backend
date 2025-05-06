import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ApiError } from '../utils/ApiError';

export const validateRequest = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  };
};
