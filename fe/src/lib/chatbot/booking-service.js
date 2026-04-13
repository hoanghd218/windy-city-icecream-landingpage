// Persists a booking request to DynamoDB. Writes to the same chat-logs table
// with role="booking-request" so bookings appear in the session timeline and
// can be filtered by the admin viewer.

import crypto from 'node:crypto';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDocClient, CHAT_TABLE } from './dynamodb-client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s()+\-.]{7,25}$/;

export async function submitBookingRequest({
  sessionId,
  fullName,
  phone,
  email,
  quoteDetails = null,
  notes = '',
}) {
  if (!fullName || fullName.trim().length < 2) {
    return { ok: false, error: 'Full name is required' };
  }
  if (!EMAIL_RE.test(email || '')) {
    return { ok: false, error: 'Valid email is required' };
  }
  if (!PHONE_RE.test(phone || '')) {
    return { ok: false, error: 'Valid phone number is required' };
  }

  const referenceId = 'WCI-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  const now = new Date();

  const client = getDocClient();
  if (!client) {
    // Still return success so chat flow doesn't break; log server-side
    console.warn('[booking] DB unavailable, booking not persisted', referenceId);
    return { ok: true, referenceId, persisted: false };
  }

  try {
    await client.send(
      new PutCommand({
        TableName: CHAT_TABLE,
        Item: {
          sessionId: sessionId || 'unknown',
          ts: now.toISOString(),
          role: 'booking-request',
          content: `Booking: ${fullName}`,
          dateKey: now.toISOString().slice(0, 10),
          booking: {
            referenceId,
            fullName: fullName.trim().slice(0, 100),
            phone: phone.trim().slice(0, 25),
            email: email.trim().toLowerCase().slice(0, 100),
            notes: (notes || '').slice(0, 500),
            quoteDetails: quoteDetails || null,
          },
        },
      })
    );
    return { ok: true, referenceId, persisted: true };
  } catch (err) {
    console.error('[booking] write failed', err.name, err.message);
    return { ok: false, error: 'Could not save booking — please try again', referenceId };
  }
}
