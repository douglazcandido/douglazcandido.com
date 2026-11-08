import PortraitPlaceholder from "./PortraitPlaceholder";

interface PortraitProps {
  src?: string;
  className?: string;
}

/** Framed portrait with a floating accent edge at the bottom-right. */
export default function Portrait({ src, className = "" }: PortraitProps) {
  return (
    <figure className={`group relative m-0 ${className}`}>
      <div className="relative">
        <div className="relative aspect-square overflow-hidden rounded-[14px] border border-divider bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="h-full w-full">
            <PortraitPlaceholder src={src} />
          </div>
        </div>

        {/* Floating accent frame: only the right and bottom edges, offset behind the corner. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[2.5%] -bottom-[2.5%] h-[68%] w-[43%] rounded-br-[14px] border-r-2 border-b-2 border-accent lg:-right-[4.4%] lg:-bottom-[3.8%]"
        />
      </div>
    </figure>
  );
}
