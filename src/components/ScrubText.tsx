import { useEffect, useMemo, useRef } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

interface ScrubTextProps {
  /** One or more paragraphs; the highlight sweeps through all of them as a single text. */
  paragraphs: readonly string[];
  className?: string;
}

/** Words light up one by one as the text scrolls through the viewport. */
export default function ScrubText({ paragraphs, className = "" }: ScrubTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const split = useMemo(() => paragraphs.map((p) => p.split(/\s+/)), [paragraphs]);
  const words = useMemo(() => split.flat(), [split]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) {
      for (const el of wordRefs.current) if (el) el.style.opacity = "1";
      return;
    }

    let raf = 0;
    let near = false;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 once the block's top reaches 92% of the viewport, 1 as soon as its bottom is on
      // screen (85%), so everything on screen is fully lit and nothing stays dimmed.
      const start = vh * 0.92;
      const end = vh * 0.85;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height)));
      const count = words.length;
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const local = Math.min(1, Math.max(0, progress * (count + 4) - i) / 4);
        el.style.opacity = (0.3 + local * 0.7).toFixed(3);
      });
    };
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) onScroll();
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(root);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [words]);

  let offset = 0;
  return (
    <div ref={rootRef} className={className}>
      {split.map((para, pi) => {
        const start = offset;
        offset += para.length;
        return (
          <p key={pi} className="m-0">
            {para.map((word, wi) => {
              const i = start + wi;
              return (
                <span
                  key={`${word}-${i}`}
                  ref={(el) => {
                    wordRefs.current[i] = el;
                  }}
                  style={{ opacity: 0.3 }}
                >
                  {word}
                  {wi < para.length - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
