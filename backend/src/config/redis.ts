import Redis from 'ioredis';
import { logger } from './logger';
import { env } from './env';

let redisClient: Redis | null = null;

export const connectRedis = async (): Promise<Redis> => {
  if (redisClient) return redisClient;

  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 5) {
        logger.error('Redis: Max retries exceeded');
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  await client.connect();

  client.on('connect', () => logger.info('✅ Redis connected'));
  client.on('error', (err) => logger.error('Redis error:', err));
  client.on('reconnecting', () => logger.warn('Redis reconnecting...'));

  redisClient = client;
  return client;
};

export const getRedis = (): Redis => {
  if (!redisClient) throw new Error('Redis not connected. Call connectRedis() first.');
  return redisClient;
};

// ── Cache Helpers ──────────────────────────────────────────
export const cacheSet = async (key: string, value: unknown, ttlSeconds = 3600): Promise<void> => {
  const redis = getRedis();
  await redis.setex(key, ttlSeconds, JSON.stringify(value));
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  const redis = getRedis();
  const data = await redis.get(key);
  return data ? JSON.parse(data) as T : null;
};

export const cacheDel = async (...keys: string[]): Promise<void> => {
  const redis = getRedis();
  if (keys.length > 0) await redis.del(...keys);
};

export const cacheFlushPattern = async (pattern: string): Promise<void> => {
  const redis = getRedis();
  const keys = await redis.keys(pattern);
  if (keys.length > 0) await redis.del(...keys);
};
