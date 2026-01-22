# TASKS

## Phase 0 — Setup / scaffolding
- T0.1 Create file skeletons and section structure
  - Goal: Add `index.html`, `styles.css`, `app.js` with all required sections and stable ids.
  - Inputs: `docs/specs/focusmate-landing/SPEC.md`
  - Outputs: Skeleton files with semantic markup and placeholder copy blocks.
  - Steps:
    - Create the three deliverable files.
    - Add the required sections in order and add anchor ids for navbar.
    - Add a skip link target and basic layout containers.
  - Done condition: Page loads with the full section structure present (even if styling is minimal).
  - Dependencies: None
  - Risks: Naming/id churn can break scroll targets later.
  - Test/Verification: Open `index.html` locally and confirm sections exist and ids match navbar hrefs.

## Phase 1 — Core logic
- T1.1 Implement waitlist storage + dedupe core
  - Goal: Store waitlist entries in storage with case-insensitive dedupe.
  - Inputs: SPEC storage schema + normalization rules
  - Outputs: JS module/functions for normalize, read, write, dedupe check.
  - Steps:
    - Implement normalization (`trim` + lowercase).
    - Implement storage selection (`localStorage` then fallback to `sessionStorage`).
    - Implement read/write with JSON parsing safety.
  - Done condition: Submitting a new email persists and duplicates are detected.
  - Dependencies: T0.1
  - Risks: Storage exceptions; JSON parse failures.
  - Test/Verification: Use 2 submits with same email in different casing; inspect storage values in DevTools.

- T1.2 Implement email validation (HTML5 + “obviously fake” checks)
  - Goal: Prevent clearly invalid/fake emails while keeping friction low.
  - Inputs: SPEC validation heuristics
  - Outputs: Validation function + UI wiring to show invalid state.
  - Steps:
    - Wire `required` + `type="email"`.
    - Add JS heuristics for obvious fakes (post-normalization).
  - Done condition: Invalid emails show error message; valid emails proceed.
  - Dependencies: T0.1
  - Risks: Overly strict checks; false negatives.
  - Test/Verification: Try inputs like `a@a`, `test@test`, `x@y.z`, and a valid email.

- T1.3 Implement inline status messaging with icon
  - Goal: Display success/duplicate/error messages inline in an accessible way.
  - Inputs: SPEC messaging decision (inline + icon) and copy tone (friendly).
  - Outputs: Message UI component + styles for success/warn/error.
  - Steps:
    - Add message region with `aria-live` where appropriate.
    - Render icon + text for each status.
  - Done condition: After submit, the correct message renders and is readable on mobile.
  - Dependencies: T1.1, T1.2
  - Risks: Poor contrast; message not announced for assistive tech.
  - Test/Verification: Submit valid + duplicate + invalid; check UI and DevTools accessibility tree.

## Phase 2 — Integration
- T2.1 Implement fixed navbar + smooth scrolling with offset and reduced-motion support
  - Goal: Navbar anchors scroll correctly without hiding headings.
  - Inputs: Section ids; `prefers-reduced-motion` requirement
  - Outputs: CSS/JS behavior for scroll; responsive navbar layout.
  - Steps:
    - Add fixed navbar styling and spacing.
    - Implement smooth scroll behavior with offset.
    - Respect reduced motion by disabling animated scrolling.
  - Done condition: Clicking any nav item/CTA lands on the correct section and headings remain visible.
  - Dependencies: T0.1
  - Risks: Offset miscalc across breakpoints; inconsistent behavior across browsers.
  - Test/Verification: Click all nav items; toggle reduced motion in OS/browser settings and re-test.

- T2.2 Implement FAQ accordion (4 items), single-open, all closed by default
  - Goal: Provide scannable FAQ with accessible accordion interactions.
  - Inputs: FAQ content placeholders; single-open decision
  - Outputs: Accordion HTML structure + JS toggle logic + styles.
  - Steps:
    - Use buttons for toggles and a content region per item.
    - Enforce single-open behavior in JS.
  - Done condition: Only one FAQ item can be open at a time; all are closed on first load.
  - Dependencies: T0.1
  - Risks: A11y issues if incorrect ARIA/state handling.
  - Test/Verification: Keyboard navigation, Enter/Space toggling, focus visibility.

- T2.3 Implement Privacy/Terms modals (placeholder + bullets)
  - Goal: Display legal placeholder content in modals without navigation.
  - Inputs: SPEC modal content style (short + bullets), fictitious demo notice
  - Outputs: Modal markup, open/close JS, modal styles and backdrop.
  - Steps:
    - Add modal containers for Privacy and Terms.
    - Support close button + Escape + backdrop click (if chosen in implementation).
  - Done condition: Privacy/Terms open and close reliably and are accessible.
  - Dependencies: T0.1
  - Risks: Focus trap mistakes; background scroll issues.
  - Test/Verification: Open/close via mouse and keyboard; verify focus returns to trigger.

## Phase 3 — Observability / hardening
- T3.1 Accessibility and content polish pass
  - Goal: Ensure baseline A11y and consistent friendly copy across the page.
  - Inputs: A11y decision (semantics + keyboard + skip link); copy tone (friendly)
  - Outputs: Improved labels, focus styles, skip link, refined copy.
  - Steps:
    - Add skip link and ensure it works with fixed navbar.
    - Confirm all interactive elements have accessible names.
    - Ensure focus states are visible and color contrast is acceptable.
  - Done condition: Keyboard-only usage works for all controls; no obvious a11y regressions.
  - Dependencies: T2.1, T2.2, T2.3
  - Risks: Styling regressions on mobile; missed focus state.
  - Test/Verification: Tab through entire page; test in narrow and wide viewports.

## Phase 4 — Release / rollout
- T4.1 Final smoke verification and tidy
  - Goal: Confirm acceptance criteria and ensure no critical console errors.
  - Inputs: `docs/specs/focusmate-landing/ACCEPTANCE.md`
  - Outputs: Final checked implementation ready for review.
  - Steps:
    - Run through happy-path and edge-case checks.
    - Confirm no critical console errors in Chromium.
    - Verify responsive layout at common breakpoints.
  - Done condition: All acceptance criteria are met.
  - Dependencies: All prior tasks
  - Risks: Last-minute regressions; missing copy/details.
  - Test/Verification: Follow ACCEPTANCE checklist manually.

## Chunking guidance
- Suggested implementation chunk size: 1–2 tasks per chunk
- Review cadence: after each chunk, verify acceptance criteria impacted by those tasks
- Stop points: safe to stop after Phase 0, after Phase 2, and after Phase 3

## Execution status
- Status: IN_PROGRESS
- Current task: T1.3
- Completed tasks: T0.1, T1.1, T1.2
- Last updated: 2026-01-22
