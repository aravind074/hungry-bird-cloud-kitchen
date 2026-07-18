import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { isDeliveryPartner } from '../middleware/rbac.middleware';
import { Order } from '../models/Order.model';
import { User } from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';
import { io } from '../app';

const router = Router();
router.use(authenticate);

// GET /api/delivery/assignments – delivery partner's active assignments
router.get('/assignments', isDeliveryPartner, async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({
    deliveryPartnerId: req.userId,
    status: { $in: ['picked_up', 'out_for_delivery'] },
  }).lean();
  res.json({ success: true, data: orders });
});

// GET /api/delivery/available – admin assigns delivery partner
router.get('/available', async (_req, res) => {
  const partners = await User.find({ role: 'delivery_partner', isActive: true, isAvailable: true }).select('name phone avatar currentLocation').lean();
  res.json({ success: true, data: partners });
});

// PUT /api/delivery/:id/assign – admin assigns delivery partner to order
router.put('/:id/assign', async (req: AuthRequest, res: Response) => {
  const { partnerId } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, {
    deliveryPartnerId: partnerId,
    status: 'picked_up',
  }, { new: true });

  // Notify delivery partner
  io.to(`user:${partnerId}`).emit('new_assignment', { orderId: order?._id, orderNumber: order?.orderId });
  res.json({ success: true, data: order });
});

// PUT /api/delivery/:id/status – delivery partner updates status
router.put('/:id/status', isDeliveryPartner, async (req: AuthRequest, res: Response) => {
  const { status, deliveryOtp } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  if (status === 'delivered') {
    if (order.deliveryOtp && order.deliveryOtp !== deliveryOtp) {
      return res.status(400).json({ success: false, message: 'Invalid delivery OTP' });
    }
    order.actualDeliveryTime = new Date();
  }

  order.status = status;
  order.statusHistory.push({ status, timestamp: new Date() });
  await order.save();

  io.to(`user:${order.userId}`).emit('order_status_update', { orderId: order._id, status });
  res.json({ success: true, data: order });
});

// PUT /api/delivery/location – delivery partner updates live location
router.put('/location', isDeliveryPartner, async (req: AuthRequest, res: Response) => {
  const { lat, lng, orderId } = req.body;
  await User.findByIdAndUpdate(req.userId, { currentLocation: { lat, lng } });
  if (orderId) io.to(`order:${orderId}`).emit('delivery_location', { lat, lng, timestamp: new Date() });
  res.json({ success: true });
});

export default router;
