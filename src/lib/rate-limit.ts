import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const buckets = new Map<string, RateLimitBucket>();
const upstashLimiters = new Map<string, Ratelimit>();

export async function checkRateLimit(key: string, limit: number, windowMs: number, now = Date.now()): Promise<RateLimitResult> {
  const upstashLimiter = getUpstashLimiter(limit, windowMs);
  if (upstashLimiter) {
    const result = await upstashLimiter.limit(key);
    return {
      allowed: result.success,
      retryAfterSeconds: result.success ? 0 : Math.max(1, Math.ceil((result.reset - now) / 1000)),
    };
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetRateLimitForTests() {
  buckets.clear();
  upstashLimiters.clear();
}

function getUpstashLimiter(limit: number, windowMs: number) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;

  const cacheKey = `${limit}:${windowMs}`;
  const cached = upstashLimiters.get(cacheKey);
  if (cached) return cached;

  const limiter = new Ratelimit({
    limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
    redis: Redis.fromEnv(),
  });
  upstashLimiters.set(cacheKey, limiter);
  return limiter;
}
