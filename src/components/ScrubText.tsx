import { useEffect, useMemo, useRef } from "react";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

interface ScrubTextProps {
  text: string;
  /** Words (case/punctuation-insensitive) rendered in accent serif italic. */
  accent?: readonly string[];
  className?: string;
}

const normalize = (word: string) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** Words light up one by one as the paragraph scrolls through the viewport. */
export default function ScrubText({ text, accent = [], className = "" }: ScrubTextProps) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = useMemo(() => text.split(/\s+/), [text]);
  const accentSet = useMemo(() => new Set(accent.map(normalize)), [accent]);

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
      // 0 once the block's top reaches 88% of the viewport, 1 when its bottom passes 45%.
      const start = vh * 0.88;
      const end = vh * 0.45;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height)));
      const count = words.length;
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const local = Math.min(1, Math.max(0, progress * (count + 4) - i) / 4);
        el.style.opacity = (0.16 + local * 0.84).toFixed(3);
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

  return (
    <p ref={rootRef} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          ref={(el) => {
            wordRefs.current[i] = el;
          }}
          className={accentSet.has(normalize(word)) ? "text-accent" : undefined}
          style={{ opacity: 0.16 }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
