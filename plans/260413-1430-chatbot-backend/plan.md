---
title: "Chatbot Backend — AI Customer Service & Order Estimator"
description: "Next.js API route + Vercel AI SDK + LLM tool calling for FAQ answering, price estimation, ZIP-based travel time"
status: pending
priority: P1
effort: 8-12h
branch: main
tags: [backend, ai, chatbot, llm, api]
created: 2026-04-13
blocks: [260323-1115-chatbot-ui]
---

# Chatbot Backend — Windy City Ice Cream

## Summary

Backend cho floating chatbot: trả lời FAQ (services, pricing, ice cream types), tính estimate tự động theo công thức `(80×h) + distance_fee + (qty×4) + tax`, suy travel time từ ZIP code (origin: 10525 S Ridgeland Ave, Alsip IL 60803). Dùng Next.js API route + Vercel AI SDK, không thêm service mới.

## Architecture

```
[Chatbot.jsx widget]
   │  useChat() hook (ai/react)
   ▼
[POST /api/chat]  ── streamText ──► [LLM: Claude Haiku 4.5 / GPT-4o-mini]
                                         │
                                    tool calls
                                         │
                    ┌────────────────────┼─────────────────────┐
                    ▼                    ▼                     ▼
          calculate_estimate()   get_travel_time(zip)   get_business_info()
          (pure JS formula)      (Google Distance       (static from KB)
                                  Matrix API)
```

- **Knowledge base:** `yeu cau.txt` nội dung nhồi vào system prompt (~1.5KB) — không RAG, không vector DB.
- **Rate limit + Cache:** Vercel KV (Redis-compatible, 1-click setup từ Vercel dashboard) — 20 req/phút/IP.
- **Deploy:** Vercel serverless (cùng landing page).

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | Setup deps, env, system prompt KB | pending | 1h | [phase-01](./phase-01-setup-deps-and-kb.md) |
| 2 | API route + Vercel AI SDK streaming | pending | 2h | [phase-02](./phase-02-api-route-streaming.md) |
| 3 | Tools: estimate + travel time + info | pending | 3h | [phase-03](./phase-03-tools-implementation.md) |
| 4 | Rate limit + input validation + errors | pending | 1.5h | [phase-04](./phase-04-rate-limit-and-security.md) |
| 5 | Wire Chatbot.jsx to backend + test | pending | 2h | [phase-05](./phase-05-wire-frontend-and-test.md) |

## Key Decisions

- **Framework:** Next.js API Route (cùng repo, không tách backend riêng) — YAGNI với traffic seasonal.
- **LLM SDK:** Vercel AI SDK v4 (`ai` + `@ai-sdk/anthropic`) — streaming + tool calling + React hook sẵn.
- **Model:** **Claude Sonnet 4.6** (`claude-sonnet-4-6`) — reasoning tốt hơn cho edge cases, tool calling chính xác, cost chấp nhận được với traffic thấp.
- **Language:** English only (US market).
- **Booking handoff:** Redirect `/contact` + copy-to-clipboard estimate — KISS, không tạo order API.
- **Travel time:** Google Distance Matrix API — chính xác hơn lookup table, $200 free credit/tháng đủ dư.
- **KB strategy:** System prompt tĩnh — content <2KB, RAG là overkill.
- **Rate limit:** Upstash Redis via `@upstash/ratelimit` — serverless-friendly.
- **Booking handoff:** LLM trả link `/contact` khi user muốn confirm quote (không tự tạo order).

## Rejected Alternatives

| Option | Lý do bỏ |
|--------|----------|
| FastAPI / Express backend riêng | Overkill, tăng infra cost, không tận dụng Next stack |
| Rasa / Botpress / Dialogflow | Heavyweight, training flows phức tạp cho 10 FAQ tĩnh |
| RAG + Pinecone/Supabase vector | Knowledge <2KB, nhồi vào prompt rẻ hơn |
| Hardcode ZIP → travel table | Không scale, sai số cao, maintain khổ |
| OpenAI Assistants API | Vendor lock-in, thread state phức tạp, streaming khó custom |

## Dependencies

**New packages:**
- `ai` (Vercel AI SDK)
- `@ai-sdk/anthropic` (hoặc `@ai-sdk/openai`)
- `@vercel/kv` + `@upstash/ratelimit` (Vercel KV is Redis-compatible, works with Upstash ratelimit lib)
- `zod` (tool input schemas)

**External services:**
- Anthropic API key (ANTHROPIC_API_KEY)
- Google Maps Distance Matrix API key (GOOGLE_MAPS_API_KEY)
- Vercel KV instance (KV_URL + KV_REST_API_URL + KV_REST_API_TOKEN — auto-set by Vercel)

**Blocks plan:** [260323-1115-chatbot-ui](../260323-1115-chatbot-ui/plan.md) — Phase 5 thay demo responses trong `Chatbot.jsx` bằng `useChat()` hook.

## Success Criteria

- [ ] Chatbot trả lời được 4 FAQ mẫu (services / cost / types / pricing formula)
- [ ] Tính đúng Example 1 ($520) và Example 2 ($648.40) từ yeu cau.txt
- [ ] ZIP code (vd: 60601 Chicago) → travel time hợp lý, áp đúng distance fee tier
- [ ] Rate limit chặn được >20 req/phút/IP
- [ ] Response streaming mượt, latency p50 <3s
- [ ] Không leak API keys ra client

## Risks

| Risk | Mitigation |
|------|------------|
| LLM hallucinate sai giá | System prompt enforce "LUÔN dùng tool `calculate_estimate`, không tính nhẩm" |
| Spam → chi phí LLM tăng | Rate limit + max_tokens cap 500 + Turnstile nếu cần |
| Google Maps quota vượt free tier | Cache ZIP→duration vào Redis TTL 30 ngày |
| User hỏi ngoài scope | System prompt giới hạn chủ đề, redirect về contact form |
| Seasonal idle cost | Serverless = $0 khi không request |
