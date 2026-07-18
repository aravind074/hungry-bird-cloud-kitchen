import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';
import { Order } from '../models/Order.model';
import { User } from '../models/User.model';
import { Subscription } from '../models/Subscription.model';
import { MenuItem } from '../models/MenuItem.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';

const router = Router();
router.use(authenticate, isAdmin);

// GET /api/analytics/overview
router.get('/overview', async (_req, res) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [
    totalRevenue, todayRevenue, totalOrders, todayOrders,
    activeSubscriptions, totalUsers, newUsersToday,
  ] = await Promise.all([
    Order.aggregate([{ $match: { 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: today }, 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Subscription.countDocuments({ status: 'active' }),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ createdAt: { $gte: today }, role: 'customer' }),
  ]);

  res.json({
    success: true, data: {
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      totalOrders, todayOrders, activeSubscriptions, totalUsers, newUsersToday,
    },
  });
});

// GET /api/analytics/revenue – last 30 days chart data
router.get('/revenue', async (_req, res) => {
  const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, 'payment.status': 'paid' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$pricing.total' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({ success: true, data });
});

// GET /api/analytics/top-items
router.get('/top-items', async (_req, res) => {
  const items = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.menuItemId', name: { $first: '$items.name' }, orders: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
    { $sort: { orders: -1 } },
    { $limit: 10 },
  ]);
  res.json({ success: true, data: items });
});

export default router;
