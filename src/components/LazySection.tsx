import { startTransition, useEffect, useState, useSyncExternalStore } from "react";
import { useI18n } from "../i18n/context";
import { settleOnAnchor } from "../lib/anchorGuard";
import { announceSectionMounted, loadedSection, onSectionLoaded, type LazyKey, type SectionComponent } from "../lib/lazySections";
import { sectionHeight } from "../lib/sectionHeights";
import SectionRule from "./SectionRule";

/** Layout width of the page (without the scrollbar), the width the section's text actually wraps at. */
function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}
const layoutWidth = () => document.documentElement.clientWidth;

/** Empty block as tall as the section really is in this language at this width, with the section's hairline. */
function Placeholder({ id, name }: { id: string; name: LazyKey }) {
  const { lang } = useI18n();
  const width = useSyncExternalStore(subscribe, layoutWidth, () => 1280);
  return (
    <div id={id} aria-hidden="true" className="screen relative" style={{ height: sectionHeight(name, lang, width) }}>
      <SectionRule />
    </div>
  );
}

/**
 * Anchor of a section whose code is a separate chunk. Until the chunk is in, a placeholder with the section's id
 * (so menu links and the scroll rail already have their target) holds its place: its height comes from a table
 * measured on the real page (scripts/measure-sections.mjs), so nothing moves when the section arrives. The
 * section then takes over the id. There is deliberately no wrapper element around the section: the extra box
 * shifted the Contact text by half a pixel when painting, which showed in the pixel comparison with the eager
 * version.
 */
export default function LazySection({ id, name }: { id: string; name: LazyKey }) {
  const [Section, setSection] = useState<SectionComponent | null>(() => loadedSection(name) ?? null);

  useEffect(() => {
    const sync = () => {
      const component = loadedSection(name);
      if (!component) return;
      // A transition: React may slice the mount into pieces instead of holding the main thread for it.
      startTransition(() => setSection(() => component));
    };
    sync();
    return onSectionLoaded(sync);
  }, [name]);

  // Once the real section is in: tell the trackers to look up the new element, then put the page back on the
  // link the visitor followed, if it moved.
  useEffect(() => {
    if (!Section) return;
    announceSectionMounted();
    settleOnAnchor();
  }, [Section]);

  return Section ? <Section id={id} /> : <Placeholder id={id} name={name} />;
}
