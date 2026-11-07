import type { ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/** Bordered card; hover styles live in index.css (`.spot`). */
export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return <div className={`spot ${className}`}>{children}</div>;
}
