import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

interface MarqueeProps {
  children: ReactNode;
  /** Base speed in px/s. */
  speed?: number;
  /** 1 scrolls left, -1 scrolls right. */
  direction?: 1 | -1;
  className?: string;
  trackClassName?: string;
}

/**
 * Infinite ticker driven by rAF instead of a CSS animation so it can react to
 * the page: scrolling speeds it up, and scrolling the other way reverses it.
 * Only runs while on screen. `children` is rendered twice for the seamless loop.
 */
export default function Marquee({
  children,
  speed = 60,
  direction = 1,
  className = "",
  trackClassName = "",
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || prefersReducedMotion()) return;

    let raf = 0;
    let offset = 0;
    let flip = 1;
    let velocity = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let loop = 0;
    const measure = () => {
      loop = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const y = window.scrollY;
      const instant = dt > 0 ? (y - lastY) / dt : 0;
      lastY = y;
      velocity += (instant - velocity) * 0.12;

      if (Math.abs(velocity) > 40) flip += ((velocity > 0 ? 1 : -1) - flip) * 0.08;
      const boost = 1 + Math.min(Math.abs(velocity) / 500, 4);

      offset -= direction * flip * speed * boost * dt;
      if (loop > 0) offset = ((offset % loop) - loop) % loop;
      track.style.transform = `translate3d(${offset}px, 0, 0)`;

      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) {
        last = performance.now();
        lastY = window.scrollY;
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(root);

    return () => {
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, direction]);

  return (
    <div ref={rootRef} className={`relative overflow-hidden ${className}`}>
      <div ref={trackRef} className={`flex w-max items-center will-change-transform ${trackClassName}`}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
