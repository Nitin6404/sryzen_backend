import { RequestHandler } from 'express';
import { AuthRequest } from '../../types/auth.types';

export const isAdmin: RequestHandler = (req, res, next): void => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (authReq.user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden - Admin access required' });
    return;
  }

  next();
};
