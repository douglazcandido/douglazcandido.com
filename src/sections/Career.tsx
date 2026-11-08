import Section from "../components/Section";
import Reveal from "../components/Reveal";
import SpotlightCard from "../components/SpotlightCard";
import { useInView } from "../hooks/useInView";
import { useI18n } from "../i18n/context";

/**
 * Career as a pipeline: one node per stage, joined by a line that draws in as
 * the section scrolls into view. Vertical on mobile, horizontal from md up.
 * The last stage is the current one (pulsing node, line fading out).
 */
export default function Career() {
  const { t } = useI18n();
  const items = t.career.items;
  const { ref, isInView } = useInView<HTMLOListElement>({ threshold: 0.1 });

  return (
    <Section id="carreira" title={t.career.title}>
      <ol
        ref={ref}
        className={`m-0 grid list-none grid-cols-1 gap-x-[clamp(16px,2vw,28px)] gap-y-8 p-0 md:grid-cols-3 ${isInView ? "pipe-visible" : ""}`}
      >
        {items.map((role, i) => {
          const isCurrent = i === items.length - 1;
          const delay = `${i * 320}ms`;

          return (
            <li
              key={role.title}
              className="relative flex flex-col pl-8 md:pt-9 md:pl-0"
              style={{ "--d": delay } as React.CSSProperties}
            >
              {/* Connector to the next stage (fades out on the current one). */}
              <span
                aria-hidden="true"
                className={`pipe-line absolute top-3 -bottom-[40px] left-[4px] w-px md:top-[4px] md:right-[calc(-1*clamp(16px,2vw,28px))] md:bottom-auto md:left-[18px] md:h-px md:w-auto ${
                  isCurrent
                    ? "bg-linear-to-b from-accent to-transparent md:bg-linear-to-r"
                    : "bg-accent/60"
                }`}
              />

              {/* Node */}
              <span
                aria-hidden="true"
                className="pipe-node absolute top-[6px] left-0 md:top-0 md:left-0"
              >
                <span className={`block h-[9px] w-[9px] rounded-full border border-accent ${isCurrent ? "bg-accent" : "bg-bg"}`} />
                {isCurrent && <span className="pipe-pulse absolute inset-0 rounded-full border border-accent" />}
              </span>

              <Reveal className="h-full" delay={i * 160}>
                <SpotlightCard className="flex h-full flex-col p-[clamp(20px,2.2vw,32px)]">
                  <p
                    className={`m-0 font-mono text-[11px] tracking-[0.16em] uppercase ${
                      isCurrent ? "text-accent" : "text-neutral-500"
                    }`}
                  >
                    {role.period}
                  </p>
                  <h3 className="m-0 mt-3 font-display text-[clamp(20px,1.9vw,30px)] leading-[1.15] font-semibold tracking-[-0.02em] text-pretty">
                    {role.title}
                  </h3>
                  <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0">
                    {role.items.map((item) => (
                      <li key={item} className="relative pl-4 text-[15px] leading-[1.6] text-neutral-400">
                        <span aria-hidden="true" className="absolute top-[0.62em] left-0 h-1 w-1 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
