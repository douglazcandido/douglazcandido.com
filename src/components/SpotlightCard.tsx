import type { ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/** Card without an outline; styles live in index.css (`.spot`), static on hover. */
export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return <div className={`spot ${className}`}>{children}</div>;
}
