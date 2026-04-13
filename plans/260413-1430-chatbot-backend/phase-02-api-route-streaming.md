# Phase 2 — API Route & Streaming

**Priority:** P1 | **Status:** pending | **Effort:** 2h | **Depends on:** Phase 1

## Overview

Tạo Next.js API route `POST /api/chat` dùng Vercel AI SDK `streamText` với Claude Haiku 4.5.

## Implementation

### 2.1 Route — `src/app/api/chat/route.js`

```js
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/chatbot/knowledge-base';
import { chatTools } from '@/lib/chatbot/tools';

export const runtime = 'edge'; // optional — faster cold start
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM_PROMPT,
    messages,
    tools: chatTools,
    maxSteps: 5,          // allow multi-turn tool calls
    maxTokens: 500,
    temperature: 0.3,     // deterministic for pricing
  });

  return result.toDataStreamResponse();
}
```

### 2.2 Path alias
Verify `jsconfig.json` has `"@/*": ["./src/*"]` — if not, add it.

### 2.3 Smoke test
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "content-type: application/json" \
  -d '{"messages":[{"role":"user","content":"What services do you offer?"}]}'
```
Expect streaming SSE response.

## Related Files
- Create: `src/app/api/chat/route.js`
- Modify: `jsconfig.json` (if needed)

## Success Criteria
- [ ] Route returns streaming response
- [ ] Response relevant đến FAQ trong KB
- [ ] Không error khi `messages` rỗng (trả 400)
- [ ] `maxTokens` cap hoạt động

## Risks
- Edge runtime không support một số Node APIs → nếu conflict, switch sang `nodejs` runtime
- `maxSteps: 5` để cho phép LLM gọi `get_travel_time` rồi `calculate_estimate` trong 1 turn

## Todo
- [ ] Write route.js
- [ ] Verify path alias
- [ ] Smoke test với curl
- [ ] Test edge vs node runtime
