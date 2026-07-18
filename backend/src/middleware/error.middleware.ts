import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong';
  let errors: unknown[] = [];

  // Known operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation error';
    errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
  }
  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation error';
    // @ts-ignore
    errors = Object.values(err.errors).map((e: any) => ({ field: e.path, message: e.message }));
  }
  // Mongoose duplicate key
  else if ((err as any).code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    const field = Object.keys((err as any).keyValue || {})[0] || 'field';
    message = `${field} already exists`;
  }
  // Mongoose cast error (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Invalid ID format';
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Invalid token';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Log non-operational errors
  if (!(err instanceof AppError)) {
    logger.error('Unhandled error:', { message: err.message, stack: err.stack, url: req.url });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
