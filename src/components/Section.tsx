import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";
import { useParallax } from "../hooks/useParallax";

interface SectionProps {
  id: string;
  number: string;
  label: string;
  /** Giant heading. */
  title: string;
  /** Item count shown in the label row. */
  count?: number;
  children: ReactNode;
  /** Rendered edge-to-edge below the padded content. */
  bleed?: ReactNode;
  className?: string;
}

export default function Section({ id, number, label, title, count, children, bleed, className = "" }: SectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const titleRef = useParallax<HTMLHeadingElement>({ x: 70 });

  return (
    <section id={id} className={`relative border-t border-divider py-[clamp(56px,8vw,112px)] ${className}`}>
      <div className="px-page">
        <div ref={ref} className={isInView ? "mask-visible" : ""}>
          <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.22em] uppercase">
            <span className="text-accent">{number}</span>
            <span className="rule-draw h-px flex-1 bg-divider" />
            <span className="text-neutral-500">
              {label}
              {count !== undefined && <span className="text-accent"> · {String(count).padStart(2, "0")}</span>}
            </span>
          </div>
          <h2 ref={titleRef} className="display m-0 mt-[clamp(16px,2vw,28px)] text-[clamp(38px,5.8vw,92px)] leading-[1.05] tracking-[-0.04em]">
            <span className="mask-line">
              <span className="mask-inner">{title}</span>
            </span>
          </h2>
        </div>
        <div className="mt-[clamp(28px,4vw,56px)]">{children}</div>
      </div>
      {bleed}
    </section>
  );
}
