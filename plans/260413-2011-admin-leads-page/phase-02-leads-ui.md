# Phase 2 — Leads UI

**Priority:** P1 | **Status:** pending | **Effort:** 2h | **Depends on:** Phase 1

## Overview

Replace `/admin/chats/page.jsx` with a leads table: filters at top, table in middle, expand-row to show full chat. URL-synced state for shareable links.

## File: `src/app/admin/chats/page.jsx`

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Leads                                              [Refresh]   │
├────────────────────────────────────────────────────────────────┤
│ [Today] [7d] [30d] [Custom: from___ to___ Apply]   Page size: [20▾]
├────────────────────────────────────────────────────────────────┤
│ Last activity │ Name      │ Phone        │ Email         │ ZIP   │ Estimate │ Ref         │ # │
├────────────────────────────────────────────────────────────────┤
│ 13:45         │ John Doe  │ 555-1234     │ j@x.com       │ 60601 │ $545     │ WCI-XXXXXXX │ 7 │
│   ⤷ [expanded chat: alternating user/assistant bubbles, tool calls collapsible]
│ 12:30         │ —         │ —            │ —             │ 60607 │ $720     │ —           │ 4 │
│ 09:10         │ Jane S.   │ ...          │ ...           │ —     │ —        │ WCI-YYYYYY  │ 12 │
├────────────────────────────────────────────────────────────────┤
│ ← Prev    Page 1 / 3    Next →                  47 leads total │
└────────────────────────────────────────────────────────────────┘
```

### State (URL-synced)

```js
const params = useSearchParams();
const router = useRouter();

const preset = params.get('preset') || 'today'; // today | 7d | 30d | custom
const from = params.get('from') || todayLocal();
const to = params.get('to') || todayLocal();
const page = parseInt(params.get('page') || '1', 10);
const pageSize = parseInt(params.get('pageSize') || '20', 10);

function setQuery(updates) {
  const next = new URLSearchParams(params);
  Object.entries(updates).forEach(([k, v]) => v == null ? next.delete(k) : next.set(k, v));
  router.replace(`?${next.toString()}`);
}
```

### Date preset → range

```js
function rangeFromPreset(preset) {
  const today = new Date();
  if (preset === 'today') return [todayKey(today), todayKey(today)];
  if (preset === '7d') {
    const start = new Date(today); start.setDate(today.getDate() - 6);
    return [todayKey(start), todayKey(today)];
  }
  if (preset === '30d') {
    const start = new Date(today); start.setDate(today.getDate() - 29);
    return [todayKey(start), todayKey(today)];
  }
  return null; // custom
}
```

### Fetch

```js
useEffect(() => {
  const [f, t] = preset === 'custom' ? [from, to] : rangeFromPreset(preset);
  setLoading(true);
  fetch(`/api/admin/leads?from=${f}&to=${t}&page=${page}&pageSize=${pageSize}`)
    .then((r) => r.json())
    .then(setData)
    .finally(() => setLoading(false));
}, [preset, from, to, page, pageSize]);
```

### Row expand → fetch messages

```js
const [expandedId, setExpandedId] = useState(null);
const [expandedMsgs, setExpandedMsgs] = useState({});

function toggleExpand(sessionId) {
  if (expandedId === sessionId) {
    setExpandedId(null);
    return;
  }
  setExpandedId(sessionId);
  if (!expandedMsgs[sessionId]) {
    fetch(`/api/admin/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((d) => setExpandedMsgs((prev) => ({ ...prev, [sessionId]: d.messages || [] })));
  }
}
```

### Components breakdown

| Component | Purpose |
|---|---|
| `<FilterBar />` | preset buttons + custom date inputs + page size selector |
| `<LeadsTable />` | renders rows + handles expand state |
| `<LeadRow />` | one row + nested expanded chat panel |
| `<MessageCard />` | reuse from existing `Chatbot.jsx` admin or inline (chat bubble + tool calls collapsible) |
| `<Pagination />` | prev/next + page indicator |

Keep all in single `page.jsx` file (~300 lines acceptable). Split if exceeds.

### Empty state

When `leads.length === 0`:
```
No leads in this date range.
```

### Loading state

Skeleton table with shimmer rows OR simple "Loading…" text. KISS: just text.

### Error state

If fetch fails: red banner with retry button.

## Related Files

- Modify: `src/app/admin/chats/page.jsx` (full rewrite)
- Reuse: `src/app/api/admin/sessions/[sessionId]/route.js` (no change)
- Maybe deprecate: `src/app/api/admin/sessions/route.js` (keep for now)

## Success Criteria

- [ ] Default `/admin/chats` opens with today + 20/page
- [ ] Click "7d" → URL updates `?preset=7d`, table reloads
- [ ] Click "Custom" → date inputs visible, Apply → reload
- [ ] Page size dropdown changes pagination
- [ ] Click row → row expands showing full chat (chronological)
- [ ] Only one row expanded at a time (closing previous)
- [ ] Empty range shows friendly message
- [ ] Mobile responsive: table → stacked cards
- [ ] Refresh URL preserves filters/page
- [ ] Build + lint pass

## Todo

- [ ] Refactor page.jsx with new layout
- [ ] FilterBar with preset + custom + pageSize
- [ ] LeadsTable + LeadRow + expand panel
- [ ] Pagination component
- [ ] URL state sync (next/navigation)
- [ ] Mobile responsive (Tailwind sm: breakpoints, table → card stack on small screens)
- [ ] Test end-to-end on production
