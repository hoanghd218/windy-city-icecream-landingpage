// DynamoDB DocumentClient singleton for chat history.
// Returns null when AWS creds are missing so dev without AWS still works.

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let _docClient = null;

export function getDocClient() {
  if (_docClient) return _docClient;
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !accessKeyId || !secretAccessKey) return null;
  const ddb = new DynamoDBClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
  _docClient = DynamoDBDocumentClient.from(ddb, {
    marshallOptions: { removeUndefinedValues: true },
  });
  return _docClient;
}

export const CHAT_TABLE = process.env.DYNAMODB_CHAT_TABLE || 'windy-chat-logs';
export const CHAT_DATE_INDEX = 'by-date-index';
