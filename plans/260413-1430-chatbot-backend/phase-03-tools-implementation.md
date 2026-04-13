# Phase 3 — Tool Implementations

**Priority:** P1 | **Status:** pending | **Effort:** 3h | **Depends on:** Phase 2

## Overview

Implement 3 LLM tools: `calculate_estimate`, `get_travel_time_from_zip`, `get_business_info`. File: `src/lib/chatbot/tools.js`.

## 3.1 `calculate_estimate` — Pure JS

**Input schema (Zod):**
```js
z.object({
  serviceType: z.enum(['truck', 'pushcart']),
  hours: z.number().min(0.5).max(24),
  travelTimeMinutes: z.number().min(0).max(300),
  quantity: z.number().int().min(1),
  taxRate: z.number().min(0).max(0.2).default(0.10), // 10% default
})
```

**Logic:**
```js
function distanceFee(mins) {
  if (mins <= 30) return 0;
  if (mins <= 45) return 25;
  if (mins <= 60) return 50;
  if (mins <= 75) return 100;
  return 100 + Math.ceil((mins - 75) / 15) * 50; // extrapolate beyond table
}

function minQuantity(hours) {
  return Math.ceil(hours * 2) * 50; // 50 per 30min
}

execute: async ({ serviceType, hours, travelTimeMinutes, quantity, taxRate }) => {
  const billedQty = Math.max(quantity, minQuantity(hours));
  const truckFee = serviceType === 'truck' ? 80 * Math.max(1, hours) : 0;
  const travelFee = distanceFee(travelTimeMinutes);
  const iceCreamCost = billedQty * 4;
  const tax = iceCreamCost * taxRate;
  const total = truckFee + travelFee + iceCreamCost + tax;
  return {
    breakdown: { truckFee, travelFee, iceCreamCost, tax, billedQty, minRequired: minQuantity(hours) },
    total: Number(total.toFixed(2)),
    currency: 'USD',
  };
}
```

**Validate:** Test Example 1 (1h, 25min, 100pcs, 10%) → $520; Example 2 (1h, 50min, 120pcs, 8%) → $648.40.

## 3.2 `get_travel_time_from_zip` — Google Distance Matrix

**Input:** `z.object({ zipCode: z.string().regex(/^\d{5}$/) })`

**Logic:**
```js
execute: async ({ zipCode }) => {
  // 1. Check Redis cache (key: `travel:${zipCode}`, TTL 30 days)
  const cached = await kv.get(`travel:${zipCode}`);
  if (cached) return cached;

  // 2. Call Google Distance Matrix
  const origin = encodeURIComponent(process.env.WAREHOUSE_ADDRESS);
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${zipCode},USA&units=imperial&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  // 3. Parse duration (seconds → minutes)
  const elem = data.rows?.[0]?.elements?.[0];
  if (elem?.status !== 'OK') {
    return { error: 'Could not determine travel time for this ZIP', zipCode };
  }
  const result = {
    zipCode,
    travelTimeMinutes: Math.round(elem.duration.value / 60),
    distanceMiles: Math.round(elem.distance.value / 1609),
  };
  await kv.set(`travel:${zipCode}`, result, { ex: 60 * 60 * 24 * 30 });
  return result;
}
```

## 3.3 `get_business_info` — Static lookup

**Input:** `z.object({ topic: z.enum(['contact', 'hours', 'location', 'season', 'menu']) })`
**Logic:** Return hardcoded fact from KB. (Optional — LLM có thể trả thẳng từ system prompt, tool này chỉ dùng khi muốn structured data.)

## Module export
```js
export const chatTools = {
  calculate_estimate: tool({ description: '...', parameters: ..., execute: ... }),
  get_travel_time_from_zip: tool({ ... }),
  get_business_info: tool({ ... }),
};
```

## KV client — `src/lib/chatbot/kv-client.js`
```js
import { kv } from '@vercel/kv';
export { kv };
```
(Replace all `redis.get/set` calls trong tools.js bằng `kv.get/set`. API tương thích.)

## Related Files
- Create: `src/lib/chatbot/tools.js`, `src/lib/chatbot/kv-client.js`
- Create test: `src/lib/chatbot/tools.test.js` (unit test for `calculate_estimate` formula)

## Success Criteria
- [ ] Example 1 & Example 2 trả đúng total
- [ ] `distanceFee(25) === 0`, `distanceFee(50) === 50`, `distanceFee(75) === 100`
- [ ] `minQuantity(0.5) === 50`, `minQuantity(1) === 100`, `minQuantity(1.5) === 150`
- [ ] ZIP invalid → error response, không crash
- [ ] Cache hit sau lần call đầu (verify Vercel KV dashboard)

## Todo
- [ ] Write tools.js với Zod schemas
- [ ] Write redis-client.js
- [ ] Unit test calculate_estimate
- [ ] Integration test với Google Maps (ZIP 60601)
- [ ] Verify cache TTL
