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
              <h3 className="row-title m-0 flex-1 font-display text-[clamp(20px,2.6vw,40px)] leading-[1.1] font-semibold tracking-[-0.03em] text-pretty transition-colors duration-300">
                {item.title}
              </h3>
              <span className="display hidden text-[clamp(18px,2vw,30px)] leading-none text-neutral-500 sm:block">
                {item.school}
              </span>
              <span className="text-[11px] tracking-[0.18em] text-neutral-500 uppercase sm:hidden">
                {item.school}
              </span>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
