import Section from "../components/Section";
import Reveal from "../components/Reveal";
import SpotlightCard from "../components/SpotlightCard";
import CertificationStrip from "../components/CertificationStrip";
import { useInView } from "../hooks/useInView";
import { FIRST_YEAR, timeline, years, type TimelineEntry } from "../data/timeline";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/context";

/** Which grid rows (one per year) a card may grow into: from its own year to where the next card of its column starts. */
function rowsFor(entry: TimelineEntry, i: number) {
  const row = entry.startYear - FIRST_YEAR + 1;
  const next = timeline.slice(i + 1).find((e) => e.track === entry.track);
  const end = next ? next.startYear - FIRST_YEAR + 1 : years.length + 1;
  return { row, span: end - row };
}

/**
 * Career and studies on one vertical timeline. A central axis (the pipeline) carries one marker
 * per year; professional cards sit on its left, academic ones on its right, each aligned to the
 * year line it starts in. A card is as tall as its content, never as tall as the time it covers:
 * the empty space between cards is the time passing. Below 768px it collapses to one column with
 * the axis on the left and a label on each card.
 */
export default function Career() {
  const { t } = useI18n();
  const { ref, isInView } = useInView<HTMLOListElement>({ threshold: 0.05 });

  return (
    <Section id="carreira" title={t.career.title}>
      {/* Column captions, next to the axis (desktop only; on mobile each card carries its own label). */}
      <div aria-hidden="true" className="mb-7 hidden grid-cols-[minmax(0,1fr)_var(--tl-axis)_minmax(0,1fr)] text-[11px] tracking-[0.18em] text-neutral-500 uppercase md:grid">
        <span className="text-right">{t.career.professionalLabel}</span>
        <span />
        <span>{t.career.academicLabel}</span>
      </div>

      <ol ref={ref} className={`tl m-0 list-none p-0 ${isInView ? "pipe-visible" : ""}`}>
        {years.map((year) => (
          <li
            key={year}
            aria-hidden="true"
            className="tl-year text-accent"
            style={{ "--r": year - FIRST_YEAR + 1 } as React.CSSProperties}
          >
            {year}
          </li>
        ))}

        {timeline.map((entry, i) => {
          const { row, span } = rowsFor(entry, i);
          const isPro = entry.track === "professional";
          const current = !!entry.current;
          const delay = `${i * 260}ms`;
          const label = isPro ? t.career.professionalLabel : t.career.academicLabel;

          return (
            <li
              key={`${entry.track}-${entry.index}`}
              className={`tl-card ${isPro ? "tl-left" : "tl-right"}`}
              style={{ "--r": row, "--s": span, "--d": delay } as React.CSSProperties}
            >
              <span aria-hidden="true" className="tl-tick" />
              <span aria-hidden="true" className="tl-dot pipe-node">
                <span className={`block h-[9px] w-[9px] rounded-full border border-accent ${current ? "bg-accent" : "bg-bg"}`} />
                {current && <span className="pipe-pulse absolute inset-0 rounded-full border border-accent" />}
              </span>

              <Reveal delay={0} eager>
                {isPro ? (
                  <ProfessionalCard role={t.career.items[entry.index]} label={label} current={current} />
                ) : (
                  <AcademicCard course={t.career.academic[entry.index]} label={label} />
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>

      <CertificationStrip />
    </Section>
  );
}

/** The three roles already on the site, unchanged. */
function ProfessionalCard({
  role,
  label,
  current,
}: {
  role: { title: string; period: string; items: readonly string[] };
  label: string;
  current: boolean;
}) {
  return (
    <SpotlightCard className="flex flex-col p-[clamp(16px,1.7vw,24px)]">
      <TrackTag>{label}</TrackTag>
      <p className={`m-0 text-[11px] tracking-[0.16em] uppercase ${current ? "text-accent" : "text-neutral-500"}`}>{role.period}</p>
      <h3 className="m-0 mt-2 font-display text-[clamp(18px,1.6vw,24px)] leading-[1.15] font-semibold tracking-[-0.02em] text-pretty">
        {role.title}
      </h3>
      <p className="m-0 mt-1 text-[14px] leading-[1.4] text-neutral-500">{profile.company}</p>
      <TopicList items={role.items} />
    </SpotlightCard>
  );
}

/** Smaller card: period, course and school, then the topics (same list as the professional cards). The note and the topics only render once filled in. */
function AcademicCard({
  course,
  label,
}: {
  course: { period: string; title: string; school: string; note: string; items: readonly string[] };
  label: string;
}) {
  return (
    <SpotlightCard className="flex flex-col p-[clamp(14px,1.4vw,20px)]">
      <TrackTag>{label}</TrackTag>
      <p className="m-0 text-[11px] tracking-[0.16em] text-neutral-500 uppercase">{course.period}</p>
      <h3 className="m-0 mt-2 font-display text-[clamp(16px,1.3vw,20px)] leading-[1.2] font-semibold tracking-[-0.02em] text-pretty">
        {course.title}
      </h3>
      {course.note && <p className="m-0 mt-1 text-[12px] leading-[1.4] text-neutral-500">{course.note}</p>}
      <p className="m-0 mt-1 text-[13px] leading-[1.4] text-neutral-500">{course.school}</p>
      {course.items.length > 0 && <TopicList items={course.items} />}
    </SpotlightCard>
  );
}

/** Bulleted topics of a card; shared by the professional and the academic cards. */
function TopicList({ items }: { items: readonly string[] }) {
  return (
    <ul className="m-0 mt-3.5 flex list-none flex-col gap-2 p-0">
      {items.map((item) => (
        <li key={item} className="relative pl-4 text-[14px] leading-[1.5] text-neutral-400">
          <span aria-hidden="true" className="absolute top-[0.62em] left-0 h-1 w-1 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Track label shown on each card on mobile, where the two columns become one. */
function TrackTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 inline-flex w-fit rounded-full border border-divider px-2.5 py-0.5 text-[10.5px] tracking-[0.14em] text-neutral-500 uppercase md:hidden">
      {children}
    </span>
  );
}
