---
phase: 1
title: "Implement Chatbot Component"
status: pending
priority: P2
effort: 1.5h
---

# Phase 1: Implement Chatbot Component

## Context Links
- [globals.css](../../src/app/globals.css) -- existing styles, add chatbot classes here
- [Header.jsx](../../src/components/Header.jsx) -- reference for GSAP animation pattern
- [Footer.jsx](../../src/components/Footer.jsx) -- reference for component structure

## Overview

Build `src/components/Chatbot.jsx` -- a floating chat widget with bubble trigger, chat window, message display, quick replies, and text input. All demo/mock data.

## Key Insights

- Site uses `gsap.context()` pattern with refs + `useEffect` for animations (see Header.jsx)
- Glassmorphic style: `backdrop-blur`, semi-transparent backgrounds, rounded corners
- Colors: `#00334E` (primary dark), `#CE598C` (pink accent), `#57CEF7` (cyan)
- Fonts: `.font-architect` for display, `.font-archivo` for body text
- Site respects `prefers-reduced-motion` -- chatbot must too

## Architecture

```
Chatbot.jsx (main component, ~150-180 lines)
  |-- State: isOpen, messages[], inputValue
  |-- Floating bubble button (fixed bottom-right)
  |-- Chat window (conditional render)
       |-- Header bar (avatar, title, close btn)
       |-- Message list (scrollable, auto-scroll to bottom)
       |-- Quick reply buttons (shown when no user messages yet)
       |-- Input bar (text input + send button)
```

If component exceeds 200 lines, extract:
- `src/components/chat-message.jsx` -- single message bubble
- `src/components/chat-input.jsx` -- input bar with send button

## Demo Data

```js
const QUICK_REPLIES = [
  { label: "Our Flavors", key: "flavors" },
  { label: "Upcoming Events", key: "events" },
  { label: "Pricing", key: "pricing" },
  { label: "Contact Us", key: "contact" },
];

const BOT_RESPONSES = {
  greeting: "Hey there! Welcome to Windy City Ice Cream! How can I help you today?",
  flavors: "We have amazing flavors like Strawberry Bliss, Mango Tango, and Blue Moon! Check out our menu for the full list.",
  events: "We have exciting events coming up! Visit our Events page for catering, parties, and pop-up schedules.",
  pricing: "Our pricing starts at $4 for a single scoop. Check our Pricing page for packages and catering rates!",
  contact: "You can reach us through our Contact page, or call us at (312) 555-ICECREAM. We'd love to hear from you!",
  default: "Thanks for reaching out! For more details, feel free to explore our website or visit our Contact page.",
};
```

## Related Code Files

**Create:**
- `src/components/Chatbot.jsx` -- main chatbot component

**Modify:**
- `src/app/globals.css` -- add chatbot-specific styles (bubble pulse animation, message animations)

## Implementation Steps

### 1. Create `src/components/Chatbot.jsx`

1. Add `"use client"` directive
2. Import `useState`, `useEffect`, `useRef` from React, `gsap` for animations
3. Define `QUICK_REPLIES` and `BOT_RESPONSES` constants at top
4. Component state:
   - `isOpen` (boolean) -- toggle chat window
   - `messages` (array) -- `{ text, sender: "bot"|"user", id }`
   - `inputValue` (string) -- controlled input
5. Refs: `chatWindowRef`, `messagesEndRef`, `bubbleRef`

### 2. Chat bubble button

- Fixed position: `fixed bottom-6 right-6 z-50`
- Circular, 56px, pink background (`#CE598C`), white ice cream icon (SVG or emoji)
- GSAP scale animation on mount (bounceIn)
- Subtle pulse animation via CSS keyframe
- `aria-label="Open chat"`, `role="button"`
- onClick toggles `isOpen`

### 3. Chat window

- Fixed position: `fixed bottom-24 right-6 z-50`
- Size: `w-80 h-[28rem]` desktop, full-width on mobile (`max-w-[calc(100vw-2rem)]`)
- Glassmorphic: `bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20`
- Flex column layout: header, messages area (flex-1 overflow-y-auto), input bar
- GSAP open animation: scale from 0.8 + opacity 0 -> 1, origin bottom-right
- GSAP close: reverse

### 4. Chat header

- Background: `#00334E`, text white, rounded top corners
- Bot avatar (small ice cream icon), bot name "Scoopy" in `.font-architect`
- Close button (X icon) with `aria-label="Close chat"`

### 5. Message area

- Scrollable container, padding
- Bot messages: left-aligned, light blue bg (`#57CEF7/20`), rounded
- User messages: right-aligned, pink bg (`#CE598C`), white text, rounded
- Auto-scroll to bottom on new message via `messagesEndRef.scrollIntoView()`
- On open, show greeting message

### 6. Quick reply buttons

- Show below greeting when no user messages sent yet
- Horizontal wrap layout, small rounded pills
- Styled: border `#00334E`, text `#00334E`, hover fills with `#00334E` + white text
- onClick: adds user message with label text, then bot response after 500ms delay

### 7. Text input bar

- Bottom of chat window, border-top separator
- Input: flex-1, placeholder "Type a message..."
- Send button: pink bg, white arrow icon
- Submit on Enter key or click send
- On submit: add user message, respond with `BOT_RESPONSES.default` after 500ms
- Clear input after send

### 8. Accessibility

- `aria-label` on bubble, close btn, send btn, input
- `role="dialog"` and `aria-modal="true"` on chat window
- Focus trap: focus input when chat opens
- Escape key closes chat
- Tab navigation works through interactive elements

### 9. Add CSS to globals.css

```css
/* Chatbot bubble pulse */
@keyframes chat-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(206, 89, 140, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(206, 89, 140, 0); }
}
.chat-bubble-pulse {
  animation: chat-pulse 2s ease-in-out infinite;
}
```

Add chatbot animations to `prefers-reduced-motion` media query.

## Todo List

- [ ] Create `src/components/Chatbot.jsx` with all sections above
- [ ] Add chatbot CSS classes to `globals.css`
- [ ] Add chatbot to `prefers-reduced-motion` media query
- [ ] Verify component is under 200 lines (split if needed)
- [ ] Test GSAP open/close animation
- [ ] Test quick replies produce correct bot responses
- [ ] Test text input + send flow
- [ ] Test keyboard nav (Escape close, Enter send, focus management)
- [ ] Test mobile responsiveness

## Success Criteria

- Component renders floating bubble on any page
- Chat opens/closes with smooth GSAP animation
- Quick replies show correct demo responses
- Free-text input gets default response
- Accessible: keyboard navigable, screen reader labels
- Responsive: usable on 320px+ screens
- Matches brand aesthetic (colors, fonts, glassmorphic)
- File(s) under 200 lines each

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Component exceeds 200 lines | Pre-plan split into chat-message.jsx + chat-input.jsx |
| Z-index conflicts with header/modals | Use z-50 (header likely z-40 or lower) |
| GSAP cleanup on unmount | Use `gsap.context()` with cleanup in useEffect return |
| Mobile keyboard pushes chat up | Use `fixed` positioning, test on mobile viewport |
