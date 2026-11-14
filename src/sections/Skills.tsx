import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { skillGroups } from "../data/skills";
import { useI18n } from "../i18n/context";

/**
 * Tech stack as typographic columns: a small heading per group and, under it, the items as
 * running text separated by commas. Semantically each group is a titled <ul>; the commas are
 * drawn by CSS (.stack-list), so assistive tech reads a plain list of items.
 */
export default function Skills() {
  const { t } = useI18n();

  return (
    <Section id="skills" title={t.skills.title}>
      <div className="grid grid-cols-1 gap-x-[clamp(32px,4vw,64px)] gap-y-[clamp(28px,3.4vw,48px)] md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => {
          const headingId = `stack-${group.id}`;
          return (
            // Delay staggers within a row (columns), not across the whole grid, so it never feels slow.
            <Reveal key={group.id} eager delay={(i % 3) * 90} className="min-w-0">
              <section aria-labelledby={headingId}>
                <h3
                  id={headingId}
                  className="m-0 font-display text-[clamp(20px,1.9vw,28px)] leading-[1.15] font-semibold tracking-[-0.02em]"
                >
                  {t.skills.groups[group.id]}
                </h3>
                <ul className="stack-list m-0 mt-3.5 list-none p-0 text-[clamp(16px,1.5vw,22px)] leading-[1.7] text-neutral-400">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
