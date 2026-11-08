/** Hairline at the top of a section, inset by the same side margin as the content. */
export default function SectionRule() {
  return (
    <div aria-hidden="true" className="px-page pointer-events-none absolute inset-x-0 top-0">
      <div className="border-t border-divider" />
    </div>
  );
}
