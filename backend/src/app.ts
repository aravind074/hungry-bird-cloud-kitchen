import 'express-async-errors';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { Server as SocketIOServer } from 'socket.io';

import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import { initFirebaseAdmin } from './config/firebase';
import { logger } from './config/logger';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { generalRateLimiter } from './middleware/rateLimit.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import menuRoutes from './routes/menu.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import subscriptionRoutes from './routes/subscription.routes';
import paymentRoutes from './routes/payment.routes';
import deliveryRoutes from './routes/delivery.routes';
import analyticsRoutes from './routes/analytics.routes';
import inventoryRoutes from './routes/inventory.routes';
import couponRoutes from './routes/coupon.routes';
import reviewRoutes from './routes/review.routes';
import notificationRoutes from './routes/notification.routes';
import userRoutes from './routes/user.routes';
import aiRoutes from './routes/ai.routes';

import { initSocketService } from './services/socket.service';

const app = express();
const server = http.createServer(app);

// ── Socket.IO ──────────────────────────────────────────────
const io = new SocketIOServer(server, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
});
initSocketService(io);

// ── Global Middleware ──────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.razorpay.com', 'https://api.stripe.com'],
      frameSrc: ["'self'", 'https://api.razorpay.com', 'https://js.stripe.com'],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      scriptSrc: ["'self'", 'https://checkout.razorpay.com', 'https://js.stripe.com'],
    },
  },
}));

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(generalRateLimiter);

// ── Health Check ───────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Hungry Bird API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ─────────────────────────────────────────────
const API = '/api';
app.use(`${API}/auth`, authRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/menu`, menuRoutes);
app.use(`${API}/cart`, cartRoutes);
app.use(`${API}/orders`, orderRoutes);
app.use(`${API}/subscriptions`, subscriptionRoutes);
app.use(`${API}/payments`, paymentRoutes);
app.use(`${API}/delivery`, deliveryRoutes);
app.use(`${API}/analytics`, analyticsRoutes);
app.use(`${API}/inventory`, inventoryRoutes);
app.use(`${API}/coupons`, couponRoutes);
app.use(`${API}/reviews`, reviewRoutes);
app.use(`${API}/notifications`, notificationRoutes);
app.use(`${API}/ai`, aiRoutes);

// ── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error Handler ──────────────────────────────────────────
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────────
const bootstrap = async () => {
  try {
    await connectDB();
    await connectRedis();
    initFirebaseAdmin();

    server.listen(env.PORT, () => {
      logger.info(`🚀 Hungry Bird API running on port ${env.PORT}`);
      logger.info(`📚 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();

export { app, io };
