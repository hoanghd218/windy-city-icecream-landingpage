// GET /api/admin/leads?from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&pageSize=20
// Aggregates chat sessions across a date range, merges booking customer info,
// and returns paginated leads sorted by lastTs DESC.

import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import {
  getDocClient,
  CHAT_TABLE,
  CHAT_DATE_INDEX,
} from '@/lib/chatbot/dynamodb-client';

export const runtime = 'nodejs';

const ALLOWED_PAGE_SIZES = [10, 20, 50];
const MAX_RANGE_DAYS = 31;
const HARD_CAP_ITEMS = 5000;

function isValidDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s).getTime());
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(from, to) {
  const diff = (new Date(to).getTime() - new Date(from).getTime()) / 86400000;
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
    const res = await client.send(
      new QueryCommand({
        TableName: CHAT_TABLE,
        IndexName: CHAT_DATE_INDEX,
        KeyConditionExpression: 'dateKey = :d',
        ExpressionAttributeValues: { ':d': dateKey },
        ScanIndexForward: false,
        Limit: 1000,
        ExclusiveStartKey: lastKey,
      })
    );
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
    return Response.json(
      { error: `Range too large (max ${MAX_RANGE_DAYS} days)` },
      { status: 400 }
    );
  }

  const client = getDocClient();
  if (!client) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 });
  }

  let allItems = [];
  try {
    const days = datesInRange(from, to);
    const itemsPerDay = await Promise.all(days.map((d) => queryDay(client, d)));
    allItems = itemsPerDay.flat();
  } catch (err) {
    console.error('[admin/leads] query error', err.name, err.message);
    return Response.json({ error: 'Query failed' }, { status: 500 });
  }

  // Group items by session + collect latest booking per session
  const sessions = new Map();
  const bookings = new Map();

  for (const item of allItems) {
    if (!item.sessionId) continue;

    if (item.role === 'booking-request' && item.booking) {
      const prev = bookings.get(item.sessionId);
      if (!prev || item.ts > prev.ts) {
        bookings.set(item.sessionId, {
          ts: item.ts,
          name: item.booking.fullName,
          phone: item.booking.phone,
          email: item.booking.email,
          referenceId: item.booking.referenceId,
          emailStatus: item.emailStatus || null,
          emailedAt: item.emailedAt || null,
          emailErrorCode: item.emailErrorCode || null,
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

  // Attach customer info from bookings (null if no booking)
  const leads = [...sessions.values()].map((s) => {
    const b = bookings.get(s.sessionId);
    return {
      ...s,
      customer: b
        ? {
            name: b.name,
            phone: b.phone,
            email: b.email,
            referenceId: b.referenceId,
            emailStatus: b.emailStatus,
            emailedAt: b.emailedAt,
            emailErrorCode: b.emailErrorCode,
          }
        : null,
    };
  });

  leads.sort((a, b) => b.lastTs.localeCompare(a.lastTs));

  const total = leads.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageLeads = leads.slice(start, start + pageSize);

  return Response.json({
    from,
    to,
    page,
    pageSize,
    total,
    totalPages,
    leads: pageLeads,
  });
}
