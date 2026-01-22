# ACCEPTANCE — FocusMate Landing (Waitlist)

## A0 — Browser smoke (web)
- The app loads in Chromium without critical console errors.
- The primary happy-path flow works end-to-end in the browser.

## A1 — Single-page structure
- The page is a single page with sections: Hero, Features (3), How it works (3 steps), Pricing (Free/Pro), FAQ (4 items), Footer (Privacy/Terms/Contact).

## A2 — Navbar + scroll behavior
- Navbar is fixed and includes a CTA (“Get early access”).
- Clicking any navbar item or the CTA scrolls to the correct section without headings being hidden by the navbar.
- If `prefers-reduced-motion` is enabled, scrolling does not animate.

## A3 — Waitlist submission (new email)
- User can submit a valid email via the waitlist form.
- On success:
  - entry is persisted (localStorage or sessionStorage fallback)
  - an inline success message with icon is shown.

## A4 — Waitlist dedupe (duplicate email)
- Submitting the same email again (case-insensitive) does not create a new entry and shows an inline “already on the waitlist” message.

## A5 — Validation and “obviously fake” blocking
- Clearly invalid emails are rejected with an inline error message (e.g., `a@a`, `test@test`).

## A6 — Storage fallback
- If `localStorage` is unavailable or throws, the app falls back to `sessionStorage` and the waitlist flow still works.

## A7 — FAQ accordion behavior
- FAQ has 4 items, all closed by default.
- Only one item can be open at a time (opening one closes the others).
- Accordion toggles are keyboard accessible (Enter/Space) with visible focus states.

## A8 — Privacy/Terms modals + Contact
- Footer contains `Privacy`, `Terms`, and `Contact`.
- Privacy/Terms open modals that include short placeholder text + bullets and mention the product is fictitious and emails are stored locally for the demo.
- Modals can be closed via a close button and the `Escape` key.
- Contact is a `mailto:hello@focusmate.app` link.

