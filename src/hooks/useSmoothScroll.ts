import { useEffect } from "react";
import { afterFirstPaint } from "../lib/idle";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Inertial smooth scrolling for wheel/trackpad input, plus eased in-page
 * anchor navigation. Touch keeps native momentum scrolling. Skipped entirely
 * when the user asks for reduced motion.
 *
 * Lenis is a separate chunk that starts right after the first paint: until it is in, the page scrolls natively
 * (it takes over from wherever the page is, so nothing jumps).
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let raf = 0;
    let destroy: (() => void) | undefined;

    const cancelIdle = afterFirstPaint(() => {
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          lerp: 0.09,
          wheelMultiplier: 1,
          anchors: true,
        });
        const loop = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        destroy = () => lenis.destroy();
      });
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cancelAnimationFrame(raf);
      destroy?.();
    };
  }, []);
}
