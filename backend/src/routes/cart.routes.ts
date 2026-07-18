import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { Cart } from '../models/Cart.model';
import { MenuItem } from '../models/MenuItem.model';
import { AppError } from '../middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';

const router = Router();
router.use(authenticate);

// GET /api/cart
router.get('/', async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ userId: req.userId }).populate('items.menuItemId', 'name thumbnail price isAvailable');
  res.json({ success: true, data: cart || { items: [], savedForLater: [] } });
});

// POST /api/cart/add
router.post('/add', async (req: AuthRequest, res: Response) => {
  const { menuItemId, quantity = 1, customizations, specialInstructions } = req.body;
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) throw new AppError('Menu item not found', StatusCodes.NOT_FOUND);
  if (!menuItem.isAvailable) throw new AppError('Item is not available', StatusCodes.BAD_REQUEST);

  let cart = await Cart.findOne({ userId: req.userId });
  if (!cart) cart = new Cart({ userId: req.userId, items: [] });

  const existingIdx = cart.items.findIndex(i => i.menuItemId.toString() === menuItemId);
  if (existingIdx > -1) {
    cart.items[existingIdx].quantity += quantity;
  } else {
    cart.items.push({ menuItemId, name: menuItem.name, thumbnail: menuItem.thumbnail, price: menuItem.price, quantity, customizations, specialInstructions });
  }

  await cart.save();
  res.json({ success: true, data: cart });
});

// PUT /api/cart/update
router.put('/update', async (req: AuthRequest, res: Response) => {
  const { itemId, quantity } = req.body;
  const cart = await Cart.findOne({ userId: req.userId });
  if (!cart) throw new AppError('Cart not found', StatusCodes.NOT_FOUND);

  if (quantity === 0) {
    cart.items = cart.items.filter(i => i._id?.toString() !== itemId) as any;
  } else {
    const item = cart.items.find(i => i._id?.toString() === itemId);
    if (item) item.quantity = quantity;
  }
  await cart.save();
  res.json({ success: true, data: cart });
});

// DELETE /api/cart/clear
router.delete('/clear', async (req: AuthRequest, res: Response) => {
  await Cart.findOneAndUpdate({ userId: req.userId }, { items: [], couponCode: undefined, couponDiscount: 0 });
  res.json({ success: true, message: 'Cart cleared' });
});

export default router;
