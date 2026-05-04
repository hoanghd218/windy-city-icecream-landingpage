"use client";

// Visual badge for email delivery status shown in admin tables.
// Status values come from server-side `deriveEmailStatus`:
//   'sent'    — SendGrid accepted the request (HTTP 202)
//   'failed'  — SendGrid rejected (non-2xx). Tooltip shows status code if present.
//   'skipped' — SENDGRID_API_KEY missing in env, no attempt made.
//   null/undefined — pre-feature row or update raced (item exists, no status yet).

const STYLES = {
  sent: { label: "Sent", cls: "bg-green-50 text-green-700 border-green-200" },
  failed: { label: "Failed", cls: "bg-red-50 text-red-700 border-red-200" },
  skipped: { label: "Skipped", cls: "bg-gray-50 text-gray-600 border-gray-200" },
};

export default function EmailStatusBadge({ status, errorCode, sentAt }) {
  if (!status) {
    return <span className="text-gray-300">—</span>;
  }
  const conf = STYLES[status] || {
    label: status,
    cls: "bg-gray-50 text-gray-600 border-gray-200",
  };
  const tooltipParts = [];
  if (sentAt) {
    try {
      tooltipParts.push(new Date(sentAt).toLocaleString());
    } catch {
      tooltipParts.push(sentAt);
    }
  }
  if (errorCode) tooltipParts.push(`code: ${errorCode}`);
  const tooltip = tooltipParts.join(" • ");
  return (
    <span
      title={tooltip || undefined}
      className={`inline-block px-2 py-0.5 rounded-md border text-xs font-medium ${conf.cls}`}
    >
      {conf.label}
    </span>
  );
}
