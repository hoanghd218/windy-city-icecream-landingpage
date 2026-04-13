// Sliding window rate limiter, 20 requests per 60 seconds per IP.
// Backed by Vercel KV (Upstash Redis). Returns { success: true } no-op
// when KV is unavailable so local dev without env still works.

import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from './kv-client';

let _limiter = null;

function getLimiter() {
  if (_limiter) return _limiter;
  const redis = getRedis();
  if (!redis) return null;
  _limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '60 s'),
    analytics: true,
    prefix: 'rl:chat',
  });
  return _limiter;
}

export async function checkChatRateLimit(identifier) {
  const limiter = getLimiter();
  if (!limiter) {
    return { success: true, remaining: Infinity, reset: 0, limit: Infinity };
  }
  return limiter.limit(identifier);
}
