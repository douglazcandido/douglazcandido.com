import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";
import SectionRule from "./SectionRule";

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

  return (
    <section id={id} className={`screen relative py-[clamp(56px,8vw,112px)] ${className}`}>
      <SectionRule />
      <div className="px-page">
        <div ref={ref} className={isInView ? "mask-visible" : ""}>
          <h2 className="display m-0 text-[clamp(38px,5.8vw,92px)] leading-[1.05] tracking-[-0.04em]">
            <span className="mask-line">
              <span className="mask-inner">{title}</span>
            </span>
          </h2>
          <span aria-hidden="true" className="rule-draw mt-[clamp(14px,1.6vw,22px)] block h-[4px] w-[clamp(40px,4.5vw,72px)] bg-accent" />
        </div>
        <div className="mt-[clamp(28px,4vw,56px)]">{children}</div>
      </div>
      {bleed}
    </section>
  );
}
