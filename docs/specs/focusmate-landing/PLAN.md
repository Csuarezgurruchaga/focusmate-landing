# PLAN — FocusMate Landing (Waitlist)

## Milestones
1) **Scaffold & content structure**
   - Create `index.html`, `styles.css`, `app.js` with the required sections and semantic structure.
   - Establish ids/anchors for smooth scrolling and consistent layout.

2) **Visual design (mobile-first)**
   - Implement glassy/gradient look, responsive typography, spacing system, and section layouts.
   - Ensure navbar is fixed and readable over content.

3) **Core interactions**
   - Smooth scroll behavior with navbar offset and `prefers-reduced-motion` handling.
   - Waitlist form validation, storage persistence, and dedupe behavior.
   - Inline status messaging with iconography.

4) **Disclosure UI**
   - FAQ accordion (4 items), single-open, closed by default, accessible toggles.
   - Privacy/Terms modals with placeholder content + bullets; close interactions (button + Escape).

5) **Polish & verification**
   - Accessibility pass (labels, focus states, skip link, keyboard support).
   - Browser smoke checks and responsive sanity checks across breakpoints.

## Dependencies / Prerequisites
- None (vanilla files only).

## Test strategy (lightweight)
- Manual verification in Chromium:
  - Load page with DevTools console open.
  - Validate waitlist flow end-to-end (new email, duplicate email, invalid email).
  - Verify smooth scroll + offset, and behavior with reduced motion enabled.
  - Verify FAQ and modal keyboard interactions.

## Rollout / rollback
- Rollout is a static site deploy (or local file open).
- Rollback is reverting static assets to a previous version (no data migrations).

