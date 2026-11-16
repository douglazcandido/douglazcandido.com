import { DARK_THEME_ENABLED } from "../config/theme";

export type Theme = "dark" | "light";

const listeners = new Set<() => void>();

/**
 * The theme lives on <html data-theme>; that attribute is the single source of truth.
 * DARK-THEME-DISABLED: with DARK_THEME_ENABLED off, the answer is always "light".
 */
export function readTheme(): Theme {
  if (!DARK_THEME_ENABLED) return "light";
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function subscribeTheme(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

let fadeTimer: ReturnType<typeof setTimeout> | undefined;

export function applyTheme(next: Theme) {
  if (!DARK_THEME_ENABLED) return;
  const root = document.documentElement;
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    // localStorage may be unavailable (private mode, disabled storage) - theme just won't persist.
  }

  // Fade colors only for the toggle itself, not on first paint.
  root.classList.add("theme-fade");
  clearTimeout(fadeTimer);
  fadeTimer = setTimeout(() => root.classList.remove("theme-fade"), 500);

  listeners.forEach((listener) => listener());
}

/**
 * Runs once at startup. DARK-THEME-DISABLED: pins <html> to the light theme (a safety net next to the inline script
 * of index.html) and drops a "dark" saved by an earlier visit, so it cannot come back if the theme is re-enabled
 * later without the visitor choosing it.
 */
export function enforceTheme() {
  if (DARK_THEME_ENABLED) return;
  document.documentElement.setAttribute("data-theme", "light");
  try {
    if (localStorage.getItem("theme") === "dark") localStorage.removeItem("theme");
  } catch {
    // localStorage unavailable: nothing was saved that we could read anyway.
  }
}
