import type { ElementType, ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Reveal as soon as the top edge enters the window, for tall blocks that never reach 20% visible in time. */
  eager?: boolean;
}

const EAGER = { threshold: 0, rootMargin: "0px 0px -40px 0px" };

export default function Reveal({ children, as: Tag = "div", className = "", delay = 0, eager = false }: RevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>(eager ? EAGER : undefined);

  return (
    <Tag
      ref={ref}
      className={`reveal ${isInView ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: isInView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
