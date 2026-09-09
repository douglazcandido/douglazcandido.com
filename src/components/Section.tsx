import type { ReactNode } from "react";
import SectionHeading from "./SectionHeading";

interface SectionProps {
  id: string;
  number: string;
  label: string;
  children: ReactNode;
  className?: string;
  headingOffsetClassName?: string;
}

export default function Section({
  id,
  number,
  label,
  children,
  className = "",
  headingOffsetClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`border-t border-neutral-900 py-10 md:py-[clamp(52px,8vh,96px)] ${className}`}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-[clamp(24px,4vw,64px)]">
        <SectionHeading number={number} label={label} offsetClassName={headingOffsetClassName} />
        <div>{children}</div>
      </div>
    </section>
  );
}
