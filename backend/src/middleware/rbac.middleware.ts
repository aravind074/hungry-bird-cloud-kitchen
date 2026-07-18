import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from './error.middleware';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../models/User.model';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Required roles: ${roles.join(', ')}`,
        StatusCodes.FORBIDDEN
      );
    }
    next();
  };
};

// Convenience role checks
export const isAdmin = authorize('admin');
export const isKitchenStaff = authorize('admin', 'kitchen_staff');
export const isDeliveryPartner = authorize('admin', 'delivery_partner');
export const isCustomer = authorize('customer', 'admin');

// Self or admin – user can only access their own resources unless admin
export const selfOrAdmin = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
  const targetId = req.params.userId || req.params.id;
  if (req.user.role !== 'admin' && req.user._id.toString() !== targetId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN);
  }
  next();
};
