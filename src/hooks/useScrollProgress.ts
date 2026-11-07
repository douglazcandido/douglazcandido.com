import { useEffect } from "react";

/**
 * Drives progress indicators (`data-scroll-progress="x" | "y"`) with the page
 * scroll fraction. Writes a transform straight onto those few elements: setting
 * a CSS variable on <html> would invalidate style for the whole document on
 * every scroll frame.
 */
export function useScrollProgress() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-progress]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      for (const el of targets) {
        el.style.transform = el.dataset.scrollProgress === "y" ? `scaleY(${fraction})` : `scaleX(${fraction})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
