import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  reset: number;
}

/**
 * Rate limit utility (per-user or per-IP)
 *
 * @param key Unique key (user ID or IP)
 * @param limit Max requests per window
 * @param windowSec Window in seconds
 *
 * Usage:
 *   const result = await rateLimit(userId, 100, 60);
 *   if (!result.allowed) throw new RateLimitError();
 *
 * Extend for custom strategies (e.g., per-endpoint, per-role)
 */
export async function rateLimit(key: string, limit = 100, windowSec = 60): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSec);
  const redisKey = `ratelimit:${key}:${windowStart}`;
  const count = await redis.incr(redisKey);
  if (count === 1) await redis.expire(redisKey, windowSec);
  const allowed = count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - count),
    limit,
    reset: windowStart + windowSec,
  };
}

export class RateLimitError extends Error {
  status = 429;
  constructor(message = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
  }
}