# Phase 4 — Admin API Routes + Basic Auth

**Priority:** P1 | **Status:** pending | **Effort:** 1.5h | **Depends on:** Phase 2, 3

## Overview

Expose 2 protected API routes for admin viewing. Use HTTP Basic Auth with `ADMIN_PASSWORD`. Protect via Next.js middleware.

## 4.1 Basic Auth middleware — `src/middleware.js`

Next.js middleware catches `/admin/*` requests and returns 401 with `WWW-Authenticate` challenge if creds missing/wrong.

```js
import { NextResponse } from "next/server";

const ADMIN_USERNAME = "admin";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "www-authenticate": 'Basic realm="Admin", charset="UTF-8"',
      "cache-control": "no-store",
    },
  });
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return unauthorized();

  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(auth.slice(6));
    const [user, pass] = decoded.split(":");
    if (user !== ADMIN_USERNAME || pass !== adminPassword) return unauthorized();
  } catch {
    return unauthorized();
  }

  // Add security headers for admin pages
  const res = NextResponse.next();
  res.headers.set("x-robots-tag", "noindex, nofollow");
  res.headers.set("cache-control", "no-store");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

## 4.2 List sessions by date — `src/app/api/admin/sessions/route.js`

Query GSI `by-date-index` to list sessions on a given date, sorted by latest first.

```js
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "@/lib/chatbot/dynamodb-client";

export const runtime = "nodejs";

export async function GET(req) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date") || new Date().toISOString().slice(0, 10);

  const client = getDocClient();
  if (!client) return new Response("DB unavailable", { status: 503 });

  const result = await client.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_CHAT_TABLE,
      IndexName: "by-date-index",
      KeyConditionExpression: "dateKey = :d",
      ExpressionAttributeValues: { ":d": date },
      ScanIndexForward: false, // newest first
      Limit: 500,
    })
  );

  // Group by sessionId
  const sessions = new Map();
  for (const item of result.Items || []) {
    const s = sessions.get(item.sessionId) || {
      sessionId: item.sessionId,
      firstTs: item.ts,
      lastTs: item.ts,
      messageCount: 0,
      metadata: {},
    };
    s.firstTs = item.ts < s.firstTs ? item.ts : s.firstTs;
    s.lastTs = item.ts > s.lastTs ? item.ts : s.lastTs;
    s.messageCount += 1;
    if (item.metadata) s.metadata = { ...s.metadata, ...item.metadata };
    sessions.set(item.sessionId, s);
  }

  const list = [...sessions.values()].sort((a, b) => b.lastTs.localeCompare(a.lastTs));
  return Response.json({ date, sessions: list, totalMessages: result.Items?.length || 0 });
}
```

## 4.3 Get messages for a session — `src/app/api/admin/sessions/[sessionId]/route.js`

```js
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "@/lib/chatbot/dynamodb-client";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  const { sessionId } = await params;
  const client = getDocClient();
  if (!client) return new Response("DB unavailable", { status: 503 });

  const result = await client.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_CHAT_TABLE,
      KeyConditionExpression: "sessionId = :s",
      ExpressionAttributeValues: { ":s": sessionId },
      ScanIndexForward: true, // oldest first (chronological)
    })
  );

  return Response.json({
    sessionId,
    messages: result.Items || [],
  });
}
```

## 4.4 Security hardening

- ADMIN_PASSWORD must be ≥20 chars (validate at startup)
- Consider adding rate limit on middleware (reuse `checkChatRateLimit` with `rl:admin` prefix, 5 req/min)
- Log failed auth attempts to console

## Related Files

- Create: `src/middleware.js`
- Create: `src/app/api/admin/sessions/route.js`
- Create: `src/app/api/admin/sessions/[sessionId]/route.js`

## Success Criteria

- [ ] `GET /api/admin/sessions` without auth → 401 + browser password prompt
- [ ] Wrong password → 401
- [ ] Correct password → JSON list of sessions
- [ ] `GET /api/admin/sessions/<sid>` → messages in chronological order
- [ ] Admin routes have `noindex` and `no-store` headers
- [ ] No admin credentials leak into logs or responses

## Todo

- [ ] Write middleware.js
- [ ] Write /api/admin/sessions/route.js (list)
- [ ] Write /api/admin/sessions/[sessionId]/route.js (detail)
- [ ] Test 401 flow via curl: `curl -u admin:<pw> https://.../api/admin/sessions`
- [ ] Verify noindex header on admin responses
