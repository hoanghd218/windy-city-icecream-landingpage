// LLM tool definitions exposed to Claude via Vercel AI SDK.
// Each tool wraps a deterministic JS function — no LLM math, no LLM lookups.
// Tools are built via a factory so per-request context (sessionId) can be
// injected into tool execution.

import { tool } from 'ai';
import { z } from 'zod';
import { calculateEstimate } from './pricing-calculator';
import { getTravelTimeFromZip } from './travel-time-service';
import { submitBookingRequest } from './booking-service';

export function buildChatTools({ sessionId } = {}) {
  return {
    calculate_estimate: tool({
      description:
        'Calculate the total estimated cost for an ice cream service event. ' +
        'ALWAYS use this — never compute pricing yourself. ' +
        'If you do not know travelTimeMinutes yet, call get_travel_time_from_zip first.',
      inputSchema: z.object({
        serviceType: z
          .enum(['truck', 'pushcart'])
          .describe('Type of service: truck or pushcart'),
        hours: z
          .number()
          .min(0.5)
          .max(24)
          .describe('Event duration in hours (e.g. 1, 1.5, 2)'),
        travelTimeMinutes: z
          .number()
          .int()
          .min(0)
          .max(300)
          .describe('One-way travel time from warehouse in minutes'),
        quantity: z
          .number()
          .int()
          .min(1)
          .describe('Number of ice cream pieces requested'),
        taxRate: z
          .number()
          .min(0)
          .max(0.2)
          .default(0.1)
          .describe('Local sales tax rate as decimal (e.g. 0.10 for 10%)'),
      }),
      execute: async (args) => calculateEstimate(args),
    }),

    get_travel_time_from_zip: tool({
      description:
        'Look up one-way driving time in minutes from the Windy City warehouse ' +
        'to the event location. Use this whenever the user provides their event ' +
        'address. ALWAYS pass the street address WITH the ZIP code (both required) ' +
        'for an accurate quote. Result feeds into calculate_estimate.',
      inputSchema: z.object({
        streetAddress: z
          .string()
          .min(5)
          .max(200)
          .describe(
            'Full street address of the event location (e.g. "123 Main St, Chicago, IL"). REQUIRED.'
          ),
        zipCode: z
          .string()
          .regex(/^\d{5}$/, '5-digit US ZIP code')
          .describe('5-digit US ZIP code of the event location. REQUIRED.'),
      }),
      execute: async ({ zipCode, streetAddress }) =>
        getTravelTimeFromZip(zipCode, streetAddress),
    }),

    submit_booking_request: tool({
      description:
        'Submit a booking confirmation request after the customer has received a ' +
        'quote and provided their contact information. Use ONLY when the user has ' +
        'given a full name, valid phone number, and valid email address. Returns ' +
        'a reference ID to share with the customer.',
      inputSchema: z.object({
        fullName: z.string().min(2).max(100).describe("Customer's full name"),
        phone: z
          .string()
          .min(7)
          .max(25)
          .describe('Phone number (digits, spaces, dashes allowed)'),
        email: z.string().email().describe('Valid email address'),
        quoteDetails: z
          .object({
            serviceType: z.string().optional(),
            hours: z.number().optional(),
            zipCode: z.string().optional(),
            quantity: z.number().optional(),
            total: z.number().optional(),
          })
          .optional()
          .describe('Summary of the quote being confirmed (if available)'),
        notes: z.string().max(500).optional().describe('Any extra notes from user'),
      }),
      execute: async (args) =>
        submitBookingRequest({ sessionId, ...args }),
    }),
  };
}
