// GET /api/admin/sessions?date=YYYY-MM-DD
// Lists chat sessions on a given day (via GSI by-date-index),
// grouped by sessionId with aggregated metadata.

import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import {
  getDocClient,
  CHAT_TABLE,
  CHAT_DATE_INDEX,
} from '@/lib/chatbot/dynamodb-client';

export const runtime = 'nodejs';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isValidDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export async function GET(req) {
  const url = new URL(req.url);
  const dateParam = url.searchParams.get('date');
  const date = dateParam && isValidDate(dateParam) ? dateParam : todayKey();

  const client = getDocClient();
  if (!client) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 });
  }

  let items = [];
  let lastKey;
  try {
    do {
      const result = await client.send(
        new QueryCommand({
          TableName: CHAT_TABLE,
          IndexName: CHAT_DATE_INDEX,
          KeyConditionExpression: 'dateKey = :d',
          ExpressionAttributeValues: { ':d': date },
          ScanIndexForward: false,
          Limit: 500,
          ExclusiveStartKey: lastKey,
        })
      );
      items = items.concat(result.Items || []);
      lastKey = result.LastEvaluatedKey;
    } while (lastKey && items.length < 2000);
  } catch (err) {
    console.error('[admin/sessions] query error', err.name, err.message);
    return Response.json({ error: 'Query failed' }, { status: 500 });
  }

  const sessions = new Map();
  for (const item of items) {
    const existing = sessions.get(item.sessionId);
    if (!existing) {
      sessions.set(item.sessionId, {
        sessionId: item.sessionId,
        firstTs: item.ts,
        lastTs: item.ts,
        messageCount: 1,
        metadata: item.metadata || {},
        ipHash: item.ipHash,
      });
    } else {
      if (item.ts < existing.firstTs) existing.firstTs = item.ts;
      if (item.ts > existing.lastTs) existing.lastTs = item.ts;
      existing.messageCount += 1;
      if (item.metadata) existing.metadata = { ...existing.metadata, ...item.metadata };
    }
  }

  const list = [...sessions.values()].sort((a, b) =>
    b.lastTs.localeCompare(a.lastTs)
  );

  return Response.json({
    date,
    sessions: list,
    totalMessages: items.length,
  });
}
