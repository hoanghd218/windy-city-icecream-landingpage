# Code Review: Chatbot UI

## Scope
- Files: `src/components/Chatbot.jsx` (new, 270 LOC), `src/app/globals.css` (modified), 7 page files (modified)
- Focus: New chatbot UI component + page integrations

## Overall Assessment

Solid implementation. The component is well-structured, follows existing codebase patterns (GSAP, Tailwind, `"use client"`, per-page imports), and stays under the 200-line guideline for the core logic. Good accessibility baseline with aria labels, keyboard handling, and reduced-motion support. A few issues worth addressing below.

## Critical Issues

None.

## High Priority

### 1. XSS risk: user input rendered without sanitization
**File:** `Chatbot.jsx:209`
```jsx
{msg.text}
```
Currently safe because React auto-escapes JSX string interpolation. However, if this component ever evolves to render HTML (e.g., bot responses with links via `dangerouslySetInnerHTML`), it becomes vulnerable. **No fix needed now**, but worth noting in a comment for future developers.

### 2. Module-level mutable state (`msgId`) breaks with concurrent renders
**File:** `Chatbot.jsx:28`
```jsx
let msgId = 0;
const createMsg = (text, sender) => ({ text, sender, id: ++msgId });
```
`msgId` is module-scoped, meaning if multiple Chatbot instances exist (they do -- one per page, though only one renders at a time due to routing), the counter is shared. More importantly, in React Strict Mode (dev), effects run twice, which could cause ID mismatches. In practice this is harmless for this use case since IDs are only used as `key` props and never compared. **Low risk but easy fix:**
```jsx
// Move inside component using useRef
const msgIdRef = useRef(0);
const createMsg = useCallback((text, sender) => ({
  text, sender, id: ++msgIdRef.current
}), []);
```

### 3. DRY violation: Chatbot imported in 7 pages instead of root layout
**Files:** All 7 page files

The Chatbot is a global fixed-position overlay with no page-specific props. Importing it in every page violates DRY and creates maintenance burden. The same pattern exists for Header/Footer (per the CLAUDE.md architecture note), so this follows existing convention. However, moving Chatbot to `layout.jsx` would be the ideal approach since it's a client component wrapping and the layout already imports `globals.css`. **Recommend future refactor** -- not blocking.

## Medium Priority

### 4. GSAP animations not cleaned up properly
**File:** `Chatbot.jsx:49-56, 59-67`

The bubble entrance animation (line 49) and open/close animation (line 59) use raw `gsap.fromTo()` without `gsap.context()` for cleanup. The existing codebase (Header, Footer) wraps GSAP calls in `gsap.context()` and returns `ctx.revert()`. This component should follow the same pattern to prevent memory leaks on unmount.

**Fix:**
```jsx
useEffect(() => {
  if (!bubbleRef.current) return;
  const ctx = gsap.context(() => {
    gsap.fromTo(bubbleRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 1 }
    );
  });
  return () => ctx.revert();
}, []);
```

### 5. `setTimeout` for focus and bot responses not cleared on unmount
**File:** `Chatbot.jsx:66, 91`

Two `setTimeout` calls exist:
- Line 66: `setTimeout(() => inputRef.current?.focus(), 100)` -- if component unmounts within 100ms, this fires on a stale ref.
- Line 91: `setTimeout(() => setMessages(...)`, 500)` -- if component unmounts within 500ms, React will warn about state updates on unmounted components.

**Fix:** Store timeout IDs in a ref and clear them in cleanup:
```jsx
const timeoutRefs = useRef([]);
// In addBotResponse:
const id = setTimeout(() => { ... }, 500);
timeoutRefs.current.push(id);
// In useEffect cleanup:
return () => timeoutRefs.current.forEach(clearTimeout);
```

### 6. Quick reply buttons use inline `onMouseEnter`/`onMouseLeave` for hover
**File:** `Chatbot.jsx:226-230`

Inline JS hover handlers are fragile (won't fire on touch devices, can get stuck). Use Tailwind hover classes instead:
```jsx
className="... hover:bg-[#00334E] hover:text-white"
```
This also removes the need for the `onMouseEnter`/`onMouseLeave` handlers entirely.

### 7. Hardcoded color values instead of CSS variables
**File:** `Chatbot.jsx:134, 205, 167`

The component uses hardcoded hex values (`#CE598C`, `#00334E`) that are already defined as CSS variables (`--secound-heading`, `--primary-heading`) in `globals.css`. Use the existing utility classes (`.text-primary`, etc.) or reference the variables for consistency:
```jsx
style={{ backgroundColor: "var(--secound-heading)" }}
// or use the existing Tailwind class: bg-[var(--secound-heading)]
```

