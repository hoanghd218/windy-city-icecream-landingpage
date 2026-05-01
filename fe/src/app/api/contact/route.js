// POST /api/contact — saves contact form submission to DynamoDB.
// Reuses CHAT_TABLE with role='contact-submission'; date GSI enables admin range queries.

import crypto from 'node:crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, CHAT_TABLE } from '@/lib/chatbot/dynamodb-client';
import { sendAdminEmail, buildContactEmail } from '@/lib/email/sendgrid';

export const runtime = 'nodejs';

const MAX_FIELD = 500;
const MAX_NOTES = 5000;

function clean(v, max = MAX_FIELD) {
  if (typeof v !== 'string') return '';
  const trimmed = v.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || '';
  return crypto.createHash('sha256').update(ip + salt).digest('hex').slice(0, 32);
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const street = clean(body.street);
  const zip = clean(body.zip);
  const people = clean(body.people);
  const date = clean(body.date);
  const time = clean(body.time);
  const interests = Array.isArray(body.interests)
    ? body.interests.map((s) => clean(s)).filter(Boolean).slice(0, 5)
    : [];
  const eventType = clean(body.eventType);
  const multipleShifts = clean(body.multipleShifts);
  const specialNotes = clean(body.specialNotes, MAX_NOTES);

  // Required: firstName, lastName, email, street, zip, people, date, time, eventType
  if (!firstName || !lastName || !email || !street || !zip || !people || !date || !time || !eventType) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 });
  }

  const client = getDocClient();
  if (!client) {
    return Response.json({ error: 'Database unavailable' }, { status: 503 });
  }

  const now = new Date();
  const id = crypto.randomUUID();
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '';
  const userAgent = (req.headers.get('user-agent') || '').slice(0, 500);

  const item = {
    sessionId: `contact-${id}`,
    ts: now.toISOString(),
    dateKey: now.toISOString().slice(0, 10),
    role: 'contact-submission',
    content: `Contact form: ${firstName} ${lastName}`,
    contact: {
      firstName,
      lastName,
      email,
      phone,
      street,
      zip,
      people,
      date,
      time,
      interests,
      eventType,
      multipleShifts,
      specialNotes,
    },
    ipHash: ip ? hashIp(ip) : undefined,
    userAgent,
  };

  try {
    await client.send(new PutCommand({ TableName: CHAT_TABLE, Item: item }));
  } catch (err) {
    console.error('[contact]', err.name, err.message);
    return Response.json({ error: 'Failed to save submission' }, { status: 500 });
  }

  // Fire-and-forget admin notification — don't block the response.
  const { subject, html, text } = buildContactEmail(item.contact);
  sendAdminEmail({ subject, html, text, replyTo: email }).catch(() => {});

  return Response.json({ ok: true, id });
}
