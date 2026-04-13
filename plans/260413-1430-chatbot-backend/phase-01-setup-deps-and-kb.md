# Phase 1 — Setup Dependencies & Knowledge Base

**Priority:** P1 | **Status:** pending | **Effort:** 1h

## Overview

Cài deps, setup env vars, build system prompt knowledge base từ `yeu cau.txt`.

## Tasks

### 1.1 Install packages
```bash
pnpm add ai @ai-sdk/anthropic @vercel/kv @upstash/ratelimit zod
```

### 1.2 Setup Vercel KV
1. Vercel dashboard → project → Storage tab → Create Database → KV
2. Connect to project → env vars `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN` auto-injected
3. Pull to local: `vercel env pull .env.local`

### 1.3 Env vars (`.env.local`)
```
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_MAPS_API_KEY=AIza...
KV_URL=...                        # auto from Vercel
KV_REST_API_URL=...               # auto from Vercel
KV_REST_API_TOKEN=...             # auto from Vercel
KV_REST_API_READ_ONLY_TOKEN=...   # auto from Vercel
WAREHOUSE_ADDRESS="10525 S Ridgeland Ave, Alsip, IL 60803"
```
Add `.env.local` to `.gitignore` (verify). Add `.env.example` with placeholders.

### 1.3 Knowledge base module — `src/lib/chatbot/knowledge-base.js`
Export `SYSTEM_PROMPT` string chứa:
- Business identity (Windy City Ice Cream, location, seasonal May–mid Sept)
- Services: Truck + Push Cart
- Pricing rules (truck $80/hr min 1hr, distance tiers, $4/piece, min 50/30min, sales tax by location)
- FAQ (allergy-friendly, school discount >100 servings, multi-shift, 24h pushcart)
- Contact: email, website, address
- Behavioral rules:
  - LUÔN dùng tool `calculate_estimate` khi user hỏi giá — KHÔNG tính nhẩm
  - LUÔN dùng tool `get_travel_time` khi user cho ZIP — KHÔNG đoán
  - Nếu user muốn đặt/confirm → direct về `/contact` booking form
  - Từ chối lịch sự các câu hỏi ngoài scope (không bàn chính trị, không đưa thông tin cá nhân)
  - Language: **English only** (US market). Nếu user type non-English, politely ask to use English.

## Related Files
- Create: `src/lib/chatbot/knowledge-base.js`, `.env.example`
- Modify: `.gitignore` (verify `.env.local` ignored)

## Success Criteria
- [ ] `pnpm install` không lỗi
- [ ] `.env.local` exists, not tracked by git
- [ ] `SYSTEM_PROMPT` export được, <3KB

## Todo
- [ ] Install deps
- [ ] Setup env vars
- [ ] Write knowledge-base.js
- [ ] Verify .gitignore
