import { Request, Response, NextFunction } from 'express';
import { JwtUserPayload } from '../../types/user';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
      }

      req.user = decoded as JwtUserPayload;
      next();
    });
  } catch (err) {
    next(err); // for unexpected errors
  }
};

export const roleMiddleware = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
