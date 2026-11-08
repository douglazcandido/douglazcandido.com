import { FiArrowUpRight } from "react-icons/fi";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { useI18n } from "../i18n/context";

export default function Education() {
  const { t } = useI18n();
  const items = t.education.items;

  return (
    <Section id="educacao" title={t.education.title}>
      <ol className="m-0 list-none border-t border-divider p-0">
        {items.map((item, index) => (
          <Reveal as="li" key={item.title} delay={index * 110} className="border-b border-divider">
            <div className="row-sweep group flex items-center gap-[clamp(14px,3vw,48px)] py-[clamp(18px,2.2vw,32px)] hover:px-[clamp(12px,1.5vw,24px)]">
              <span className="row-muted w-8 shrink-0 font-mono text-xs tracking-[0.2em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="row-title m-0 flex-1 font-display text-[clamp(20px,2.6vw,40px)] leading-[1.1] font-semibold tracking-[-0.03em] text-pretty transition-colors duration-300">
                {item.title}
              </h3>
              <span className="display hidden text-[clamp(18px,2vw,30px)] leading-none text-neutral-500 sm:block">
                {item.school}
              </span>
              <FiArrowUpRight
                aria-hidden="true"
                className="hidden h-6 w-6 shrink-0 -translate-x-2 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-0 group-hover:text-accent group-hover:opacity-100 md:block"
              />
              <span className="font-mono text-[11px] tracking-[0.18em] text-neutral-500 uppercase sm:hidden">
                {item.school}
              </span>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
