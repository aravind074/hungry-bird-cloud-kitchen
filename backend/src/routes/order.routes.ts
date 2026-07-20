import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin, isKitchenStaff, isDeliveryPartner } from '../middleware/rbac.middleware';
import { Order } from '../models/Order.model';
import { Cart } from '../models/Cart.model';
import { AppError } from '../middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response, Request } from 'express';
import { io } from '../app';

const router = Router();
router.use(authenticate);

// POST /api/orders - create order from cart or directly from request body items
router.post('/', async (req: AuthRequest, res: Response) => {
  const { deliveryAddress, paymentMethod, couponCode, scheduledFor, items: bodyItems } = req.body;
  
  let orderItems = [];
  let subtotal = 0;
  let discount = 0;

  if (bodyItems && bodyItems.length > 0) {
    orderItems = bodyItems.map((i: any) => ({ ...i, subtotal: i.price * i.quantity }));
    subtotal = bodyItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  } else {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart || cart.items.length === 0) throw new AppError('Cart is empty', StatusCodes.BAD_REQUEST);
    
    orderItems = cart.items.map(i => ({ ...(i as any).toObject(), subtotal: i.price * i.quantity }));
    subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    discount = cart.couponDiscount || 0;
    
    // Clear cart after order
    await Cart.findOneAndUpdate({ userId: req.userId }, { items: [], couponCode: undefined, couponDiscount: 0 });
  }

  const deliveryFee = subtotal >= 299 ? 0 : 49;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst - discount;

  const order = await Order.create({
    userId: req.userId,
    items: orderItems,
    deliveryAddress: deliveryAddress || { street: 'Main St', city: 'City', state: 'State', zipCode: '123456' }, // fallback
    payment: { method: paymentMethod || 'upi', status: paymentMethod === 'cod' ? 'pending' : 'completed' },
    pricing: { subtotal, deliveryFee, packagingFee: 0, discount, gst, total },
    couponCode,
    scheduledFor,
  });

  // Notify kitchen via socket
  io.to('kitchen').emit('new_order', { orderId: order.orderId, total });

  res.status(StatusCodes.CREATED).json({ success: true, data: order });
});

// GET /api/orders – customer: own orders; admin: all
router.get('/', async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter: Record<string, unknown> = {};
  if (req.user?.role === 'customer') filter.userId = req.userId;
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Order.countDocuments(filter),
  ]);
  res.json({ success: true, data: { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
});

// GET /api/orders/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id).populate('deliveryPartnerId', 'name phone avatar currentLocation');
  if (!order) throw new AppError('Order not found', StatusCodes.NOT_FOUND);
  if (req.user?.role === 'customer' && order.userId.toString() !== req.userId) {
    throw new AppError('Access denied', StatusCodes.FORBIDDEN);
  }
  res.json({ success: true, data: order });
});

// PUT /api/orders/:id/status – admin/kitchen/delivery
router.put('/:id/status', async (req: AuthRequest, res: Response) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', StatusCodes.NOT_FOUND);

  order.status = status;
  order.statusHistory.push({ status, timestamp: new Date(), note });
  if (status === 'delivered') order.actualDeliveryTime = new Date();
  await order.save();

  // Real-time notification to customer
  io.to(`user:${order.userId}`).emit('order_status_update', { _id: order._id, status, orderId: order.orderId });

  res.json({ success: true, data: order });
});

// POST /api/orders/:id/cancel
router.post('/:id/cancel', async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', StatusCodes.NOT_FOUND);
  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage', StatusCodes.BAD_REQUEST);
  }
  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), note: req.body.reason });
  await order.save();
  res.json({ success: true, message: 'Order cancelled' });
});

export default router;
