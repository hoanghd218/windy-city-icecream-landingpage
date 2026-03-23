---
phase: 2
title: "Integrate Chatbot Into All Pages"
status: pending
priority: P2
effort: 0.5h
---

# Phase 2: Integrate Chatbot Into All Pages

## Context Links
- [Phase 1](./phase-01-implement-chatbot-component.md) -- component must be complete first
- [Home page](../../src/app/page.jsx) -- reference for import pattern

## Overview

Import and render `<Chatbot />` on every page, following the existing Header/Footer per-page import pattern.

## Related Code Files

**Modify (7 files):**
- `src/app/page.jsx` -- home
- `src/app/about/page.jsx`
- `src/app/contact/page.jsx`
- `src/app/events/page.jsx`
- `src/app/pricing/page.jsx`
- `src/app/refunds/page.jsx`
- `src/app/service/page.jsx`

## Implementation Steps

### 1. For each page file

Add import statement (adjust relative path per depth):

```jsx
// Home page (src/app/page.jsx)
import Chatbot from "../components/Chatbot";

// Subpages (src/app/<route>/page.jsx)
import Chatbot from "../../components/Chatbot";
```

### 2. Add `<Chatbot />` to JSX

Place `<Chatbot />` at the end of the return JSX, after `<Footer />`:

```jsx
return (
  <>
    <Header />
    {/* ... page content ... */}
    <Footer />
    <Chatbot />
  </>
);
```

### 3. Verify each page

- Run `pnpm build` to check for import/render errors
- Visually verify bubble appears on each page
- Confirm chat opens/closes on each page

## Todo List

- [ ] Add Chatbot import + render to `src/app/page.jsx`
- [ ] Add Chatbot import + render to `src/app/about/page.jsx`
- [ ] Add Chatbot import + render to `src/app/contact/page.jsx`
- [ ] Add Chatbot import + render to `src/app/events/page.jsx`
- [ ] Add Chatbot import + render to `src/app/pricing/page.jsx`
- [ ] Add Chatbot import + render to `src/app/refunds/page.jsx`
- [ ] Add Chatbot import + render to `src/app/service/page.jsx`
- [ ] Run `pnpm build` -- no errors
- [ ] Run `pnpm lint` -- no warnings

## Success Criteria

- `<Chatbot />` renders on all 7 pages
- No build or lint errors
- Chat bubble visible and functional on every page
- No z-index conflicts with existing page elements

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Missed a page | Checklist above covers all 7 pages from glob results |
| Import path wrong | Home uses `../components/`, subpages use `../../components/` |

## Next Steps

- After integration, run full build + lint check
- Future: replace demo responses with real backend/AI integration
