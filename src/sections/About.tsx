import Section from "../components/Section";
import ScrubText from "../components/ScrubText";
import { useI18n } from "../i18n/context";

export default function About() {
  const { t } = useI18n();
  const a = t.about;

  return (
    <Section id="sobre" title={a.title}>
      <ScrubText
        paragraphs={a.paragraphs}
        className="flex max-w-[60ch] flex-col gap-[clamp(20px,2.4vw,36px)] text-[clamp(20px,2.1vw,32px)] leading-[1.35] font-medium tracking-[-0.015em] text-pretty lg:max-w-[68ch]"
      />
    </Section>
  );
}
