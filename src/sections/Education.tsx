import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { education } from "../data/education";

export default function Education() {
  return (
    <Section id="educacao" number="04" label="educação">
      <div className="flex flex-col">
        {education.map((item, index) => (
          <Reveal
            key={item.title}
            className="border-b border-neutral-900 py-6 sm:py-[26px]"
            delay={index * 130}
          >
            <p className="m-0 mb-2 font-mono text-[clamp(16px,2vw,21px)] tracking-[-0.01em]">
              {item.title}
            </p>
            <p className="m-0 text-sm text-neutral-500">{item.school}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
