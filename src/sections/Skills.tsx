import Section from "../components/Section";
import LogoMarquee from "../components/LogoMarquee";
import Reveal from "../components/Reveal";
import { skills } from "../data/skills";

export default function Skills() {
  return (
    <Section id="skills" number="03" label="skills" headingOffsetClassName="md:mt-0">
      <Reveal>
        <LogoMarquee skills={skills} />
      </Reveal>
    </Section>
  );
}
