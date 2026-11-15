import { useCallback, useSyncExternalStore } from "react";

/** The phone layout: below Tailwind's `md` (768px), where the career timeline already went single-column. */
export const PHONE_QUERY = "(max-width: 767.98px)";

/** Live result of a CSS media query (updates when the viewport or a user preference changes). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
