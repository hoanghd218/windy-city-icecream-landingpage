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
  address: { type: "address" },
  contact: { type: "contact" },
};

const MARKER_RE = /\[PICK:(service|duration|address|contact)\]/;

// Strip the marker from text for display, and return the marker kind (if any).
export function extractPicker(text) {
  const m = text.match(MARKER_RE);
  if (!m) return { cleanText: text, kind: null };
  return {
    cleanText: text.replace(MARKER_RE, "").trimEnd(),
    kind: m[1],
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s()+\-.]{7,25}$/;

function ContactForm({ onPick, disabled }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const valid =
    name.trim().length >= 2 && PHONE_RE.test(phone) && EMAIL_RE.test(email);

  const submit = () => {
    if (!valid) return;
    onPick(
      `Name: ${name.trim()} | Phone: ${phone.trim()} | Email: ${email.trim()}`
    );
  };

  return (
    <div className="flex flex-col gap-2 mt-2 w-full max-w-xs">
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
        className="text-sm font-archivo px-3 py-1.5 rounded-md bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#CE598C]/30 disabled:opacity-50"
      />
      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={disabled}
        className="text-sm font-archivo px-3 py-1.5 rounded-md bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#CE598C]/30 disabled:opacity-50"
      />
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={disabled}
        className="text-sm font-archivo px-3 py-1.5 rounded-md bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#CE598C]/30 disabled:opacity-50"
      />
      <button
        onClick={submit}
        disabled={disabled || !valid}
        className="px-3 py-1.5 rounded-full text-xs font-archivo font-semibold text-white cursor-pointer disabled:opacity-40"
        style={{ backgroundColor: "var(--secound-heading)" }}
      >
        Send for confirmation
      </button>
    </div>
  );
}

function AddressForm({ onPick, disabled }) {
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const valid = street.trim().length >= 5 && /^\d{5}$/.test(zip);

  const submit = () => {
    if (!valid) return;
    onPick(`Address: ${street.trim()} | ZIP: ${zip}`);
  };

  return (
    <div className="flex flex-col gap-2 mt-2 w-full max-w-xs">
      <input
        type="text"
        placeholder="Street address (e.g. 123 Main St, Chicago, IL)"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={disabled}
        className="text-sm font-archivo px-3 py-1.5 rounded-md bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#CE598C]/30 disabled:opacity-50"
      />
      <input
        type="text"
        inputMode="numeric"
        maxLength={5}
        placeholder="5-digit ZIP"
        value={zip}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={disabled}
        className="text-sm font-archivo px-3 py-1.5 rounded-md bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-[#CE598C]/30 disabled:opacity-50"
      />
      <button
        onClick={submit}
        disabled={disabled || !valid}
        className="px-3 py-1.5 rounded-full text-xs font-archivo font-semibold text-white cursor-pointer disabled:opacity-40"
        style={{ backgroundColor: "var(--secound-heading)" }}
      >
        Send
      </button>
    </div>
  );
}

export function ChatbotQuickPick({ kind, onPick, disabled }) {
  const config = PICKERS[kind];
  if (!config) return null;

  if (config.type === "contact") {
    return <ContactForm onPick={onPick} disabled={disabled} />;
  }
  if (config.type === "address") {
    return <AddressForm onPick={onPick} disabled={disabled} />;
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
