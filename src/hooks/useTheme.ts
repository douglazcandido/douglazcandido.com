import { useCallback, useSyncExternalStore } from "react";
import { applyTheme, readTheme, subscribeTheme, type Theme } from "../lib/theme";

export type { Theme };

/** Shared theme state: every toggle on the page (header, mobile menu) reads and writes the same value. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, readTheme);
  const toggle = useCallback(() => applyTheme(readTheme() === "dark" ? "light" : "dark"), []);
  return { theme, toggle };
}
