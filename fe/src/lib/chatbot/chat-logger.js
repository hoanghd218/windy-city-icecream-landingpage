// Fire-and-forget DynamoDB logger. Never throws — logs errors to console.
// Truncates content to prevent oversized items.

import crypto from 'node:crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, CHAT_TABLE } from './dynamodb-client';

const MAX_CONTENT_CHARS = 10000;
const MAX_UA_CHARS = 500;

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || '';
  return crypto
    .createHash('sha256')
    .update(ip + salt)
    .digest('hex')
    .slice(0, 32);
}

function todayKey(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function truncate(text, max) {
  if (typeof text !== 'string') text = JSON.stringify(text);
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export function logChatMessage({
  sessionId,
  role,
  content,
  toolCalls = null,
  ip = '',
  userAgent = '',
  metadata = null,
}) {
  const client = getDocClient();
  if (!client || !sessionId) return;

  const now = new Date();
  const item = {
    sessionId,
    ts: now.toISOString(),
    role,
    content: truncate(content ?? '', MAX_CONTENT_CHARS),
    dateKey: todayKey(now),
  };
  if (toolCalls && toolCalls.length) item.toolCalls = toolCalls;
  if (ip) item.ipHash = hashIp(ip);
  if (userAgent) item.userAgent = userAgent.slice(0, MAX_UA_CHARS);
  if (metadata && Object.keys(metadata).length) item.metadata = metadata;

  // Fire and forget
  client
    .send(new PutCommand({ TableName: CHAT_TABLE, Item: item }))
    .catch((err) => console.error('[chat-logger]', err.name, err.message));
}

// Extract useful structured metadata from LLM tool calls for admin view.
export function extractMetadataFromToolResults(toolCalls, toolResults) {
  const metadata = {};
  if (!toolCalls?.length) return metadata;

  for (let i = 0; i < toolCalls.length; i++) {
    const tc = toolCalls[i];
    const res = toolResults?.[i]?.result ?? toolResults?.[i]?.output;
    if (!res) continue;
    if (tc.toolName === 'get_travel_time_from_zip' && res.zipCode) {
      metadata.zipCode = res.zipCode;
      if (res.travelTimeMinutes) metadata.travelTimeMinutes = res.travelTimeMinutes;
    }
    if (tc.toolName === 'calculate_estimate' && typeof res.total === 'number') {
      metadata.estimateTotal = res.total;
      const args = tc.args || tc.input || {};
      if (args.serviceType) metadata.serviceType = args.serviceType;
      if (args.hours) metadata.hours = args.hours;
      if (args.quantity) metadata.quantity = args.quantity;
    }
  }
  return metadata;
}
