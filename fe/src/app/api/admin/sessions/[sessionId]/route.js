// GET /api/admin/sessions/:sessionId
// Returns all messages in a session in chronological order.

import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, CHAT_TABLE } from '@/lib/chatbot/dynamodb-client';

export const runtime = 'nodejs';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req, { params }) {
  const { sessionId } = await params;
  if (!UUID_RE.test(sessionId)) {
    return Response.json({ error: 'Invalid session ID' }, { status: 400 });
  }

  const client = getDocClient();
  if (!client) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 });
  }

  try {
    const result = await client.send(
      new QueryCommand({
        TableName: CHAT_TABLE,
        KeyConditionExpression: 'sessionId = :s',
        ExpressionAttributeValues: { ':s': sessionId },
        ScanIndexForward: true,
        Limit: 500,
      })
    );
    return Response.json({
      sessionId,
      messages: result.Items || [],
    });
  } catch (err) {
    console.error('[admin/session] query error', err.name, err.message);
    return Response.json({ error: 'Query failed' }, { status: 500 });
  }
}
