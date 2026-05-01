// SendGrid email sender for admin notifications.
// Calls the REST API directly to avoid an extra dependency.
// Never throws — returns { ok } and logs errors to console.

const SENDGRID_URL = 'https://api.sendgrid.com/v3/mail/send';
const DEFAULT_ADMIN = 'elena@windycityicecream.com';
const DEFAULT_FROM = 'info@windycityicecream.com';

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export async function sendAdminEmail({ subject, html, text, replyTo }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL || DEFAULT_FROM;
  const to = process.env.ADMIN_EMAIL || DEFAULT_ADMIN;

  if (!apiKey) {
    console.warn('[sendgrid] SENDGRID_API_KEY not set, skipping email');
    return { ok: false, skipped: true };
  }

  const payload = {
    personalizations: [{ to: [{ email: to }], subject }],
    from: { email: from, name: 'Windy City Ice Cream' },
    content: [
      ...(text ? [{ type: 'text/plain', value: text }] : []),
      ...(html ? [{ type: 'text/html', value: html }] : []),
    ],
  };
  if (replyTo) payload.reply_to = { email: replyTo };

  try {
    const res = await fetch(SENDGRID_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[sendgrid] failed', res.status, body.slice(0, 500));
      return { ok: false, status: res.status };
    }
    return { ok: true };
  } catch (err) {
    console.error('[sendgrid] error', err.name, err.message);
    return { ok: false };
  }
}

function renderTable(rows) {
  return `<table style="border-collapse:collapse;margin-bottom:16px">${rows
    .map(
      ([k, v]) => `<tr>
        <td style="padding:6px 12px;border:1px solid #ddd;font-weight:600;background:#f8f8f8">${escapeHtml(k)}</td>
        <td style="padding:6px 12px;border:1px solid #ddd">${escapeHtml(v)}</td>
      </tr>`
    )
    .join('')}</table>`;
}

export function buildContactEmail(contact) {
  const rows = [
    ['First name', contact.firstName],
    ['Last name', contact.lastName],
    ['Email', contact.email],
    ['Phone', contact.phone],
    ['Street', contact.street],
    ['ZIP', contact.zip],
    ['People', contact.people],
    ['Date', contact.date],
    ['Time', contact.time],
    ['Event type', contact.eventType],
    ['Multiple shifts', contact.multipleShifts],
    ['Interests', Array.isArray(contact.interests) ? contact.interests.join(', ') : ''],
    ['Special notes', contact.specialNotes],
  ].filter(([, v]) => v != null && v !== '');

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `<h2 style="font-family:sans-serif;color:#00334E">New contact form submission</h2>${renderTable(rows)}`;
  const subject = `New contact: ${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  return { subject, text, html };
}

export function buildBookingEmail(booking) {
  const rows = [
    ['Reference', booking.referenceId],
    ['Full name', booking.fullName],
    ['Email', booking.email],
    ['Phone', booking.phone],
    ['Notes', booking.notes],
  ].filter(([, v]) => v != null && v !== '');

  const q = booking.quoteDetails || {};
  const quoteRows = [
    ['Service type', q.serviceType],
    ['Hours', q.hours],
    ['Quantity', q.quantity],
    ['ZIP', q.zipCode],
    ['Total', q.total != null ? `$${q.total}` : null],
  ].filter(([, v]) => v != null && v !== '');

  const textParts = [rows.map(([k, v]) => `${k}: ${v}`).join('\n')];
  if (quoteRows.length) {
    textParts.push('\nQuote details:\n' + quoteRows.map(([k, v]) => `  ${k}: ${v}`).join('\n'));
  }

  const html = `<h2 style="font-family:sans-serif;color:#00334E">New chatbot booking request</h2>
    ${renderTable(rows)}
    ${quoteRows.length ? `<h3 style="font-family:sans-serif;color:#CE598C">Quote details</h3>${renderTable(quoteRows)}` : ''}`;

  const subject = `New booking: ${booking.fullName} (${booking.referenceId})`;
  return { subject, text: textParts.join('\n'), html };
}
