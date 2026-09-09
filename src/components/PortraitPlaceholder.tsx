interface PortraitPlaceholderProps {
  src?: string;
  alt?: string;
}

/**
 * Drop a real portrait in later: pass `src` (e.g. an imported asset) and it
 * replaces this placeholder, keeping the same framed box from the design.
 */
export default function PortraitPlaceholder({ src, alt = "Douglas Candido" }: PortraitPlaceholderProps) {
  if (src) {
    return <img src={src} alt={alt} className="h-full w-full object-cover" />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-6 text-center">
      <span className="font-mono text-[11px] tracking-[0.14em] text-neutral-700 uppercase">
        Adicione seu retrato (P&amp;B)
      </span>
    </div>
  );
}
