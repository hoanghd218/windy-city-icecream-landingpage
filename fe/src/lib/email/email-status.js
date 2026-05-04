// Writes email send result back to the originating DynamoDB item.
// Used after sendAdminEmail to track delivery status for admin visibility.
// Never throws — best-effort update; errors logged.

import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, CHAT_TABLE } from '../chatbot/dynamodb-client';

// Map sendAdminEmail result → status string stored in DDB.
export function deriveEmailStatus(result) {
  if (!result) return 'failed';
  if (result.skipped) return 'skipped';
  return result.ok ? 'sent' : 'failed';
}

export async function updateEmailStatus({ sessionId, ts, status, errorCode }) {
  const client = getDocClient();
  if (!client || !sessionId || !ts) return;

  const expr = ['emailStatus = :s', 'emailedAt = :a'];
  const values = { ':s': status, ':a': new Date().toISOString() };
  if (errorCode != null) {
    expr.push('emailErrorCode = :e');
    values[':e'] = String(errorCode);
  }

  try {
    await client.send(
      new UpdateCommand({
        TableName: CHAT_TABLE,
        Key: { sessionId, ts },
        UpdateExpression: 'SET ' + expr.join(', '),
        ExpressionAttributeValues: values,
      })
    );
  } catch (err) {
    console.error('[email-status] update failed', err.name, err.message);
  }
}
