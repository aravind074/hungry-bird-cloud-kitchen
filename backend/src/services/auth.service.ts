import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User.model';
import { env } from '../config/env';
import { cacheDel, cacheSet } from '../config/redis';
import { AppError } from '../middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { verifyFirebaseToken } from '../config/firebase';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  firebaseUid?: string;
}

// ── Token Generation ──────────────────────────────────────
const generateAccessToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const generateTokenPair = async (user: IUser): Promise<TokenPair> => {
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  // Store hashed refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

// ── Register ──────────────────────────────────────────────
export const registerUser = async (data: RegisterData): Promise<{ user: IUser; tokens: TokenPair }> => {
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) throw new AppError('Email already registered', StatusCodes.CONFLICT);

  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash: data.password,
    phone: data.phone,
    role: data.role || 'customer',
    firebaseUid: data.firebaseUid,
    isEmailVerified: !!data.firebaseUid,
  });

  const tokens = await generateTokenPair(user);
  return { user, tokens };
};

// ── Login with Email/Password ─────────────────────────────
export const loginWithPassword = async (
  email: string,
  password: string
): Promise<{ user: IUser; tokens: TokenPair }> => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash +refreshToken');
  if (!user) throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
  if (!user.isActive) throw new AppError('Account is deactivated', StatusCodes.FORBIDDEN);

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);

  user.lastLogin = new Date();
  const tokens = await generateTokenPair(user);
  return { user, tokens };
};

// ── Login with Firebase Token ─────────────────────────────
export const loginWithFirebase = async (
  idToken: string
): Promise<{ user: IUser; tokens: TokenPair; isNew: boolean }> => {
  let decoded;
  try {
    decoded = await verifyFirebaseToken(idToken);
  } catch {
    throw new AppError('Invalid Firebase token', StatusCodes.UNAUTHORIZED);
  }

  let isNew = false;
  let user = await User.findOne({
    $or: [{ firebaseUid: decoded.uid }, { email: decoded.email }],
  }).select('+refreshToken');

  if (!user) {
    user = await User.create({
      firebaseUid: decoded.uid,
      name: decoded.name || decoded.email?.split('@')[0] || 'User',
      email: decoded.email!,
      avatar: decoded.picture,
      isEmailVerified: decoded.email_verified ?? false,
      role: 'customer',
    });
    isNew = true;
  } else if (!user.firebaseUid) {
    user.firebaseUid = decoded.uid;
    user.isEmailVerified = true;
  }

  user.lastLogin = new Date();
  const tokens = await generateTokenPair(user);
  return { user, tokens, isNew };
};

// ── Refresh Tokens ────────────────────────────────────────
export const refreshAccessToken = async (
  refreshToken: string
): Promise<TokenPair> => {
  let decoded: { userId: string };
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    throw new AppError('Invalid refresh token', StatusCodes.UNAUTHORIZED);
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError('Refresh token mismatch', StatusCodes.UNAUTHORIZED);
  }

  return generateTokenPair(user);
};

// ── Logout ────────────────────────────────────────────────
export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  await cacheDel(`user:${userId}`);
};

// ── Cache user session ────────────────────────────────────
export const cacheUserSession = async (user: IUser): Promise<void> => {
  await cacheSet(`user:${user._id}`, user.toJSON(), 300);
};
