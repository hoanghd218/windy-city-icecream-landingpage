// Vercel KV uses Upstash Redis under the hood.
// Env vars KV_REST_API_URL and KV_REST_API_TOKEN are auto-set by Vercel
// when you connect a KV database to the project.
// For local dev: run `vercel env pull .env.local`.

import { Redis } from '@upstash/redis';

// Lazily create client so build does not fail when env vars are absent.
let _redis = null;

export function getRedis() {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return null; // graceful degrade — caller should handle null
  }
  _redis = new Redis({ url, token });
  return _redis;
}
