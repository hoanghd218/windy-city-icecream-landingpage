---
title: "Admin Leads Page (redesigned from chat history)"
description: "Leads table with filter (day/week/month), pagination (10/20/50), expandable row showing full chat"
status: pending
priority: P1
effort: 3-4h
branch: main
tags: [admin, ui, dynamodb]
created: 2026-04-13
---

# Admin Leads Page

## Summary

Refactor `/admin/chats` from session-list + separate detail panel into a **single leads table**. Each row = 1 chat session with contact info from booking (empty if none). Click row → inline expand full chat transcript. Filter by date range presets (today / this week / this month + custom). Pagination 10/20/50 per page.

## Architecture

```
GET /api/admin/leads?from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&pageSize=20
│
├─► Query GSI by-date-index for each day in range → collect all items
├─► Group by sessionId → compute firstTs, lastTs, msgCount, aggregated metadata
├─► Merge booking-request records (name/phone/email/refId) into matching session
├─► Sort by lastTs DESC, paginate
└─► Return { leads: [{sessionId, firstTs, lastTs, msgCount, customer, metadata}], total, page, pageSize }

GET /api/admin/sessions/[sessionId]  (existing — unchanged, used on row expand)
```

## Scope

### In scope
- Single-table leads page replacing current 2-column chat viewer
- Columns: Last Activity, Name, Phone, Email, ZIP, Estimate, Booking Ref, #Msg
- Empty cells when lead didn't provide info
- Date range presets: Today, Last 7 days, Last 30 days, Custom (2 date inputs)
- Page size selector 10 / 20 / 50
- Pagination with prev/next
- Row expand → full chronological message list (reuse existing MessageCard)
- Reverse sort by lastTs (most recent first)

### Out of scope
- Text search (name/email substring) — can add later
- CSV export — separate task
- Email/SMS notifications on new lead — separate task
- Multi-select + bulk actions

## File Changes

| File | Change |
|------|--------|
| `src/app/api/admin/leads/route.js` | NEW — leads endpoint with range + pagination |
| `src/app/api/admin/sessions/route.js` | KEEP — still used for single-day list if needed (or remove if fully superseded) |
| `src/app/api/admin/sessions/[sessionId]/route.js` | KEEP — row expand fetches messages here |
| `src/app/admin/chats/page.jsx` | REWRITE — table UI, filters, pagination, expand rows |

Decision: keep old `/api/admin/sessions` for now (backward compat); frontend uses only `/api/admin/leads`.

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | Backend `/api/admin/leads` with range + merge + pagination | pending | 1.5h | [phase-01](./phase-01-leads-api.md) |
| 2 | Frontend leads table + filters + pagination + expand | pending | 2h | [phase-02](./phase-02-leads-ui.md) |

## Key Decisions

- **Data aggregation:** Server side — one /api/admin/leads call returns the table. Messages fetched lazily per expand.
- **Date range query cost:** For 30 days × 500 items/day = 15k items max. DDB Query on GSI is paginated (1MB/page). Cap range at 31 days to avoid runaway costs.
- **Pagination:** Server returns all in-range sessions (after aggregation), client does page slicing. Why: aggregation requires reading whole range anyway. Cap total results at 2000.
- **Booking merge:** After scanning, items with `role === 'booking-request'` are parsed out and joined to sessions by `sessionId`.
- **Empty lead display:** `—` placeholder when no contact info.
- **Expand row:** Single row can be expanded at a time (close others on new expand).

## Data Shape

```ts
// GET /api/admin/leads response
{
  from: "2026-04-13",
  to: "2026-04-13",
  total: 47,
  page: 1,
  pageSize: 20,
  totalPages: 3,
  leads: [
    {
      sessionId: "uuid",
      firstTs: "ISO",
      lastTs: "ISO",
      messageCount: 14,
      customer: {                    // null if no booking submitted
        name: "John Doe",
        phone: "...",
        email: "...",
        referenceId: "WCI-XXXXXXXX"
      } | null,
      metadata: {
        zipCode, travelTimeMinutes,
        serviceType, hours, quantity,
        estimateTotal
      }
    }
  ]
}
```

## Success Criteria

- [ ] Default view: today's leads, 20 per page, sorted newest first
- [ ] Filter buttons: Today / 7d / 30d / Custom → re-query
- [ ] Custom range: 2 date inputs + Apply button
- [ ] Page size selector (10/20/50) persists choice in URL or local state
- [ ] Leads without booking → empty cells, no errors
- [ ] Leads with booking → Name, Phone, Email, Ref ID shown
- [ ] Click row → expand chat inline, click again → collapse
- [ ] Server caps date range at 31 days (400 if exceeded)
- [ ] Build + lint pass
- [ ] Deploy + smoke test

## Risks

| Risk | Mitigation |
|------|------------|
| DDB scan cost with large date range | Cap range at 31 days, use Query on GSI not Scan |
| Slow page load with 2000 sessions | Server-side aggregation + cap |
| Expanding multiple rows → messy UI | Auto-close previous on new expand |
| Timezone confusion (UTC vs local) | Use UTC dateKey on server; display in browser locale on client |

## Unresolved Questions

1. **Sorting:** chỉ sort theo lastTs DESC hay cho phép sort các cột khác (estimate, name)?
2. **Timezone:** dateKey dùng UTC — có OK cho user ở Chicago (UTC-5/6) không? Có thể lệch 1 ngày ở rìa.
3. **URL state:** có muốn filter + page lưu vào URL query để refresh/share không? (mặc định: có, cost thấp)
