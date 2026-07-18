import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { isKitchenStaff } from '../middleware/rbac.middleware';
import { Inventory } from '../models/Inventory.model';
import { AppError } from '../middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';

const router = Router();
router.use(authenticate, isKitchenStaff);

router.get('/', async (_req, res) => {
  const items = await Inventory.find({ isActive: true }).sort({ currentStock: 1 }).lean();
  const lowStock = items.filter(i => i.currentStock <= i.minStockLevel);
  res.json({ success: true, data: { items, lowStock, lowStockCount: lowStock.length } });
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const item = await Inventory.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: item });
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { quantity, type, reason } = req.body;
  const item = await Inventory.findById(req.params.id);
  if (!item) throw new AppError('Inventory item not found', StatusCodes.NOT_FOUND);

  if (type === 'add') item.currentStock += quantity;
  else if (type === 'remove') {
    if (item.currentStock < quantity) throw new AppError('Insufficient stock', StatusCodes.BAD_REQUEST);
    item.currentStock -= quantity;
  } else item.currentStock = quantity;

  item.transactions.push({ type, quantity, reason, performedBy: req.user!._id, timestamp: new Date() });
  if (type === 'add') item.lastRestockedAt = new Date();
  await item.save();
  res.json({ success: true, data: item });
});

export default router;
