import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { Coupon } from '../models/Coupon.model';
import { AppError } from '../middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';
import { isAdmin } from '../middleware/rbac.middleware';

const router = Router();
router.use(authenticate);

// POST /api/coupons/validate
router.post('/validate', async (req: AuthRequest, res: Response) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new AppError('Invalid coupon code', StatusCodes.NOT_FOUND);

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) throw new AppError('Coupon has expired', StatusCodes.BAD_REQUEST);
  if (coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit) throw new AppError('Coupon usage limit reached', StatusCodes.BAD_REQUEST);
  if (orderAmount < coupon.minOrderAmount) throw new AppError(`Minimum order amount is ₹${coupon.minOrderAmount}`, StatusCodes.BAD_REQUEST);

  const userUseCount = coupon.usedBy.filter(u => u.userId.toString() === req.userId).length;
  if (userUseCount >= coupon.perUserLimit) throw new AppError('You have already used this coupon', StatusCodes.BAD_REQUEST);

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (orderAmount * coupon.value) / 100;
    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
  } else if (coupon.type === 'flat') {
    discount = coupon.value;
  } else if (coupon.type === 'free_delivery') {
    discount = 49; // standard delivery fee
  }

  res.json({ success: true, data: { discount: Math.round(discount), coupon: { code: coupon.code, type: coupon.type, description: coupon.description } } });
});

// Admin CRUD
router.get('/', isAdmin, async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: coupons });
});

router.post('/', isAdmin, async (req: AuthRequest, res: Response) => {
  const coupon = await Coupon.create({ ...req.body, createdBy: req.userId });
  res.status(StatusCodes.CREATED).json({ success: true, data: coupon });
});

router.put('/:id', isAdmin, async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) throw new AppError('Coupon not found', StatusCodes.NOT_FOUND);
  res.json({ success: true, data: coupon });
});

router.delete('/:id', isAdmin, async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Coupon deleted' });
});

export default router;
