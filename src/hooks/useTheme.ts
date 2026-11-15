import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const listeners = new Set<() => void>();

/** The theme lives on <html data-theme>; that attribute is the single source of truth. */
function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

let fadeTimer: ReturnType<typeof setTimeout> | undefined;

function applyTheme(next: Theme) {
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

/** Shared theme state: every toggle on the page (header, mobile menu) reads and writes the same value. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);
  const toggle = useCallback(() => applyTheme(readTheme() === "dark" ? "light" : "dark"), []);
  return { theme, toggle };
}
