import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Inertial smooth scrolling for wheel/trackpad input, plus eased in-page
 * anchor navigation. Touch keeps native momentum scrolling. Skipped entirely
 * when the user asks for reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      anchors: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}
