"use strict";

const WAITLIST_STORAGE_KEY = "focusmate_waitlist_v1";

function normalizeEmail(rawEmail) {
  return rawEmail.trim().toLowerCase();
}

function getAvailableStorage() {
  const testKey = "__focusmate_storage_test__";

  try {
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    // ignore
  }

  try {
    window.sessionStorage.setItem(testKey, "1");
    window.sessionStorage.removeItem(testKey);
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function loadWaitlistEntries(storage) {
  try {
    const raw = storage.getItem(WAITLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && typeof entry.email === "string" && typeof entry.createdAt === "string");
  } catch {
    return [];
  }
}

function saveWaitlistEntries(storage, entries) {
  storage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(entries));
}

function addEmailToWaitlist(rawEmail) {
  const storage = getAvailableStorage();
  if (!storage) {
    return { ok: true, kind: "no_persist" };
  }

  const normalized = normalizeEmail(rawEmail);
  const entries = loadWaitlistEntries(storage);
  const isDuplicate = entries.some((entry) => entry.email === normalized);
  if (isDuplicate) {
    return { ok: true, kind: "duplicate" };
  }

  const nextEntries = [...entries, { email: normalized, createdAt: new Date().toISOString() }];

  try {
    saveWaitlistEntries(storage, nextEntries);
    return { ok: true, kind: "added" };
  } catch {
    return { ok: true, kind: "no_persist" };
  }
}

function setWaitlistMessage(messageEl, text) {
  const textEl = messageEl.querySelector(".waitlist__text");
  if (textEl) textEl.textContent = text;
}

function isObviouslyFakeEmail(normalizedEmail) {
  const blocked = new Set(["a@a", "test@test", "email@email"]);
  if (blocked.has(normalizedEmail)) return true;

  const parts = normalizedEmail.split("@");
  if (parts.length !== 2) return true;

  const [localPart, domainPart] = parts;
  if (localPart.length < 2) return true;
  if (domainPart.length < 3) return true;
  if (!domainPart.includes(".")) return true;

  const lastDotIndex = domainPart.lastIndexOf(".");
  if (lastDotIndex <= 0) return true;

  const tld = domainPart.slice(lastDotIndex + 1);
  if (tld.length < 2) return true;

  return false;
}

function wireWaitlistForm(form) {
  const emailInput = form.querySelector('input[name="email"]');
  const messageElId = form.getAttribute("id") === "waitlist-form-hero" ? "waitlist-message-hero" : "waitlist-message";
  const messageEl = document.getElementById(messageElId);

  if (!emailInput || !messageEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const normalizedEmail = normalizeEmail(emailInput.value);

    if (!emailInput.checkValidity()) {
      setWaitlistMessage(messageEl, "Please enter a valid email address (e.g., you@domain.com).");
      return;
    }

    if (isObviouslyFakeEmail(normalizedEmail)) {
      setWaitlistMessage(messageEl, "Please enter a real email address (e.g., you@domain.com).");
      return;
    }

    const result = addEmailToWaitlist(normalizedEmail);

    if (result.kind === "added") {
      setWaitlistMessage(messageEl, "You're in! We'll email you when early access opens.");
      emailInput.value = "";
      return;
    }

    if (result.kind === "duplicate") {
      setWaitlistMessage(messageEl, "You're already on the waitlist. We'll keep you posted.");
      return;
    }

    setWaitlistMessage(messageEl, "You're in (for now). We couldn't save your email in this browser.");
  });
}

function init() {
  const forms = document.querySelectorAll("#waitlist-form, #waitlist-form-hero");
  forms.forEach((form) => wireWaitlistForm(form));
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
