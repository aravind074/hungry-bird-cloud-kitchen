import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { Review } from '../models/Review.model';
import { Order } from '../models/Order.model';
import { AppError } from '../middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';

const router = Router();

router.get('/:menuItemId', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [reviews, total] = await Promise.all([
    Review.find({ menuItemId: req.params.menuItemId, isHidden: false })
      .populate('userId', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Review.countDocuments({ menuItemId: req.params.menuItemId, isHidden: false }),
  ]);
  res.json({ success: true, data: { reviews, total } });
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { menuItemId, orderId, rating, title, comment, images } = req.body;
  const order = await Order.findById(orderId);
  if (!order || order.userId.toString() !== req.userId) throw new AppError('Invalid order', StatusCodes.BAD_REQUEST);
  if (order.status !== 'delivered') throw new AppError('Can only review delivered orders', StatusCodes.BAD_REQUEST);
  if (order.isRated) throw new AppError('Order already rated', StatusCodes.BAD_REQUEST);

  const review = await Review.create({ userId: req.userId, menuItemId, orderId, rating, title, comment, images });
  await Order.findByIdAndUpdate(orderId, { isRated: true });
  res.status(StatusCodes.CREATED).json({ success: true, data: review });
});

export default router;
