import PortraitPlaceholder from "./PortraitPlaceholder";

interface PortraitProps {
  src?: string;
  className?: string;
}

/** Framed portrait. */
export default function Portrait({ src, className = "" }: PortraitProps) {
  return (
    <figure className={`group relative m-0 ${className}`}>
      <div className="relative">
        <div className="relative aspect-square overflow-hidden rounded-[14px] border border-divider bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="h-full w-full">
            <PortraitPlaceholder src={src} />
          </div>
        </div>
      </div>
    </figure>
  );
}
