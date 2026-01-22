# FocusMate Landing (Waitlist) — SPEC

## Summary
Build a new, single-page marketing landing for a fictitious product named **FocusMate**. The page captures leads via a waitlist form (email), stores submissions in `localStorage` with deduplication, and provides a polished, mobile-first, vanilla HTML/CSS/JS experience.

> The SPEC is the source of truth. If implementation deviates, update the SPEC + TASKS + ACCEPTANCE and record it in the Changelog.

## Goals / Non-goals

### Goals
- Single-page landing with sections: Hero, Features (3), How it works (3 steps), Pricing (Free/Pro), FAQ (4 accordions), Footer (Privacy/Terms/Contact).
- Fixed navbar with smooth scroll + CTA button (“Get early access”).
- Lead capture:
  - Email input + “Join waitlist”
  - Client-side validation (HTML5 + “obviously fake” email blocking)
  - Store in `localStorage`, avoid duplicates (case-insensitive)
  - Show success/duplicate/error messages inline with iconography.
- Privacy/Terms displayed via lightweight modals (no extra pages).
- Responsive, mobile-first layout and interactions.
- No external libraries (no CSS frameworks, no JS libs).

### Non-goals
- No backend submission or real email sending.
- No analytics, tracking pixels, or external requests required for core functionality.
- No authentication or user accounts.
- No multi-page routing (`privacy.html` / `terms.html` are out of scope).

## Constraints
- Stack: vanilla `index.html`, `styles.css`, `app.js`. No third-party dependencies.
- Primary content language: English.
- Smooth scrolling must respect `prefers-reduced-motion` (i.e., disable smooth animation when requested).
- Mobile-first responsive design (works well on small screens first, then scales up).
- Data persistence limited to browser storage:
  - Use `localStorage` when available
  - Fallback to `sessionStorage` if `localStorage` fails/unavailable.

## Key Flows
To stay within spec guardrails, flows are grouped into three major flows.

1) **Single-page navigation**
   - User clicks navbar items (anchors) or CTA button.
   - Page scrolls to the associated section (smooth scroll unless reduced motion).
   - Fixed navbar does not cover section headings (apply scroll offset).

2) **Waitlist capture (happy path)**
   - User enters email and submits.
   - Client validates:
     - built-in HTML5 email validation
     - additional “obviously fake” checks (see Edge cases).
   - System normalizes email (`trim` + lowercase) and checks dedupe store.
   - If new: persist `{email, createdAt}` and show success message.
   - If duplicate: show duplicate message (no re-add).

3) **Disclosure UI (FAQ + legal modals)**
   - FAQ is accordion style:
     - “single-open” (only one item open at a time)
     - all items closed initially
   - Footer contains `Privacy` and `Terms` triggers:
     - open modal with short placeholder text + bullets (scannable)
     - modal supports close via close button and `Escape`

## Data / Interfaces

### DOM interfaces (high level)
- Sections identified by ids for in-page navigation:
  - `#features`, `#how-it-works`, `#pricing`, `#faq`, and the waitlist section id (to be defined in implementation).
- Waitlist form elements:
  - email input
  - submit button (“Join waitlist”)
  - message region (inline status + icon)
- FAQ accordion items (4):
  - a toggle control per item (button recommended)
  - a content region per item
- Privacy/Terms:
  - trigger buttons/links in footer
  - modal container + backdrop

### Storage schema

#### Keys (proposed, versioned)
- Primary key: `focusmate_waitlist_v1`
  - JSON array of objects:
    - `email` (string, normalized)
    - `createdAt` (ISO string)

#### Storage selection
- Attempt `localStorage` first.
- If write fails or unavailable, fallback to `sessionStorage`.

## Edge cases & Failure modes

### Email validation
- Use HTML5 email validity (`type="email"` + `required`).
- Additional “obviously fake” checks (heuristic, not RFC-perfect), e.g.:
  - local-part length < 2 OR domain part length < 3
  - missing dot in domain (e.g., `user@domain` rejected)
  - domain TLD length < 2
  - reject known placeholders like `a@a`, `test@test`, `email@email` (exact match after normalization)
