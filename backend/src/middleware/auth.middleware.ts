import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.model';
import { env } from '../config/env';
import { cacheGet, cacheSet } from '../config/redis';
import { AppError } from './error.middleware';
import { StatusCodes } from 'http-status-codes';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try cookie first, then Authorization header
    let token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
    }

    // Verify JWT
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string; iat: number };

    // Check cache first
    const cachedUser = await cacheGet<IUser>(`user:${decoded.userId}`);
    if (cachedUser) {
      req.user = cachedUser;
      req.userId = decoded.userId;
      return next();
    }

    // Fetch from DB
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user) throw new AppError('User not found', StatusCodes.UNAUTHORIZED);
    if (!user.isActive) throw new AppError('Account is deactivated', StatusCodes.FORBIDDEN);

    // Cache for 5 minutes
    await cacheSet(`user:${decoded.userId}`, user.toJSON(), 300);

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};

// Optional auth – doesn't fail if no token
export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (user && user.isActive) {
      req.user = user;
      req.userId = user._id.toString();
    }
  } catch {
    // Ignore errors – it's optional
  }
  next();
};
