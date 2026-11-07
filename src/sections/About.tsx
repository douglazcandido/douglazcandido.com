import Section from "../components/Section";
import Reveal from "../components/Reveal";
import ScrubText from "../components/ScrubText";
import CountUp from "../components/CountUp";
import { useI18n } from "../i18n/context";
import { skills } from "../data/skills";

export default function About() {
  const { t } = useI18n();
  const a = t.about;

  return (
    <Section id="sobre" number="01" label={a.label} title={a.title}>
      <ScrubText
        text={a.lead}
        accent={a.accent}
        className="m-0 text-[clamp(22px,2.9vw,46px)] leading-[1.25] font-medium tracking-[-0.02em] text-pretty"
      />

      <div className="mt-[clamp(36px,5vw,72px)] grid grid-cols-1 gap-x-[clamp(24px,4vw,64px)] gap-y-12 lg:grid-cols-12">
        <Reveal as="p" className="m-0 text-[clamp(16px,1.35vw,20px)] leading-[1.7] text-neutral-400 lg:col-span-5">
          {a.body}
        </Reveal>

        <dl className="m-0 grid grid-cols-1 border-t border-divider sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
          <Reveal className="border-b border-divider py-6 sm:border-r sm:px-6 sm:first:pl-0" delay={0}>
            <dt className="font-mono text-[11px] tracking-[0.18em] text-neutral-500 uppercase">{a.statYears}</dt>
            <dd className="display m-0 mt-3 text-[clamp(40px,4.6vw,72px)] leading-none">
              <CountUp to={4} prefix="+" />
              <span className="ml-2 font-mono text-sm font-normal tracking-normal text-accent normal-case">{a.statYearsUnit}</span>
            </dd>
          </Reveal>
          <Reveal className="border-b border-divider py-6 sm:border-r sm:px-6" delay={130}>
            <dt className="font-mono text-[11px] tracking-[0.18em] text-neutral-500 uppercase">{a.statDb}</dt>
            <dd className="display m-0 mt-3 text-[clamp(40px,4.6vw,72px)] leading-none">
              <CountUp from={112} to={15} />
              <span className="ml-2 font-mono text-sm font-normal tracking-normal text-accent normal-case">GB</span>
            </dd>
            <p className="m-0 mt-2 font-mono text-[11px] text-neutral-600 line-through decoration-accent">{a.statDbWas}</p>
          </Reveal>
          <Reveal className="border-b border-divider py-6 sm:px-6 sm:last:pr-0" delay={260}>
            <dt className="font-mono text-[11px] tracking-[0.18em] text-neutral-500 uppercase">{a.statTools}</dt>
            <dd className="display m-0 mt-3 text-[clamp(40px,4.6vw,72px)] leading-none">
              <CountUp to={skills.length} />
            </dd>
          </Reveal>
        </dl>
      </div>
    </Section>
  );
}
