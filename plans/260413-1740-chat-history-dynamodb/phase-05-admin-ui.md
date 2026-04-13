# Phase 5 — Admin UI `/admin/chats`

**Priority:** P1 | **Status:** pending | **Effort:** 1.5h | **Depends on:** Phase 4

## Overview

Build simple admin UI: session list + detail drawer. Use existing Tailwind tokens for consistency with landing page.

## 5.1 Layout `/admin/chats/page.jsx`

Two-column (desktop), stacked (mobile):

- **Left:** Date picker + session list (sessionId, lastTs, messageCount, ZIP, estimate total)
- **Right:** Selected session's full message timeline (user bubbles + assistant + tool calls)

Client component — fetch from API routes via browser (cookies carry the Basic Auth after first prompt, so no need to resend password).

```jsx
"use client";
import { useEffect, useState } from "react";

function todayLocal() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function AdminChatsPage() {
  const [date, setDate] = useState(todayLocal());
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/sessions?date=${date}`)
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions || []))
      .finally(() => setLoading(false));
  }, [date]);

  useEffect(() => {
    if (!selected) return setMessages([]);
    fetch(`/api/admin/sessions/${selected}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []));
  }, [selected]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Chat History</h1>
        <div className="grid gap-4 md:grid-cols-[360px_1fr]">
          <SessionList
            date={date} setDate={setDate}
            sessions={sessions} loading={loading}
            selected={selected} onSelect={setSelected}
          />
          <MessageTimeline sessionId={selected} messages={messages} />
        </div>
      </div>
    </div>
  );
}
```

## 5.2 SessionList component

```jsx
function SessionList({ date, setDate, sessions, loading, selected, onSelect }) {
  return (
    <aside className="bg-white rounded-xl shadow p-3 h-[calc(100vh-8rem)] overflow-y-auto">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded-md text-sm"
      />
      <p className="text-xs text-gray-500 mb-2">{sessions.length} sessions</p>
      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      <ul className="space-y-1">
        {sessions.map((s) => (
          <li key={s.sessionId}>
            <button
              onClick={() => onSelect(s.sessionId)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                selected === s.sessionId ? "bg-pink-50 border border-pink-200" : ""
              }`}
            >
              <div className="font-mono text-xs text-gray-500 truncate">
                {s.sessionId.slice(0, 8)}
              </div>
              <div className="text-gray-700">
                {new Date(s.lastTs).toLocaleTimeString()} · {s.messageCount} msg
              </div>
              {s.metadata?.zipCode && (
                <div className="text-xs text-pink-600 mt-0.5">
                  ZIP {s.metadata.zipCode}
                  {s.metadata.estimateTotal && ` · $${s.metadata.estimateTotal}`}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

## 5.3 MessageTimeline component

```jsx
function MessageTimeline({ sessionId, messages }) {
  if (!sessionId) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
        Select a session to view messages
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow p-4 h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="text-xs text-gray-500 mb-3 font-mono break-all">
        Session: {sessionId}
      </div>
      <div className="space-y-3">
        {messages.map((m, i) => (
          <MessageCard key={i} message={m} />
        ))}
      </div>
    </div>
  );
}

function MessageCard({ message }) {
  const isUser = message.role === "user";
  const isTool = message.toolCalls?.length > 0;
  return (
    <div className={`border rounded-lg p-3 ${isUser ? "bg-pink-50 border-pink-100" : "bg-sky-50 border-sky-100"}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-semibold uppercase ${isUser ? "text-pink-700" : "text-sky-700"}`}>
          {message.role}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(message.ts).toLocaleString()}
        </span>
      </div>
      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
      {isTool && (
        <details className="mt-2 text-xs">
          <summary className="cursor-pointer text-gray-600">
            🛠 {message.toolCalls.length} tool call(s)
          </summary>
          <pre className="mt-1 p-2 bg-gray-900 text-gray-100 rounded overflow-x-auto">
            {JSON.stringify(message.toolCalls, null, 2)}
          </pre>
        </details>
      )}
      {message.metadata && Object.keys(message.metadata).length > 0 && (
        <div className="mt-1 text-xs text-gray-600">
          {Object.entries(message.metadata).map(([k, v]) => (
            <span key={k} className="mr-2">
              <b>{k}:</b> {String(v)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 5.4 Optional: minimal root redirect

`/admin/page.jsx` → redirect to `/admin/chats` so `/admin` bare URL works.

```js
import { redirect } from "next/navigation";
export default function AdminRoot() { redirect("/admin/chats"); }
```

## 5.5 Deployment

```bash
cd fe
vercel --prod --yes
```

## Related Files

- Create: `src/app/admin/chats/page.jsx`
- Create: `src/app/admin/page.jsx`

## Success Criteria

- [ ] Browse to `/admin/chats` → browser prompts for password
- [ ] Wrong password denied; correct password shows UI
- [ ] Date picker loads correct day's sessions
- [ ] Click session → shows chronological messages
- [ ] Tool calls collapsible with JSON details
- [ ] ZIP + estimate total visible in session list sidebar
- [ ] Mobile responsive (stacks to single column)
- [ ] `noindex` verified in HTTP response headers

## Todo

- [ ] Write page.jsx with layout
- [ ] SessionList component
- [ ] MessageTimeline + MessageCard
- [ ] Redirect /admin → /admin/chats
- [ ] Build + deploy
- [ ] Manual test end-to-end: chat → check admin sees it
- [ ] Verify no DevTools leak of password

## Post-Launch Checklist

- [ ] Save admin password in password manager
- [ ] Rotate `ADMIN_PASSWORD` every 90 days
- [ ] Monitor DynamoDB cost in AWS billing (expect $0)
- [ ] Announce to stakeholders with URL + login
