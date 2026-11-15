import { useEffect, useState, useSyncExternalStore } from "react";
import { sectionsVersion, subscribeSections } from "../lib/lazySections";

/** Id of the section currently crossing the middle of the viewport. */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  // Sections that load lazily swap their placeholder for the real element: observe the new one.
  const version = useSyncExternalStore(subscribeSections, sectionsVersion, () => 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids, version]);

  return active;
}
