import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { Notification } from '../models/Notification.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ userId: req.userId }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Notification.countDocuments({ userId: req.userId }),
    Notification.countDocuments({ userId: req.userId, isRead: false }),
  ]);
  res.json({ success: true, data: { notifications, total, unreadCount } });
});

router.put('/:id/read', async (req: AuthRequest, res: Response) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { isRead: true, readAt: new Date() });
  res.json({ success: true });
});

router.put('/read-all', async (req: AuthRequest, res: Response) => {
  await Notification.updateMany({ userId: req.userId, isRead: false }, { isRead: true, readAt: new Date() });
  res.json({ success: true, message: 'All notifications marked as read' });
});

export default router;
