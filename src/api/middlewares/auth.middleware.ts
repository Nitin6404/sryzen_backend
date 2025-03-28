import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../database/models/user.model';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    User.findByPk(decoded.id)
      .then((user) => {
        if (!user) {
          throw new ApiError(401, 'Invalid token');
        }
        req.user = user;
        next();
      })
      .catch(() => {
        next(new ApiError(401, 'Invalid token'));
      });
  } catch (error) {
    next(new ApiError(401, 'Invalid token'));
  }
};
