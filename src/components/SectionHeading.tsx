interface SectionHeadingProps {
  number: string;
  label: string;
  offsetClassName?: string;
}

export default function SectionHeading({ number, label, offsetClassName = "md:mt-1.5" }: SectionHeadingProps) {
  return (
    <h2 className={`m-0 mb-4 font-mono text-xs font-normal tracking-[0.2em] text-neutral-500 uppercase md:mb-0 ${offsetClassName}`}>
      <span className="text-accent">{number}</span> / {label}
    </h2>
  );
}
