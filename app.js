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

function setWaitlistMessage(messageEl, { kind, text }) {
  const iconEl = messageEl.querySelector(".waitlist__icon");
  const textEl = messageEl.querySelector(".waitlist__text");

  messageEl.classList.remove(
    "waitlist__message--success",
    "waitlist__message--warn",
    "waitlist__message--error",
    "waitlist__message--info",
  );

  const kindToClass = {
    success: "waitlist__message--success",
    warn: "waitlist__message--warn",
    error: "waitlist__message--error",
    info: "waitlist__message--info",
  };

  const kindToIcon = {
    success: "✓",
    warn: "!",
    error: "×",
    info: "i",
  };

  const messageClass = kindToClass[kind] ?? kindToClass.info;
  const icon = kindToIcon[kind] ?? kindToIcon.info;

  messageEl.classList.add(messageClass);
  if (iconEl) iconEl.textContent = icon;
  if (textEl) textEl.textContent = text;
}

function clearWaitlistMessage(messageEl) {
  const iconEl = messageEl.querySelector(".waitlist__icon");
  const textEl = messageEl.querySelector(".waitlist__text");

  messageEl.classList.remove(
    "waitlist__message--success",
    "waitlist__message--warn",
    "waitlist__message--error",
    "waitlist__message--info",
  );
  if (iconEl) iconEl.textContent = "";
  if (textEl) textEl.textContent = "";
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

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setAccordionItemState({ trigger, panel, isOpen }) {
  trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  panel.hidden = !isOpen;
}

function initAccordion() {
  const accordions = document.querySelectorAll("[data-accordion]");

  accordions.forEach((accordion) => {
    const triggers = Array.from(accordion.querySelectorAll(".accordion__trigger"));
    const items = triggers
      .map((trigger) => {
        const panelId = trigger.getAttribute("aria-controls");
        if (!panelId) return null;
        const panel = document.getElementById(panelId);
        if (!panel) return null;
        return { trigger, panel };
      })
      .filter(Boolean);

    if (items.length === 0) return;

    items.forEach((item) => {
      setAccordionItemState({ ...item, isOpen: false });
    });

    const closeAll = () => {
      items.forEach((item) => setAccordionItemState({ ...item, isOpen: false }));
    };

    const openItem = (targetItem) => {
      items.forEach((item) => setAccordionItemState({ ...item, isOpen: item === targetItem }));
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const item = items.find((candidate) => candidate.trigger === trigger);
        if (!item) return;

        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          closeAll();
          return;
        }

        openItem(item);
      });
    });
  });
}

function initInPageNavigation() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const root = document.documentElement;
  const extraOffset = 12;

  const getHeaderHeight = () => Math.ceil(header.getBoundingClientRect().height);

  const updateNavHeight = () => {
    root.style.setProperty("--nav-height", `${getHeaderHeight()}px`);
  };

  updateNavHeight();

  window.addEventListener(
    "resize",
    () => {
      window.requestAnimationFrame(updateNavHeight);
    },
    { passive: true },
  );

  const scrollToTarget = (target, behavior) => {
    const headerHeight = getHeaderHeight();
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const top = Math.max(0, targetTop - headerHeight - extraOffset);
    window.scrollTo({ top, behavior });
  };

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    if (link.classList.contains("skip-link")) return;

    const href = link.getAttribute("href");
    if (!href || href === "#" || href === "#0") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    scrollToTarget(target, behavior);

    if (history.pushState) {
      history.pushState(null, "", href);
    } else {
      window.location.hash = href;
    }
  });

  if (window.location.hash && window.location.hash !== "#") {
    const target = document.querySelector(window.location.hash);
    if (target) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollToTarget(target, "auto"));
      });
    }
  }
}

function wireWaitlistForm(form) {
  const emailInput = form.querySelector('input[name="email"]');
  const messageElId = form.getAttribute("id") === "waitlist-form-hero" ? "waitlist-message-hero" : "waitlist-message";
  const messageEl = document.getElementById(messageElId);

  if (!emailInput || !messageEl) return;

  clearWaitlistMessage(messageEl);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const normalizedEmail = normalizeEmail(emailInput.value);

    if (!emailInput.checkValidity()) {
      setWaitlistMessage(messageEl, {
        kind: "error",
        text: "Please enter a valid email address (e.g., you@domain.com).",
      });
      return;
    }

    if (isObviouslyFakeEmail(normalizedEmail)) {
      setWaitlistMessage(messageEl, {
        kind: "error",
        text: "Please enter a real email address (e.g., you@domain.com).",
      });
      return;
    }

    const result = addEmailToWaitlist(normalizedEmail);

    if (result.kind === "added") {
      setWaitlistMessage(messageEl, {
        kind: "success",
        text: "You're in! We'll email you when early access opens.",
      });
      emailInput.value = "";
      return;
    }

    if (result.kind === "duplicate") {
      setWaitlistMessage(messageEl, {
        kind: "warn",
        text: "You're already on the waitlist. We'll keep you posted.",
      });
      return;
    }

    setWaitlistMessage(messageEl, {
      kind: "warn",
      text: "You're in (for now). We couldn't save your email in this browser.",
    });
  });
}

function init() {
  initInPageNavigation();
  initAccordion();

  const forms = document.querySelectorAll("#waitlist-form, #waitlist-form-hero");
  forms.forEach((form) => wireWaitlistForm(form));
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
