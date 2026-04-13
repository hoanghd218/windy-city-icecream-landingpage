# Phase 3 — Session Tracking & Metadata

**Priority:** P1 | **Status:** pending | **Effort:** 1h | **Depends on:** Phase 2

## Overview

Issue a stable `sessionId` cookie to group related messages, extract useful metadata (ZIP, estimate total) from tool results.

## 3.1 Session cookie helper — `src/lib/chatbot/session-cookie.js`

```js
import { randomUUID } from "node:crypto";

const COOKIE_NAME = "wci_chat_sid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getOrCreateSessionId(req, responseHeaders) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)wci_chat_sid=([a-f0-9-]{36})/);
  if (match) return { sessionId: match[1], isNew: false };

  const sessionId = randomUUID();
  responseHeaders.append(
    "set-cookie",
    `${COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax; Secure`
  );
  return { sessionId, isNew: true };
}
```

## 3.2 Integrate into route

In `src/app/api/chat/route.js`:

```js
const responseHeaders = new Headers();
const { sessionId } = getOrCreateSessionId(req, responseHeaders);

// ... build streamText result
const result = streamText({ ... });
const response = result.toUIMessageStreamResponse();
// Merge cookie into response
responseHeaders.forEach((v, k) => response.headers.append(k, v));
return response;
```

## 3.3 Metadata extraction (inside onFinish)

Parse tool results to extract structured metadata:

```js
function extractMetadata(toolCalls, toolResults) {
  const metadata = {};
  toolCalls?.forEach((tc, i) => {
    const res = toolResults?.[i]?.result;
    if (!res) return;
    if (tc.toolName === "get_travel_time_from_zip" && res.zipCode) {
      metadata.zipCode = res.zipCode;
      metadata.travelTimeMinutes = res.travelTimeMinutes;
    }
    if (tc.toolName === "calculate_estimate" && res.total) {
      metadata.estimateTotal = res.total;
      metadata.serviceType = tc.args.serviceType;
      metadata.hours = tc.args.hours;
      metadata.quantity = tc.args.quantity;
    }
  });
  return metadata;
}

// In onFinish:
const metadata = extractMetadata(toolCalls, toolResults);
logChatMessage({ sessionId, role: "assistant", content: text, toolCalls, metadata });
```

## 3.4 First-message session marker (optional)

When `isNew === true`, log a special `session-start` event with user-agent + ipHash once. Saves querying per-message.

```js
if (isNew) {
  logChatMessage({
    sessionId,
    role: "session-start",
    content: "session started",
    ip,
    userAgent: req.headers.get("user-agent") || "",
  });
}
```

## Related Files

- Create: `src/lib/chatbot/session-cookie.js`
- Modify: `src/app/api/chat/route.js`

## Success Criteria

- [ ] First chat sets `wci_chat_sid` cookie (HttpOnly, Secure, SameSite=Lax, 30d)
- [ ] Subsequent chats reuse same sessionId
- [ ] Messages grouped correctly by sessionId in DDB (Query returns full convo)
- [ ] Metadata (zipCode, estimateTotal) stored on assistant messages that use tools
- [ ] Cookie NOT stored anywhere other than browser (server only reads)

## Todo

- [ ] Write session-cookie.js
- [ ] Wire into route.js (add cookie to response)
- [ ] Add metadata extractor in onFinish
- [ ] Test: DevTools → Application → Cookies → verify `wci_chat_sid` set once
- [ ] Send 3 messages → verify all 3 have same sessionId in DDB
