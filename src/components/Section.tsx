import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";
import { useParallax } from "../hooks/useParallax";

interface SectionProps {
  id: string;
  /** Giant heading. */
  title: string;
  children: ReactNode;
  /** Rendered edge-to-edge below the padded content. */
  bleed?: ReactNode;
  className?: string;
}

export default function Section({ id, title, children, bleed, className = "" }: SectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const titleRef = useParallax<HTMLHeadingElement>({ x: 70 });

  return (
    <section id={id} className={`relative border-t border-divider py-[clamp(56px,8vw,112px)] ${className}`}>
      <div className="px-page">
        <div ref={ref} className={isInView ? "mask-visible" : ""}>
          <h2 ref={titleRef} className="display m-0 text-[clamp(38px,5.8vw,92px)] leading-[1.05] tracking-[-0.04em]">
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
