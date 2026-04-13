# Phase 2 — Chat Logger (DynamoDB Write)

**Priority:** P1 | **Status:** pending | **Effort:** 1.5h | **Depends on:** Phase 1

## Overview

Create chat logger module. Write user + assistant messages to DynamoDB async, non-blocking.

## 2.1 Install deps

```bash
cd fe
pnpm add @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

## 2.2 DynamoDB client — `src/lib/chatbot/dynamodb-client.js`

```js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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
```

## 2.3 Logger module — `src/lib/chatbot/chat-logger.js`

```js
import crypto from "node:crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient } from "./dynamodb-client";

const TABLE = process.env.DYNAMODB_CHAT_TABLE || "windy-chat-logs";

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || "";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").slice(0, 32);
}

function dateKey(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Fire-and-forget write. Never throws — logs error to console.
 */
export function logChatMessage({
  sessionId,
  role,
  content,
  toolCalls = null,
  ip = "",
  userAgent = "",
  metadata = {},
}) {
  const client = getDocClient();
  if (!client) return; // dev without AWS creds → skip silently

  const now = new Date();
  const ts = now.toISOString();

  const item = {
    sessionId,
    ts,
    role,
    content: typeof content === "string" ? content.slice(0, 10000) : JSON.stringify(content).slice(0, 10000),
    dateKey: dateKey(now),
  };
  if (toolCalls) item.toolCalls = toolCalls;
  if (ip) item.ipHash = hashIp(ip);
  if (userAgent) item.userAgent = userAgent.slice(0, 500);
  if (metadata && Object.keys(metadata).length) item.metadata = metadata;

  // Fire and forget — do not await in caller
  client
    .send(new PutCommand({ TableName: TABLE, Item: item }))
    .catch((err) => console.error("[chat-logger]", err.name, err.message));
}
```

## 2.4 Integrate into API route — `src/app/api/chat/route.js`

Call `logChatMessage` for the user's new message (before streaming) and for the assistant's response (after stream completes).

**For user message:**
```js
// after validation
const userMsg = body.messages.at(-1);
const userText = extractText(userMsg);
logChatMessage({
  sessionId,
  role: "user",
  content: userText,
  ip,
  userAgent: req.headers.get("user-agent") || "",
});
```

**For assistant message (in `streamText` options):**
```js
streamText({
  ...,
  onFinish({ text, toolCalls, toolResults }) {
    logChatMessage({
      sessionId,
      role: "assistant",
      content: text,
      toolCalls: toolCalls?.length ? toolCalls.map((tc, i) => ({
        name: tc.toolName,
        input: tc.args,
        output: toolResults?.[i]?.result,
      })) : null,
    });
  },
});
```

## Related Files

- Create: `src/lib/chatbot/dynamodb-client.js`, `src/lib/chatbot/chat-logger.js`
- Modify: `src/app/api/chat/route.js`

## Success Criteria

- [ ] User messages appear in DynamoDB within 3s of send
- [ ] Assistant messages with tool calls logged after streaming finishes
- [ ] LLM streaming latency unchanged (logger is async, non-blocking)
- [ ] If AWS creds missing or DDB unreachable, chat still works (just no logging)
- [ ] `content` truncated to 10,000 chars to prevent oversized items

## Todo

- [ ] Install deps
- [ ] Write dynamodb-client.js
- [ ] Write chat-logger.js
- [ ] Wire into route.js (user + assistant via onFinish)
- [ ] Test locally: send chat → verify item in DDB Console
- [ ] Verify streaming perf unchanged
