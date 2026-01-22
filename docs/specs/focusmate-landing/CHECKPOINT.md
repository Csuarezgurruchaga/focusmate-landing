# CHECKPOINT — focusmate-landing
Last updated: 2026-01-22
## Completed
- T0.1 scaffold files created
- T1.1 waitlist storage + dedupe
- T1.2 email validation heuristics
- T1.3 inline status messaging with icon
- T2.1 fixed navbar + smooth scrolling (offset + reduced motion)
- T2.2 FAQ accordion (single-open, closed by default)
- T2.3 Privacy/Terms modals (placeholder + bullets)
- T3.1 a11y + content polish pass
## Current / Next
- Next task: T4.1 Final smoke verification and tidy
- Status: READY
## Important constraints
- Vanilla HTML/CSS/JS only.
- Waitlist: `localStorage` → `sessionStorage`; if both fail, allow submit with “may not persist” message.
## Gotchas / Risks discovered
- Two waitlist forms exist (`#waitlist-form-hero` and `#waitlist-form`) and should share the same submit handler.
- Skip link should move focus to main content (not just scroll), especially with fixed navbar.
## Safe resume instructions
- Open `index.html` in Chromium and follow `docs/specs/focusmate-landing/ACCEPTANCE.md`.
