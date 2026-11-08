import Section from "../components/Section";
import ScrubText from "../components/ScrubText";
import { useI18n } from "../i18n/context";

export default function About() {
  const { t } = useI18n();
  const a = t.about;

  return (
    <Section id="sobre" title={a.title}>
      <ScrubText
        text={a.lead}
        accent={a.accent}
        className="m-0 text-[clamp(22px,2.9vw,46px)] leading-[1.25] font-medium tracking-[-0.02em] text-pretty"
      />
    </Section>
  );
}
