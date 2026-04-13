// LLM tool definitions exposed to Claude via Vercel AI SDK.
// Each tool wraps a deterministic JS function — no LLM math, no LLM lookups.

import { tool } from 'ai';
import { z } from 'zod';
import { calculateEstimate } from './pricing-calculator';
import { getTravelTimeFromZip } from './travel-time-service';

export const chatTools = {
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
      'to a US ZIP code. Use this whenever the user provides a ZIP code or asks ' +
      'about travel fees. Result feeds into calculate_estimate.',
    inputSchema: z.object({
      zipCode: z
        .string()
        .regex(/^\d{5}$/, '5-digit US ZIP code')
        .describe('5-digit US ZIP code of the event location'),
    }),
    execute: async ({ zipCode }) => getTravelTimeFromZip(zipCode),
  }),
};
