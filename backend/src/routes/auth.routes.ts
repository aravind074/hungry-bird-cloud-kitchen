import { Router } from 'express';
import {
  register, login, firebaseLogin, refresh, logout, getMe,
  registerValidation, loginValidation, checkValidation,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', authRateLimiter, registerValidation, checkValidation, register);
router.post('/login', authRateLimiter, loginValidation, checkValidation, login);
router.post('/firebase', authRateLimiter, firebaseLogin);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
