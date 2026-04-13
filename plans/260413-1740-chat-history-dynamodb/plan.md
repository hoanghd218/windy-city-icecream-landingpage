---
title: "Chat History Logging + Admin Viewer"
description: "Persist chat conversations to DynamoDB; password-protected /admin/chats page to view logs"
status: pending
priority: P1
effort: 5-7h
branch: main
tags: [backend, dynamodb, admin, logging, aws]
created: 2026-04-13
blockedBy: [260413-1430-chatbot-backend]
---

# Chat History Logging — Windy City Ice Cream

## Summary

Log every chatbot conversation to **AWS DynamoDB** (us-east-1) for admin review. Expose **password-protected `/admin/chats` page** to list sessions + drill into messages. No deletion (retention = forever).

## Architecture

```
[Chatbot.jsx]
   │ sessionId cookie (30d)
   ▼
[POST /api/chat]
   ├─► streamText (LLM) ──► response to user
   └─► [async] logMessage() ──► DynamoDB
                                     │
                                     ▼
                              windy-chat-logs table
                                     │
[Admin enters password]              │
   ▼                                 │
[GET /admin/chats] (Basic Auth)──────┘
   │ list sessions (GSI by date)
   └─► [GET /admin/chats/:sessionId]
          list messages (Query by PK)
```

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | AWS setup: table + IAM user + env vars | pending | 1h | [phase-01](./phase-01-aws-setup.md) |
| 2 | Chat logger: write messages async | pending | 1.5h | [phase-02](./phase-02-chat-logger.md) |
| 3 | Session tracking (cookie) + metadata | pending | 1h | [phase-03](./phase-03-session-tracking.md) |
| 4 | Admin API routes (list sessions, get messages) | pending | 1.5h | [phase-04](./phase-04-admin-api.md) |
| 5 | Admin UI page `/admin/chats` | pending | 1.5h | [phase-05](./phase-05-admin-ui.md) |

## Key Decisions

- **DB:** DynamoDB `us-east-1` — user already has AWS account
- **Retention:** Forever (no TTL attribute) — user requirement
- **Auth:** HTTP Basic Auth with single admin password (env var `ADMIN_PASSWORD`) — KISS, no user mgmt
- **Session ID:** UUID in httpOnly cookie (30 days, SameSite=Lax)
- **Logging mode:** Fire-and-forget in API route — do NOT block LLM streaming on DB write
- **AWS SDK:** `@aws-sdk/client-dynamodb` + `@aws-sdk/lib-dynamodb` (DocumentClient for JSON-friendly API)

## Schema (single-table)

**Table: `windy-chat-logs`** (us-east-1)

| Attribute | Type | Purpose |
|---|---|---|
| `sessionId` (PK) | String | UUID per chat session |
| `ts` (SK) | String | ISO-8601 timestamp `2026-04-13T10:30:15.123Z` |
| `role` | String | `user` / `assistant` / `tool` |
| `content` | String | Message text (or JSON stringified tool result) |
| `toolCalls` | List<Map> | LLM tool invocations |
| `ipHash` | String | `sha256(ip + salt)` — privacy-safe |
| `userAgent` | String | |
| `metadata` | Map | `{zipCode, estimateTotal, serviceType, ...}` |
| `dateKey` | String | `YYYY-MM-DD` (for GSI) |

**GSI: `by-date-index`**
- PK: `dateKey`
- SK: `ts`
- Projection: ALL — enables "list all sessions on date X"

**Access patterns:**
- Write message: `PutItem` with sessionId + ts
- List messages in session: `Query` PK=sessionId (oldest→newest)
- List sessions by date: `Query` GSI `by-date-index` PK=YYYY-MM-DD

## Rejected Alternatives

| Option | Why rejected |
|---|---|
| Supabase Postgres | User prefers AWS stack |
| DynamoDB TTL | User wants to keep forever |
| Full user auth (Cognito/Auth0) | Overkill for single admin |
| Real-time updates (WebSocket) | YAGNI — polling/refresh enough |
| Separate `conversations` + `messages` tables | Single-table is simpler, fits DDB patterns |

## Dependencies

**New packages:**
- `@aws-sdk/client-dynamodb`
- `@aws-sdk/lib-dynamodb`

**New env vars:**
- `AWS_REGION=us-east-1`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DYNAMODB_CHAT_TABLE=windy-chat-logs`
- `ADMIN_PASSWORD` (strong random string)
- `IP_HASH_SALT` (random string, for privacy)

## Success Criteria

- [ ] Every user + assistant message logged to DynamoDB within 2s (fire-and-forget, non-blocking)
- [ ] `/admin/chats` requires password, lists sessions by date (most recent first)
- [ ] Click session → shows full conversation in chronological order
- [ ] Tool calls (estimate + ZIP lookup) visible in admin view
- [ ] No IP addresses stored (only hash)
- [ ] Chat API latency unchanged (<100ms p50 overhead from logging)
- [ ] Build + lint pass

## Risks

| Risk | Mitigation |
|---|---|
| DynamoDB write fails → user experience blocked | Fire-and-forget with try/catch; log errors to console only |
| AWS credentials leak via client bundle | Server-only SDK usage; verify `.next/` bundle grep |
| Admin password brute force | HTTP Basic Auth + rate limit `/admin/*` (reuse existing limiter) |
| PII in logs (ZIP, names accidentally typed) | Document retention policy; strong admin password |
| GSI hot partition on busy days | Seasonal traffic low → non-issue |
| Cost overrun | 25 WCU free tier covers 64M writes/month — far beyond need |

## Security Notes

- `ADMIN_PASSWORD` min 20 chars, high entropy
- HTTPS only (Vercel default)
- `/admin/chats` set `x-robots-tag: noindex` + `cache-control: no-store`
- IP hash: `sha256(ip + IP_HASH_SALT)` — salt prevents rainbow table
- Consider IP allowlist for admin routes if truly sensitive

## Deployment Plan

1. Create DynamoDB table + IAM user in AWS Console (Phase 1)
2. Add env vars via Vercel CLI (`vercel env add`)
3. Deploy code via `vercel --prod`
4. Smoke test: chat → verify log appears in AWS Console → test admin login

## Unresolved Questions

1. **Admin password:** bạn tự tạo hay tôi generate random và gửi via CLI?
2. **Multiple admins?** Nếu sau này có thêm admin, 1 password chung hay upgrade lên user system?
3. **Export functionality** (CSV/JSON download)? — có thể add sau ở Phase 6
4. **Analytics** (top ZIPs, conversion, etc.)? — không nằm trong scope này, plan riêng nếu cần
