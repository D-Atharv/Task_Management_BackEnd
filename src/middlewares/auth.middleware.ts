import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenUtils';

export interface RequestWithUser extends Request {
  user?: any;
}

export const protect = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};