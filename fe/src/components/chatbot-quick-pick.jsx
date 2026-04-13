"use client";

import { useState } from "react";

// Configuration for each quick-pick marker the LLM can emit.
const PICKERS = {
  service: {
    type: "buttons",
    options: [
      { label: "🚚 Ice Cream Truck", value: "Ice Cream Truck" },
      { label: "🛒 Push Cart", value: "Push Cart" },
    ],
  },
  duration: {
    type: "buttons",
    options: [
      { label: "30 min", value: "30 minutes" },
      { label: "1 hr", value: "1 hour" },
      { label: "1.5 hr", value: "1.5 hours" },
      { label: "2 hr", value: "2 hours" },
      { label: "3 hr", value: "3 hours" },
      { label: "4+ hr", value: "4 hours" },
    ],
  },
  zip: { type: "zip" },
};

const MARKER_RE = /\[PICK:(service|duration|zip)\]/;

// Strip the marker from text for display, and return the marker kind (if any).
export function extractPicker(text) {
  const m = text.match(MARKER_RE);
  if (!m) return { cleanText: text, kind: null };
  return {
    cleanText: text.replace(MARKER_RE, "").trimEnd(),
    kind: m[1],
  };
}

export function ChatbotQuickPick({ kind, onPick, disabled }) {
  const [zip, setZip] = useState("");
  const config = PICKERS[kind];
  if (!config) return null;

  if (config.type === "zip") {
    const submit = () => {
      if (/^\d{5}$/.test(zip)) {
        onPick(`My ZIP code is ${zip}`);
        setZip("");
      }
    };
    return (
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          placeholder="5-digit ZIP"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={disabled}
          className="flex-1 text-sm font-archivo px-3 py-1.5 rounded-full bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#CE598C]/30 disabled:opacity-50"
          aria-label="Enter ZIP code"
        />
        <button
          onClick={submit}
          disabled={disabled || !/^\d{5}$/.test(zip)}
          className="px-3 py-1.5 rounded-full text-xs font-archivo font-semibold text-white cursor-pointer disabled:opacity-40"
          style={{ backgroundColor: "var(--secound-heading)" }}
        >
          Send
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {config.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onPick(opt.value)}
          disabled={disabled}
          className="px-3 py-1.5 rounded-full text-xs font-archivo border cursor-pointer chat-quick-reply disabled:opacity-50"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
