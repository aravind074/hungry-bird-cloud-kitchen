import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { body, validationResult } from 'express-validator';
import {
  registerUser,
  loginWithPassword,
  loginWithFirebase,
  refreshAccessToken,
  logoutUser,
} from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const setTokenCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
};

const clearTokenCookies = (res: Response): void => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

// ── Register ─────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone } = req.body;

  const { user, tokens } = await registerUser({ name, email, password, phone });
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken: tokens.accessToken,
    },
  });
};

// ── Login ─────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const { user, tokens } = await loginWithPassword(email, password);
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
      },
      accessToken: tokens.accessToken,
    },
  });
};

// ── Firebase Login ────────────────────────────────────────
export const firebaseLogin = async (req: Request, res: Response): Promise<void> => {
  const { idToken } = req.body;
  if (!idToken) throw new AppError('Firebase ID token required', StatusCodes.BAD_REQUEST);

  const { user, tokens, isNew } = await loginWithFirebase(idToken);
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  res.status(isNew ? StatusCodes.CREATED : StatusCodes.OK).json({
    success: true,
    message: isNew ? 'Account created successfully' : 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isNew,
      },
      accessToken: tokens.accessToken,
    },
  });
};

// ── Refresh Token ─────────────────────────────────────────
export const refresh = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new AppError('Refresh token required', StatusCodes.UNAUTHORIZED);

  const tokens = await refreshAccessToken(token);
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  res.json({
    success: true,
    data: { accessToken: tokens.accessToken },
  });
};

// ── Logout ────────────────────────────────────────────────
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.userId) await logoutUser(req.userId);
  clearTokenCookies(res);
  res.json({ success: true, message: 'Logged out successfully' });
};

// ── Me ────────────────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: { user: req.user },
  });
};

// ── Validation Rules ──────────────────────────────────────
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const checkValidation = (req: Request, _res: Response, next: any): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors.array().map(e => e.msg).join(', '),
      StatusCodes.BAD_REQUEST
    );
  }
  next();
};
