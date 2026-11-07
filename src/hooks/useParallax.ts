import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Translates the element as it travels through the viewport. `x` / `y` are the
 * pixel offsets reached when the element is one viewport-height away from the
 * center (positive = pushed down/right while it is still below the center).
 * Only does work while the element is within about a viewport of the screen.
 */
export function useParallax<T extends HTMLElement>({ x = 0, y = 0 }: { x?: number; y?: number }) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    let near = false;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(-1.5, Math.min(1.5, (rect.top + rect.height / 2 - vh / 2) / vh));
      el.style.transform = `translate3d(${(p * x).toFixed(1)}px, ${(p * y).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) onScroll();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [x, y]);

  return ref;
}
