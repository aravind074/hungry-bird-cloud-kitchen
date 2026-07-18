import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { paymentRateLimiter } from '../middleware/rateLimit.middleware';
import { Order } from '../models/Order.model';
import { Subscription } from '../models/Subscription.model';
import { AppError } from '../middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';
import { env } from '../config/env';

const router = Router();

// ── Razorpay ──────────────────────────────────────────────
router.post('/razorpay/create-order', authenticate, paymentRateLimiter, async (req: AuthRequest, res: Response) => {
  if (!env.RAZORPAY_KEY_ID) throw new AppError('Razorpay not configured', StatusCodes.SERVICE_UNAVAILABLE);

  const Razorpay = require('razorpay');
  const razorpay = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });

  const { amount, currency = 'INR', orderId, subscriptionId } = req.body;
  const rzpOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency,
    receipt: orderId || subscriptionId || `receipt_${Date.now()}`,
  });

  res.json({ success: true, data: { orderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency } });
});

router.post('/razorpay/verify', authenticate, async (req: AuthRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, subscriptionId } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET!).update(body).digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new AppError('Payment verification failed', StatusCodes.BAD_REQUEST);
  }

  // Update order or subscription payment status
  if (orderId) {
    await Order.findByIdAndUpdate(orderId, {
      'payment.status': 'paid',
      'payment.transactionId': razorpay_payment_id,
      'payment.razorpayOrderId': razorpay_order_id,
      'payment.paidAt': new Date(),
      status: 'confirmed',
    });
  }
  if (subscriptionId) {
    await Subscription.findByIdAndUpdate(subscriptionId, {
      'payment.transactionId': razorpay_payment_id,
      'payment.paidAt': new Date(),
      status: 'active',
    });
  }

  res.json({ success: true, message: 'Payment verified', data: { paymentId: razorpay_payment_id } });
});

// ── Stripe ────────────────────────────────────────────────
router.post('/stripe/create-intent', authenticate, paymentRateLimiter, async (req: AuthRequest, res: Response) => {
  if (!env.STRIPE_SECRET_KEY) throw new AppError('Stripe not configured', StatusCodes.SERVICE_UNAVAILABLE);

  const Stripe = require('stripe');
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  const { amount, currency = 'inr', orderId } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: { orderId, userId: req.userId! },
  });

  res.json({ success: true, data: { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id } });
});

// Stripe webhook
router.post('/stripe/webhook', async (req: Request, res: Response) => {
  if (!env.STRIPE_SECRET_KEY) return res.status(200).send();
  const Stripe = require('stripe');
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Webhook signature verification failed');
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const orderId = pi.metadata?.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'payment.status': 'paid',
        'payment.transactionId': pi.id,
        'payment.stripePaymentIntentId': pi.id,
        'payment.paidAt': new Date(),
        status: 'confirmed',
      });
    }
  }

  res.json({ received: true });
});

export default router;
