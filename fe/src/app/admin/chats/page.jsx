"use client";

import { useEffect, useState, useCallback } from "react";

function todayLocalISO() {
  return new Date().toISOString().slice(0, 10);
}

function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function fmtDateTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminChatsPage() {
  const [date, setDate] = useState(todayLocalISO());
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const loadSessions = useCallback(() => {
    setSessionsLoading(true);
    setSessionsError(null);
    fetch(`/api/admin/sessions?date=${date}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.error || "Load failed");
        setSessions(d.sessions || []);
      })
      .catch((e) => setSessionsError(e.message))
      .finally(() => setSessionsLoading(false));
  }, [date]);

  useEffect(() => {
    loadSessions();
    setSelected(null);
    setMessages([]);
  }, [loadSessions]);

  useEffect(() => {
    if (!selected) return;
    setMessagesLoading(true);
    fetch(`/api/admin/sessions/${selected}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setMessagesLoading(false));
  }, [selected]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat History</h1>
            <p className="text-sm text-gray-500">Admin view of all chatbot conversations</p>
          </div>
          <button
            onClick={loadSessions}
            className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-100"
          >
            Refresh
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-[360px_1fr]">
          <aside className="bg-white rounded-xl shadow p-3 h-[calc(100vh-8rem)] overflow-y-auto">
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              max={todayLocalISO()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <p className="text-xs text-gray-500 mb-2">
              {sessions.length} session{sessions.length === 1 ? "" : "s"}
            </p>

            {sessionsLoading && <p className="text-sm text-gray-500">Loading…</p>}
            {sessionsError && (
              <p className="text-sm text-red-600">Error: {sessionsError}</p>
            )}
            {!sessionsLoading && !sessionsError && sessions.length === 0 && (
              <p className="text-sm text-gray-400">No sessions on this date.</p>
            )}

            <ul className="space-y-1">
              {sessions.map((s) => (
                <li key={s.sessionId}>
                  <button
                    onClick={() => setSelected(s.sessionId)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selected === s.sessionId
                        ? "bg-pink-50 border border-pink-200"
                        : "hover:bg-gray-100 border border-transparent"
                    }`}
                  >
                    <div className="font-mono text-xs text-gray-500 truncate">
                      {s.sessionId.slice(0, 8)}…
                    </div>
                    <div className="text-gray-800 mt-0.5">
                      {fmtTime(s.lastTs)} · {s.messageCount} msg
                    </div>
                    {(s.metadata?.zipCode || s.metadata?.estimateTotal) && (
                      <div className="text-xs text-pink-600 mt-0.5">
                        {s.metadata?.zipCode && <span>ZIP {s.metadata.zipCode}</span>}
                        {s.metadata?.estimateTotal && (
                          <span> · ${s.metadata.estimateTotal}</span>
                        )}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="bg-white rounded-xl shadow p-4 h-[calc(100vh-8rem)] overflow-y-auto">
            {!selected ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Select a session to view messages
              </div>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-3 font-mono break-all border-b pb-2">
                  Session: {selected}
                </div>
                {messagesLoading && (
                  <p className="text-sm text-gray-500">Loading messages…</p>
                )}
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <MessageCard key={`${m.ts}-${i}`} message={m} />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function MessageCard({ message }) {
  const isUser = message.role === "user";
  const hasTools = Array.isArray(message.toolCalls) && message.toolCalls.length > 0;
  return (
    <div
      className={`border rounded-lg p-3 ${
        isUser
          ? "bg-pink-50 border-pink-100"
          : "bg-sky-50 border-sky-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            isUser ? "text-pink-700" : "text-sky-700"
          }`}
        >
          {message.role}
        </span>
        <span className="text-xs text-gray-500">{fmtDateTime(message.ts)}</span>
      </div>
      <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
        {message.content}
      </div>
      {hasTools && (
        <details className="mt-2 text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
            🛠 {message.toolCalls.length} tool call
            {message.toolCalls.length > 1 ? "s" : ""}
          </summary>
          <pre className="mt-1 p-2 bg-gray-900 text-gray-100 rounded overflow-x-auto text-[11px] leading-snug">
            {JSON.stringify(message.toolCalls, null, 2)}
          </pre>
        </details>
      )}
      {message.metadata && Object.keys(message.metadata).length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-600">
          {Object.entries(message.metadata).map(([k, v]) => (
            <span key={k}>
              <b>{k}:</b> {String(v)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