- Normalization for dedupe: `trim` + `toLowerCase`.

### Duplicates
- Treat as duplicate if normalized email matches an existing stored entry.
- When duplicate:
  - do not create a new record
  - show “already on the waitlist” messaging.

### Storage unavailability
- If `localStorage` fails, use `sessionStorage` (fallback).
- If both fail:
  - still allow the user to submit (best-effort), but show message indicating the submission may not persist.
  - No dedupe can be guaranteed in this scenario.

### Reduced motion
- If user prefers reduced motion:
  - do not animate scroll; use immediate jumps.

### FAQ interactions
- Single-open enforcement:
  - opening one item closes the others.
- All closed on initial load (no persistence of open state).

## Observability
- No external telemetry.
- In-browser only:
  - Avoid noisy console logging in normal operation.
  - Any debug logging (if added) must be gated (e.g., a constant flag) and default off.

## Security / Privacy
- Collected data: email address only.
- Data storage: browser storage only (local/session), no network submission.
- Privacy/Terms modals must clearly state this is a fictitious product/demo and that emails are stored locally in the browser for the purposes of the demo.
- Avoid storing additional metadata (UTMs, IPs, user agent) in this spec.

## Open Questions
- (none)

## Decision Log
- **Decision:** Spec slug is `focusmate-landing`.
  - **Rationale:** Single-purpose landing + waitlist capture.
- **Decision:** Content language is English.
  - **Rationale:** SaaS-style marketing tone; consistent copy.
- **Decision:** Visual style: gradients + glassy UI.
  - **Rationale:** “Modern SaaS” look; achievable without assets/libs.
- **Decision:** Navbar includes logo click-to-top, plus standard anchors and CTA.
  - **Rationale:** Familiar UX; improves navigation on long single page.
- **Decision:** Primary CTA text is “Get early access” and scrolls to waitlist.
  - **Rationale:** Aligns with waitlist-first goal.
- **Decision:** Waitlist entry points: Hero + dedicated waitlist section.
  - **Rationale:** Multiple opportunities to convert without adding pages.
- **Decision:** Dedupe uses normalized email (trim + lowercase); store `{email, createdAt}`.
  - **Rationale:** Simple, predictable behavior; sufficient for demo.
- **Decision:** FAQ accordion: single-open and all closed by default.
  - **Rationale:** Clean scanning; prevents overly tall FAQ.
- **Decision:** Email validation uses HTML5 plus “obviously fake” blocking.
  - **Rationale:** Improves lead quality without over-rejecting.
- **Decision:** Form messaging is inline with icon.
  - **Rationale:** Clear, mobile-friendly feedback.
- **Decision:** Pricing: Free/Pro; Pro is `$8/mo`; 3 bullets per plan.
  - **Rationale:** Concise and believable price point.
- **Decision:** How it works is product-oriented (not “matching/pairing”).
  - **Rationale:** Keeps narrative simple and independent of social features.
- **Decision:** Privacy/Terms open as modal with short placeholder + bullets.
  - **Rationale:** Maintains single-page constraint and scannable text.
- **Decision:** Contact is `mailto:hello@focusmate.app`.
  - **Rationale:** Minimal and functional without backend.
- **Decision:** Smooth scroll respects `prefers-reduced-motion`.
  - **Rationale:** Accessibility best practice.
- **Decision:** A11y baseline includes semantics + keyboard support + skip link.
  - **Rationale:** Fixed navbar benefits from skip link; better UX quality.
- **Decision:** Storage fallback from `localStorage` to `sessionStorage`.
  - **Rationale:** Graceful degradation when local storage fails.
- **Decision:** SEO metadata includes title/description/favicon placeholder/OG tags.
  - **Rationale:** Standard landing completeness without extra tooling.

## Changelog
- 2026-01-22 — Initial spec created.
  - reason: initial requirements + interview decisions
  - impact: establishes PLAN/TASKS/ACCEPTANCE

## Glossary
- **CTA:** Call to action (primary button/link that drives conversion).
- **Dedupe:** Deduplication; treating repeated email submissions as duplicates.
- **Reduced motion:** OS/browser setting (`prefers-reduced-motion`) indicating animations should be minimized.

