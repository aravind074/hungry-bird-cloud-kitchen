import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';
import { Subscription } from '../models/Subscription.model';
import { AppError } from '../middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';
import { addDays } from '../utils/date.utils';

const router = Router();
router.use(authenticate);

const PLAN_PRICES: Record<string, Record<number, number>> = {
  breakfast: { 15: 1799, 30: 2999, 90: 7499 },
  lunch:     { 15: 2699, 30: 4499, 90: 11999 },
  dinner:    { 15: 2699, 30: 4499, 90: 11999 },
  full_day:  { 15: 5999, 30: 9999, 90: 24999 },
};

// POST /api/subscriptions – create new subscription
router.post('/', async (req: AuthRequest, res: Response) => {
  const { plan, duration, deliveryAddress, deliverySlot, dietaryPreferences, allergies, autoRenew, paymentMethod } = req.body;

  const basePrice = PLAN_PRICES[plan]?.[duration];
  if (!basePrice) throw new AppError('Invalid plan or duration', StatusCodes.BAD_REQUEST);

  const discount = duration === 90 ? basePrice * 0.1 : duration === 30 ? basePrice * 0.05 : 0;
  const startDate = new Date();
  const endDate = addDays(startDate, duration);

  const subscription = await Subscription.create({
    userId: req.userId,
    plan, duration, startDate, endDate,
    deliveryAddress, deliverySlot, dietaryPreferences, allergies,
    autoRenew: autoRenew ?? true,
    pricing: {
      pricePerDay: Math.round(basePrice / duration),
      totalPrice: basePrice,
      discount: Math.round(discount),
      finalPrice: Math.round(basePrice - discount),
    },
    payment: { method: paymentMethod },
    status: 'pending_payment',
  });

  res.status(StatusCodes.CREATED).json({ success: true, data: subscription });
});

// GET /api/subscriptions – customer: own; admin: all
router.get('/', async (req: AuthRequest, res: Response) => {
  const filter = req.user?.role === 'customer' ? { userId: req.userId } : {};
  const subs = await Subscription.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: subs });
});

// GET /api/subscriptions/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const sub = await Subscription.findById(req.params.id);
  if (!sub) throw new AppError('Subscription not found', StatusCodes.NOT_FOUND);
  if (req.user?.role === 'customer' && sub.userId.toString() !== req.userId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN);
  }
  res.json({ success: true, data: sub });
});

// PUT /api/subscriptions/:id/pause
router.put('/:id/pause', async (req: AuthRequest, res: Response) => {
  const sub = await Subscription.findOne({ _id: req.params.id, userId: req.userId });
  if (!sub) throw new AppError('Subscription not found', StatusCodes.NOT_FOUND);
  if (sub.status !== 'active') throw new AppError('Only active subscriptions can be paused', StatusCodes.BAD_REQUEST);
  if (sub.pausedDaysUsed >= sub.maxPauseDays) throw new AppError(`Maximum pause days (${sub.maxPauseDays}) reached`, StatusCodes.BAD_REQUEST);

  sub.status = 'paused';
  sub.pausedDaysUsed += 1;
  sub.pausedDays.push(new Date(req.body.date));
  await sub.save();
  res.json({ success: true, data: sub });
});

// PUT /api/subscriptions/:id/resume
router.put('/:id/resume', async (req: AuthRequest, res: Response) => {
  const sub = await Subscription.findOne({ _id: req.params.id, userId: req.userId });
  if (!sub) throw new AppError('Subscription not found', StatusCodes.NOT_FOUND);
  sub.status = 'active';
  await sub.save();
  res.json({ success: true, data: sub });
});

// PUT /api/subscriptions/:id/cancel
router.put('/:id/cancel', async (req: AuthRequest, res: Response) => {
  const sub = await Subscription.findOne({ _id: req.params.id, userId: req.userId });
  if (!sub) throw new AppError('Subscription not found', StatusCodes.NOT_FOUND);
  sub.status = 'cancelled';
  sub.cancelledAt = new Date();
  sub.cancellationReason = req.body.reason;
  await sub.save();
  res.json({ success: true, message: 'Subscription cancelled' });
});

// GET /api/subscriptions/:id/schedule – meal schedule calendar
router.get('/:id/schedule', async (req: AuthRequest, res: Response) => {
  const sub = await Subscription.findById(req.params.id).populate('mealSchedule.menuItemId', 'name thumbnail');
  if (!sub) throw new AppError('Subscription not found', StatusCodes.NOT_FOUND);
  res.json({ success: true, data: sub.mealSchedule });
});

export default router;
