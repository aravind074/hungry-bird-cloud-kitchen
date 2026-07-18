import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { User } from '../models/User.model';
import { AppError } from '../middleware/error.middleware';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';
import { isAdmin } from '../middleware/rbac.middleware';
import { cacheDel } from '../config/redis';

const router = Router();
router.use(authenticate);

// GET /api/users/profile
router.get('/profile', async (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: req.user });
});

// PUT /api/users/profile
router.put('/profile', async (req: AuthRequest, res: Response) => {
  const { name, phone, avatar, dietaryPreferences, allergies } = req.body;
  const user = await User.findByIdAndUpdate(req.userId, { name, phone, avatar, dietaryPreferences, allergies }, { new: true, runValidators: true });
  await cacheDel(`user:${req.userId}`);
  res.json({ success: true, data: user });
});

// POST /api/users/addresses
router.post('/addresses', async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);
  if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, data: user.addresses });
});

// DELETE /api/users/addresses/:addressId
router.delete('/addresses/:addressId', async (req: AuthRequest, res: Response) => {
  await User.findByIdAndUpdate(req.userId, { $pull: { addresses: { _id: req.params.addressId } } });
  res.json({ success: true, message: 'Address removed' });
});

// PUT /api/users/fcm-token
router.put('/fcm-token', async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  await User.findByIdAndUpdate(req.userId, { $addToSet: { fcmTokens: token } });
  res.json({ success: true });
});

// Admin: list all users
router.get('/', isAdmin, async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;
  if (search) filter.$or = [{ name: new RegExp(search as string, 'i') }, { email: new RegExp(search as string, 'i') }];
  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(filter),
  ]);
  res.json({ success: true, data: { users, total } });
});

// Admin: toggle user active status
router.put('/:id/toggle-active', isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);
  user.isActive = !user.isActive;
  await user.save();
  await cacheDel(`user:${user._id}`);
  res.json({ success: true, data: { isActive: user.isActive } });
});

export default router;
