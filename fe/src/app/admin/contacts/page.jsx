"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminNav from "../admin-nav";

const PAGE_SIZES = [10, 20, 50];
const PRESETS = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "custom", label: "Custom" },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function rangeFromPreset(preset) {
  const today = new Date();
  const today0 = today.toISOString().slice(0, 10);
  if (preset === "today") return [today0, today0];
  if (preset === "7d") {
    const start = new Date(today);
    start.setUTCDate(today.getUTCDate() - 6);
    return [start.toISOString().slice(0, 10), today0];
  }
  if (preset === "30d") {
    const start = new Date(today);
    start.setUTCDate(today.getUTCDate() - 29);
    return [start.toISOString().slice(0, 10), today0];
  }
  return null;
}

function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminContactsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
      <ContactsPageInner />
    </Suspense>
  );
}

function ContactsPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  const preset = params.get("preset") || "today";
  const customFrom = params.get("from") || todayKey();
  const customTo = params.get("to") || todayKey();
  const page = Math.max(1, parseInt(params.get("page") || "1", 10));
  const pageSize = PAGE_SIZES.includes(parseInt(params.get("pageSize") || "20", 10))
    ? parseInt(params.get("pageSize"), 10)
    : 20;

  const [data, setData] = useState({ submissions: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const setQuery = useCallback(
    (updates) => {
      const next = new URLSearchParams(params);
      Object.entries(updates).forEach(([k, v]) => {
        if (v == null || v === "") next.delete(k);
        else next.set(k, String(v));
      });
      router.replace(`?${next.toString()}`);
    },
    [params, router]
  );

  const [from, to] =
    preset === "custom" ? [customFrom, customTo] : rangeFromPreset(preset);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/contacts?from=${from}&to=${to}&page=${page}&pageSize=${pageSize}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.error || "Load failed");
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [from, to, page, pageSize]);

  useEffect(() => {
    load();
    setExpandedId(null);
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <AdminNav />

        <header className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact submissions</h1>
            <p className="text-sm text-gray-500">People who filled out the contact form</p>
          </div>
          <button
            onClick={load}
            className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-100"
          >
            Refresh
          </button>
        </header>

        <FilterBar
          preset={preset}
          from={customFrom}
          to={customTo}
          pageSize={pageSize}
          onPreset={(p) => {
            const updates = { preset: p, page: null };
            if (p !== "custom") {
              updates.from = null;
              updates.to = null;
            }
            setQuery(updates);
          }}
          onCustom={(f, t) => setQuery({ preset: "custom", from: f, to: t, page: null })}
          onPageSize={(n) => setQuery({ pageSize: n, page: null })}
        />

        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-md">
            {error}{" "}
            <button onClick={load} className="underline ml-2">Retry</button>
          </div>
        )}

        <SubmissionsTable
          loading={loading}
          submissions={data.submissions}
          expandedId={expandedId}
          onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
        />

        <Pagination
          page={page}
          totalPages={data.totalPages}
          total={data.total}
          onPage={(n) => setQuery({ page: n })}
        />
      </div>
    </div>
  );
}

function FilterBar({ preset, from, to, pageSize, onPreset, onCustom, onPageSize }) {
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  useEffect(() => {
    setDraftFrom(from);
    setDraftTo(to);
  }, [from, to]);

  return (
    <div className="bg-white rounded-xl shadow p-3 mb-4 flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onPreset(p.id)}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              preset === p.id
                ? "bg-pink-100 border-pink-300 text-pink-800"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex flex-wrap items-center gap-2 ml-1">
          <input
            type="date"
            value={draftFrom}
            max={todayKey()}
            onChange={(e) => setDraftFrom(e.target.value)}
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-md"
          />
          <span className="text-gray-400 text-sm">→</span>
          <input
            type="date"
            value={draftTo}
            max={todayKey()}
            onChange={(e) => setDraftTo(e.target.value)}
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-md"
          />
          <button
            onClick={() => onCustom(draftFrom, draftTo)}
            className="px-3 py-1.5 text-sm rounded-md bg-pink-600 text-white hover:bg-pink-700"
          >
            Apply
          </button>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2 text-sm">
        <label className="text-gray-600">Per page:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(parseInt(e.target.value, 10))}
          className="px-2 py-1.5 border border-gray-300 rounded-md"
        >
          {PAGE_SIZES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SubmissionsTable({ loading, submissions, expandedId, onToggle }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-500 text-center">
        Loading submissions…
      </div>
    );
  }
  if (!submissions.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-400 text-center">
        No submissions in this date range.
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Submitted</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Event date</th>
              <th className="px-3 py-2 text-left">Event type</th>
              <th className="px-3 py-2 text-left">ZIP</th>
              <th className="px-3 py-2 text-right">People</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {submissions.map((s) => (
              <SubmissionRow
                key={s.id}
                s={s}
                expanded={expandedId === s.id}
                onToggle={() => onToggle(s.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubmissionRow({ s, expanded, onToggle }) {
  const fullName = [s.firstName, s.lastName].filter(Boolean).join(" ");
  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer hover:bg-pink-50 ${expanded ? "bg-pink-50" : ""}`}
      >
        <td className="px-3 py-2 whitespace-nowrap">{fmtTime(s.ts)}</td>
        <td className="px-3 py-2">{fullName || <Muted />}</td>
        <td className="px-3 py-2">{s.email || <Muted />}</td>
        <td className="px-3 py-2">{s.phone || <Muted />}</td>
        <td className="px-3 py-2">{s.date || <Muted />}</td>
        <td className="px-3 py-2">{s.eventType || <Muted />}</td>
        <td className="px-3 py-2">{s.zip || <Muted />}</td>
        <td className="px-3 py-2 text-right">{s.people || <Muted />}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} className="bg-gray-50 px-4 py-3">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Field label="Street">{s.street}</Field>
              <Field label="ZIP">{s.zip}</Field>
              <Field label="Time of event">{s.time}</Field>
              <Field label="Multiple shifts">{s.multipleShifts}</Field>
              <Field label="Interested in">
                {Array.isArray(s.interests) && s.interests.length
                  ? s.interests.join(", ")
                  : null}
              </Field>
              <Field label="Special notes" full>
                {s.specialNotes}
              </Field>
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <dt className="text-xs uppercase text-gray-500">{label}</dt>
      <dd className="text-gray-800 whitespace-pre-wrap break-words">
        {children || <Muted />}
      </dd>
    </div>
  );
}

function Muted() {
  return <span className="text-gray-300">—</span>;
}

function Pagination({ page, totalPages, total, onPage }) {
  if (total === 0) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
      <div>{total} submission{total === 1 ? "" : "s"} total</div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-md border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-50"
        >
          ← Prev
        </button>
        <span>Page {page} / {totalPages}</span>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-md border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
