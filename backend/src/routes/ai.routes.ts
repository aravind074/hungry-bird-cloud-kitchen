import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimit.middleware';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';
import axios from 'axios';

const router = Router();
router.use(authenticate, aiRateLimiter);

const aiCall = async (endpoint: string, data: unknown) => {
  const response = await axios.post(`${env.AI_SERVICE_URL}${endpoint}`, data, {
    headers: { 'X-API-Key': env.AI_SERVICE_API_KEY || '' },
    timeout: 10000,
  });
  return response.data;
};

router.get('/recommendations', async (req: AuthRequest, res: Response) => {
  try {
    const result = await aiCall('/ai/recommendations', { userId: req.userId });
    res.json({ success: true, data: result });
  } catch {
    res.json({ success: true, data: { recommendations: [], fallback: true } });
  }
});

router.post('/eta', async (req, res) => {
  try {
    const result = await aiCall('/ai/eta', req.body);
    res.json({ success: true, data: result });
  } catch {
    res.json({ success: true, data: { eta_minutes: 45, fallback: true } });
  }
});

router.get('/demand-forecast', async (_req, res) => {
  try {
    const result = await aiCall('/ai/demand-forecast', {});
    res.json({ success: true, data: result });
  } catch {
    res.json({ success: true, data: { forecast: [], fallback: true } });
  }
});

export default router;
