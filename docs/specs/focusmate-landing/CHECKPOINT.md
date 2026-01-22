# CHECKPOINT — focusmate-landing

Last updated: 2026-01-22

## Completed
- T0.1 scaffold files created
- T1.1 waitlist storage + dedupe
- T1.2 email validation heuristics
- T1.3 inline status messaging with icon
- T2.1 fixed navbar + smooth scrolling (offset + reduced motion)
- T2.2 FAQ accordion (single-open, closed by default)

## Current / Next
- Next task: T2.3 Implement Privacy/Terms modals (placeholder + bullets)
- Status: READY

## Notes
- Two waitlist forms exist (`#waitlist-form-hero` and `#waitlist-form`) and should share the same submit handler.
- Vanilla HTML/CSS/JS only; persist waitlist to `localStorage` with `sessionStorage` fallback.
