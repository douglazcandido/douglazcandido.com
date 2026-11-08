import Section from "../components/Section";
import LogoMarquee from "../components/LogoMarquee";
import Reveal from "../components/Reveal";
import { skills } from "../data/skills";
import { useI18n } from "../i18n/context";

export default function Skills() {
  const { t } = useI18n();

  return (
    <Section
      id="skills"
      title={t.skills.title}
      bleed={
        <Reveal className="mt-[clamp(32px,5vw,72px)]">
          <LogoMarquee skills={skills} />
        </Reveal>
      }
    >
      <p className="m-0 max-w-[60ch] text-[clamp(17px,1.5vw,22px)] leading-[1.55] text-neutral-400">
        {t.skills.text}
      </p>
    </Section>
  );
}
