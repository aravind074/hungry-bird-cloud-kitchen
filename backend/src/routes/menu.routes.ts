import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/rbac.middleware';
import { MenuItem } from '../models/MenuItem.model';
import { cacheGet, cacheSet, cacheDel } from '../config/redis';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response, Request } from 'express';

const router = Router();

// GET /api/menu – public, cached
router.get('/', async (req: Request, res: Response) => {
  const { category, search, dietaryTags, minPrice, maxPrice, mealType, page = 1, limit = 20, sort = '-rating' } = req.query;
  const cacheKey = `menu:${JSON.stringify(req.query)}`;

  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ success: true, data: cached, fromCache: true });

  const filter: Record<string, unknown> = { isAvailable: true };
  if (category) filter.category = category;
  if (dietaryTags) filter.dietaryTags = { $in: (dietaryTags as string).split(',') };
  if (mealType) filter.mealType = { $in: (mealType as string).split(',') };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) (filter.price as any).$gte = Number(minPrice);
    if (maxPrice) (filter.price as any).$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search as string };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    MenuItem.find(filter).sort(sort as string).skip(skip).limit(Number(limit)).lean(),
    MenuItem.countDocuments(filter),
  ]);

  const data = { items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) };
  await cacheSet(cacheKey, data, 300); // 5 min cache
  res.json({ success: true, data });
});

// GET /api/menu/categories
router.get('/categories', async (_req, res) => {
  const cached = await cacheGet('menu:categories');
  if (cached) return res.json({ success: true, data: cached });
  const cats = await MenuItem.distinct('category', { isAvailable: true });
  await cacheSet('menu:categories', cats, 600);
  res.json({ success: true, data: cats });
});

// GET /api/menu/featured
router.get('/featured', async (_req, res) => {
  const items = await MenuItem.find({ isFeatured: true, isAvailable: true }).limit(10).lean();
  res.json({ success: true, data: items });
});

// GET /api/menu/:id
router.get('/:id', async (req, res) => {
  const item = await MenuItem.findById(req.params.id).lean();
  if (!item) throw new AppError('Menu item not found', StatusCodes.NOT_FOUND);
  res.json({ success: true, data: item });
});

// POST /api/menu – admin only
router.post('/', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
  const item = await MenuItem.create(req.body);
  await cacheDel('menu:categories');
  res.status(StatusCodes.CREATED).json({ success: true, data: item });
});

// PUT /api/menu/:id – admin only
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) throw new AppError('Menu item not found', StatusCodes.NOT_FOUND);
  await cacheDel('menu:categories');
  res.json({ success: true, data: item });
});

// DELETE /api/menu/:id – admin only
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Menu item deleted' });
});

export default router;
