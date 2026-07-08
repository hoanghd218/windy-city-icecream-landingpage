"use client";
import { useState } from "react";
import { trackGenerateLead } from "../lib/analytics/track-lead";

export default function QuoteForm() {
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (status.state === "submitting") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      street: fd.get("street"),
      zip: fd.get("zip"),
      people: fd.get("people"),
      date: fd.get("date"),
      time: fd.get("time"),
      eventType: fd.get("eventType"),
    };
    setStatus({ state: "submitting", message: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed");
      trackGenerateLead("quote_page");
      setStatus({
        state: "success",
        message: "Thanks! We'll text or call you shortly with your quote.",
      });
      form.reset();
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  }

  if (status.state === "success") {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl mb-4">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-primary font-archivo mb-3">
          Quote request sent!
        </h2>
        <p className="text-base text-gray-700 max-w-md mx-auto">
          {status.message}
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" name="firstName" placeholder="First name" required />
        <input className="input" name="lastName" placeholder="Last name" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" name="email" type="email" placeholder="Email" required />
        <input className="input" name="phone" type="tel" placeholder="Phone" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="input md:col-span-2" name="street" placeholder="Event address" required />
        <input className="input" name="zip" placeholder="Zip code" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="input" name="people" type="number" placeholder="Guest count" required />
        <input className="input" name="date" placeholder="Event date (MM/DD/YYYY)" required />
        <input className="input" name="time" placeholder="Time (or TBD)" required />
      </div>

      <select className="input" name="eventType" defaultValue="" required>
        <option value="" disabled>What&apos;s the event?</option>
        <option>Employee Appreciation</option>
        <option>Corporate Picnic</option>
        <option>Birthday</option>
        <option>Graduation</option>
        <option>Block Party</option>
        <option>Marketing</option>
        <option>Customer Appreciation</option>
        <option>Tenant Appreciation</option>
        <option>Other Private Event</option>
        <option>Other Corporate Event</option>
      </select>

      {status.state === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-md">
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={status.state === "submitting"}
        className="w-full bg-[#0072B0] text-white py-3 rounded-md hover:bg-sky-800 transition disabled:opacity-60 font-archivo font-semibold"
      >
        {status.state === "submitting" ? "Sending…" : "Get My Free Quote"}
      </button>

      <style jsx>{`
        .input {
          display: block;
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          background: #fff;
          color: #111;
          font-family: "Archivo", sans-serif;
        }
        .input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
        }
      `}</style>
    </form>
  );
}
