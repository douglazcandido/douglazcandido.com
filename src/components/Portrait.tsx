import PortraitPlaceholder from "./PortraitPlaceholder";

interface PortraitProps {
  src?: string;
  className?: string;
}

/** Framed portrait with thin accent corner brackets. */
export default function Portrait({ src, className = "" }: PortraitProps) {
  return (
    <figure className={`group relative m-0 ${className}`}>
      <div className="relative">
        <div className="relative aspect-square overflow-hidden border border-divider bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="h-full w-full">
            <PortraitPlaceholder src={src} />
          </div>
        </div>

        {[
          "top-0 left-0 border-t border-l -translate-x-2 -translate-y-2",
          "top-0 right-0 border-t border-r translate-x-2 -translate-y-2",
          "bottom-0 left-0 border-b border-l -translate-x-2 translate-y-2",
          "right-0 bottom-0 border-r border-b translate-x-2 translate-y-2",
        ].map((position) => (
          <span key={position} aria-hidden="true" className={`pointer-events-none absolute h-4 w-4 border-accent ${position}`} />
        ))}
      </div>
    </figure>
  );
}
