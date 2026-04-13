// Stable session ID cookie for grouping chat messages in history logs.

import { randomUUID } from 'node:crypto';

const COOKIE_NAME = 'wci_chat_sid';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getOrCreateSessionId(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  if (match && UUID_RE.test(match[1])) {
    return { sessionId: match[1], isNew: false, cookieHeader: null };
  }
  const sessionId = randomUUID();
  const cookie = `${COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax; Secure`;
  return { sessionId, isNew: true, cookieHeader: cookie };
}
