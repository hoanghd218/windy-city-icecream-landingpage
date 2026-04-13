// POST /api/chat — Windy City Ice Cream chatbot endpoint.
// Streams responses from Claude Sonnet 4.6 with two tools
// (calculate_estimate, get_travel_time_from_zip).
// Logs conversations to DynamoDB (fire-and-forget) for admin review.

import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/chatbot/knowledge-base';
import { chatTools } from '@/lib/chatbot/tools';
import { checkChatRateLimit } from '@/lib/chatbot/rate-limiter';
import { getOrCreateSessionId } from '@/lib/chatbot/session-cookie';
import {
  logChatMessage,
  extractMetadataFromToolResults,
} from '@/lib/chatbot/chat-logger';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY = 20;

function getClientIp(req) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'anonymous';
}

function extractText(msg) {
  if (typeof msg?.content === 'string') return msg.content;
  if (Array.isArray(msg?.parts)) {
    return msg.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text || '')
      .join(' ');
  }
  return '';
}

function jsonError(message, status, extra = {}) {
  return new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function POST(req) {
  // 1. Rate limit
  const ip = getClientIp(req);
  const { success, reset } = await checkChatRateLimit(ip);
  if (!success) {
    return jsonError('Too many requests. Please slow down.', 429, { resetAt: reset });
  }

  // 2. Parse + validate body
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }
  if (!body?.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError('Missing or empty messages array', 400);
  }

  // 3. Cap message length + history depth
  const lastMsg = body.messages.at(-1);
  const lastText = extractText(lastMsg);
  if (lastText.length > MAX_MESSAGE_CHARS) {
    return jsonError(`Message too long (max ${MAX_MESSAGE_CHARS} chars)`, 400);
  }
  const trimmed = body.messages.slice(-MAX_HISTORY);

  // 4. Session tracking + log user message
  const { sessionId, cookieHeader } = getOrCreateSessionId(req);
  const userAgent = req.headers.get('user-agent') || '';
  logChatMessage({
    sessionId,
    role: 'user',
    content: lastText,
    ip,
    userAgent,
  });

  // 5. Stream response
  try {
    const result = streamText({
      model: anthropic('claude-sonnet-4-6'),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(trimmed),
      tools: chatTools,
      stopWhen: stepCountIs(5),
      maxOutputTokens: 600,
      temperature: 0.3,
      onFinish({ text, toolCalls, toolResults }) {
        const metadata = extractMetadataFromToolResults(toolCalls, toolResults);
        const toolCallsLog = toolCalls?.length
          ? toolCalls.map((tc, i) => ({
              name: tc.toolName,
              input: tc.args ?? tc.input,
              output: toolResults?.[i]?.result ?? toolResults?.[i]?.output,
            }))
          : null;
        logChatMessage({
          sessionId,
          role: 'assistant',
          content: text,
          toolCalls: toolCallsLog,
          metadata,
        });
      },
    });
    const response = result.toUIMessageStreamResponse();
    if (cookieHeader) response.headers.append('set-cookie', cookieHeader);
    return response;
  } catch (err) {
    console.error('[chat] streamText error', err);
    return jsonError('Chat service unavailable', 500);
  }
}
