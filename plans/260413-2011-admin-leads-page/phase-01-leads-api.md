# Phase 1 — Leads API

**Priority:** P1 | **Status:** pending | **Effort:** 1.5h

## Overview

Build `GET /api/admin/leads?from&to&page&pageSize` — queries GSI across a date range, aggregates sessions, merges booking contact info, returns paginated leads.

## Endpoint

**Path:** `src/app/api/admin/leads/route.js`

### Query params

| Param | Type | Default | Validation |
|---|---|---|---|
| `from` | YYYY-MM-DD | today | valid date |
| `to` | YYYY-MM-DD | today | valid date, >= from, range <= 31 days |
| `page` | int | 1 | >= 1 |
| `pageSize` | int | 20 | one of 10/20/50 |

Return 400 if invalid params or range > 31 days.

## Implementation

```js
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, CHAT_TABLE, CHAT_DATE_INDEX } from '@/lib/chatbot/dynamodb-client';

export const runtime = 'nodejs';

const ALLOWED_PAGE_SIZES = [10, 20, 50];
const MAX_RANGE_DAYS = 31;
const HARD_CAP_ITEMS = 5000;

function isValidDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s)); }
function todayKey() { return new Date().toISOString().slice(0, 10); }

function daysBetween(from, to) {
  const diff = (new Date(to) - new Date(from)) / 86400000;
  return Math.floor(diff) + 1;
}

function datesInRange(from, to) {
  const out = [];
  const d = new Date(from);
  const end = new Date(to);
  while (d <= end) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

async function queryDay(client, dateKey) {
  const items = [];
  let lastKey;
  do {
    const res = await client.send(new QueryCommand({
      TableName: CHAT_TABLE,
      IndexName: CHAT_DATE_INDEX,
      KeyConditionExpression: 'dateKey = :d',
      ExpressionAttributeValues: { ':d': dateKey },
      ScanIndexForward: false,
      Limit: 1000,
      ExclusiveStartKey: lastKey,
    }));
    items.push(...(res.Items || []));
    lastKey = res.LastEvaluatedKey;
    if (items.length > HARD_CAP_ITEMS) break;
  } while (lastKey);
  return items;
}

export async function GET(req) {
  const url = new URL(req.url);
  const from = url.searchParams.get('from') || todayKey();
  const to = url.searchParams.get('to') || from;
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  let pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);
  if (!ALLOWED_PAGE_SIZES.includes(pageSize)) pageSize = 20;

  if (!isValidDate(from) || !isValidDate(to) || new Date(from) > new Date(to)) {
    return Response.json({ error: 'Invalid date range' }, { status: 400 });
  }
  if (daysBetween(from, to) > MAX_RANGE_DAYS) {
    return Response.json({ error: `Range too large (max ${MAX_RANGE_DAYS} days)` }, { status: 400 });
  }

  const client = getDocClient();
  if (!client) return Response.json({ error: 'DB unavailable' }, { status: 503 });

  // Fetch all items in range (parallel per day)
  const days = datesInRange(from, to);
  const itemsPerDay = await Promise.all(days.map((d) => queryDay(client, d)));
  const allItems = itemsPerDay.flat();

  // Separate booking records + group sessions
  const sessions = new Map();
  const bookings = new Map(); // sessionId -> booking info

  for (const item of allItems) {
    if (item.role === 'booking-request' && item.booking) {
      // Keep latest booking per session
      const prev = bookings.get(item.sessionId);
      if (!prev || item.ts > prev.ts) {
        bookings.set(item.sessionId, {
          ts: item.ts,
          name: item.booking.fullName,
          phone: item.booking.phone,
          email: item.booking.email,
          referenceId: item.booking.referenceId,
        });
      }
    }
    const s = sessions.get(item.sessionId);
    if (!s) {
      sessions.set(item.sessionId, {
        sessionId: item.sessionId,
        firstTs: item.ts,
        lastTs: item.ts,
        messageCount: 1,
        metadata: item.metadata || {},
      });
    } else {
      if (item.ts < s.firstTs) s.firstTs = item.ts;
      if (item.ts > s.lastTs) s.lastTs = item.ts;
      s.messageCount += 1;
      if (item.metadata) s.metadata = { ...s.metadata, ...item.metadata };
    }
  }

  // Attach booking customer info
  const leads = [...sessions.values()].map((s) => {
    const b = bookings.get(s.sessionId);
    return {
      ...s,
      customer: b
        ? { name: b.name, phone: b.phone, email: b.email, referenceId: b.referenceId }
        : null,
    };
  });

  // Sort newest activity first
  leads.sort((a, b) => b.lastTs.localeCompare(a.lastTs));

  const total = leads.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageLeads = leads.slice(pageStart, pageStart + pageSize);

  return Response.json({
    from, to, page, pageSize, total, totalPages,
    leads: pageLeads,
  });
}
```

## Related Files

- Create: `src/app/api/admin/leads/route.js`
- No changes to other files — existing admin session detail endpoint reused for expand.

## Success Criteria

- [ ] Valid query returns paginated list sorted newest first
- [ ] Leads with booking include `customer`, without booking have `customer: null`
- [ ] Range > 31 days → 400
- [ ] Invalid dates → 400
- [ ] pageSize clamped to 10/20/50
- [ ] Server handles 0 items gracefully (empty `leads` array)
- [ ] Parallel day queries (performance)

## Todo

- [ ] Write leads/route.js
- [ ] Manual test via curl: today's range, week, invalid date, range too wide
- [ ] Verify booking customer merge for session that submitted booking
