import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { prefersReducedMotion } from "../hooks/useReducedMotion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function CountUp({ to, from = 0, duration = 1800, prefix = "", suffix = "" }: CountUpProps) {
  const { ref, isInView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(prefersReducedMotion() ? to : from);

  useEffect(() => {
    if (!isInView || prefersReducedMotion()) return;
    let raf = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      setValue(Math.round(from + (to - from) * easeOutExpo(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
