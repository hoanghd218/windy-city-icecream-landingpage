---
title: "Chatbot UI Component"
description: "Add floating chatbot UI with demo responses to all pages"
status: pending
priority: P2
effort: 2h
branch: main
tags: [ui, component, chatbot]
created: 2026-03-23
blockedBy: [260413-1430-chatbot-backend]
---

# Chatbot UI Component

## Summary

Add a floating chatbot widget (bottom-right) to all pages. UI-only with predefined demo responses -- no backend. Follows existing patterns: client component, GSAP animations, Tailwind + glassmorphic styling.

## Phases

| # | Phase | Status | Effort | File |
|---|-------|--------|--------|------|
| 1 | Implement chatbot component | pending | 1.5h | [phase-01](./phase-01-implement-chatbot-component.md) |
| 2 | Integrate into all pages | pending | 0.5h | [phase-02](./phase-02-integrate-into-pages.md) |

## Key Decisions

- **Single component** `src/components/Chatbot.jsx` -- if >200 lines, extract `ChatMessage.jsx` and `ChatInput.jsx`
- **No new deps** -- GSAP (already installed) for open/close animation, Tailwind for styling
- **Demo data inline** -- quick reply topics map to canned responses
- **Import per-page** like Header/Footer (existing pattern, no root layout change)

## Dependencies

- GSAP (already in project)
- Tailwind CSS v4 (already in project)
- globals.css for chatbot-specific keyframes/classes if needed
