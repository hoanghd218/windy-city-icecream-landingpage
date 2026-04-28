// Resolves a US ZIP code to one-way driving time in minutes from the warehouse,
// using Google Distance Matrix API. Caches results in Vercel KV (30 days).

import { getRedis } from './kv-client';

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
// v2: peak-traffic durations (pessimistic). Bumped from v1 (free-flow) so
// stale free-flow estimates are not served from cache.
const CACHE_PREFIX = 'travel:v2:';

export async function getTravelTimeFromZip(zipCode, streetAddress = '') {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const origin = process.env.WAREHOUSE_ADDRESS;

  if (!apiKey || !origin) {
    return { error: 'Travel time service not configured', zipCode };
  }

  // Build destination: prefer "street, zip, USA" when address provided
  const destination = streetAddress
    ? `${streetAddress.trim()}, ${zipCode}, USA`
    : `${zipCode}, USA`;

  // Cache by ZIP only — street precision rarely changes the tier-based fee
  const redis = getRedis();
  const cacheKey = `${CACHE_PREFIX}${zipCode}`;
  if (redis && !streetAddress) {
    const cached = await redis.get(cacheKey);
    if (cached) return cached;
  }

  // Call Google Distance Matrix.
  // We bill on PEAK traffic, not free-flow, so we ask for a pessimistic
  // traffic model. departure_time=now is required to enable traffic data;
  // traffic_model=pessimistic returns the upper-bound (rush-hour) estimate.
  const url =
    `https://maps.googleapis.com/maps/api/distancematrix/json` +
    `?origins=${encodeURIComponent(origin)}` +
    `&destinations=${encodeURIComponent(destination)}` +
    `&units=imperial` +
    `&departure_time=now` +
    `&traffic_model=pessimistic` +
    `&key=${apiKey}`;

  let data;
  try {
    const res = await fetch(url);
    data = await res.json();
  } catch (err) {
    return { error: 'Failed to reach travel time service', zipCode };
  }

  const elem = data?.rows?.[0]?.elements?.[0];
  if (data.status !== 'OK' || elem?.status !== 'OK') {
    return {
      error: `Could not determine travel time for ZIP ${zipCode}`,
      zipCode,
      googleStatus: elem?.status || data?.status,
    };
  }

  // Prefer the peak-traffic duration when available.
  const seconds = elem.duration_in_traffic?.value ?? elem.duration.value;
  const result = {
    zipCode,
    streetAddress: streetAddress || null,
    travelTimeMinutes: Math.round(seconds / 60),
    distanceMiles: Math.round(elem.distance.value / 1609),
    destinationAddress: data.destination_addresses?.[0],
    trafficModel: 'pessimistic',
  };

  // Only cache the ZIP-only resolution to keep the cache tier-stable
  if (redis && !streetAddress) {
    await redis.set(cacheKey, result, { ex: CACHE_TTL_SECONDS });
  }

  return result;
}