## Low Priority

### 8. `font-architect` / `font-archivo` used as class names
**File:** `Chatbot.jsx:173, 198, 221, 251`

These work because they're defined in `globals.css` as custom classes. Consistent with existing codebase usage -- no change needed.

### 9. Chat window `aria-modal="true"` without focus trap
**File:** `Chatbot.jsx:154`

The dialog declares `aria-modal="true"` but does not trap focus within the chat window. This means screen reader users can tab out of the "modal" into background content, which violates the modal contract. Two options:
- Remove `aria-modal="true"` and use `role="complementary"` instead (since it's a non-blocking overlay)
- Implement a focus trap (heavier lift, not warranted for a simple chat widget)

**Recommend:** Change to `role="complementary"` and remove `aria-modal`.

### 10. No typing indicator
The bot responds after a fixed 500ms delay with no visual feedback. A simple "..." typing indicator between user message and bot response would improve UX. Not a code quality issue -- product enhancement.

## Edge Cases Found by Scout

1. **Page navigation resets chat state:** Since Chatbot is mounted per-page (not in layout), navigating between pages destroys and recreates the component, losing conversation history. This is likely acceptable for a demo-only chatbot but worth noting.
2. **Multiple rapid sends:** User can spam the send button. Each triggers a 500ms delayed bot response. Messages queue correctly due to functional setState, so no bug, but rapid sends create a wall of identical "default" responses.
3. **Empty input with whitespace:** Handled correctly -- `inputValue.trim()` check on line 109 and disabled button on line 256.
4. **Very long messages:** No max-length on input. Extremely long messages will overflow the bubble. `max-w-[80%]` helps but text wrapping could break with a single unbroken string (no word-break/overflow-wrap).

## Positive Observations

- Clean component structure with proper separation of concerns
- Good use of `useCallback` for event handlers
- Escape key to close -- nice accessibility touch
- `prefers-reduced-motion` support in CSS for the pulse animation
- Consistent placement after `<Footer />` across all pages
- Proper use of `aria-label` on all interactive elements
- Responsive width with `max-w-[calc(100vw-2rem)]`
- Smart UX: quick replies disappear after first user message

## Recommended Actions

1. **[High]** Wrap GSAP animations in `gsap.context()` with cleanup -- follow Header/Footer pattern
2. **[High]** Clear `setTimeout` calls on unmount to prevent stale state updates
3. **[Medium]** Replace inline hover handlers with Tailwind `hover:` classes
4. **[Medium]** Use CSS variables instead of hardcoded colors
5. **[Low]** Change `role="dialog" aria-modal="true"` to `role="complementary"`
6. **[Low]** Add `overflow-wrap: break-word` to message bubbles for long unbroken strings
7. **[Future]** Consider moving Chatbot to `layout.jsx` to eliminate 7-page import duplication

## Metrics

- Type Coverage: N/A (JSX project, no TypeScript)
- Test Coverage: 0% (no tests -- acceptable for UI-only demo component)
- Linting Issues: 0 new errors
- Component LOC: 270 (slightly over 200-line guideline but acceptable for a self-contained component)

## Unresolved Questions

1. Is conversation persistence across page navigations desired? If so, Chatbot should move to layout or use a state manager.
2. Will the chatbot eventually connect to a real backend? If so, the `addBotResponse` function needs error handling, loading states, and input sanitization for API calls.
