# CHECKPOINT — focusmate-landing

Last updated: 2026-01-22

## Completed
- T0.1 scaffold files created (index/styles/app)

## Current / Next
- Next task: T1.1 Implement waitlist storage + dedupe core
- Status: READY

## Important constraints
- Vanilla HTML/CSS/JS only (no external libraries).
- Content language is English; CTA is “Get early access”.
- Persist waitlist to `localStorage` with `sessionStorage` fallback.

## Gotchas / Risks discovered
- Two waitlist forms exist (`#waitlist-form-hero` and `#waitlist-form`) and should share the same submit handler.

## Safe resume instructions
- Stay on branch `impl/focusmate-landing`.
- Implement T1.1 in `app.js` and wire to both forms.
- Verify by submitting emails and inspecting storage via browser devtools.

