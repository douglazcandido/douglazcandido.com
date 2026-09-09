import Section from "../components/Section";
import { profile } from "../data/profile";

export default function About() {
  return (
    <Section id="sobre" number="01" label="sobre">
      <p className="m-0 mb-6 max-w-[56ch] text-[clamp(19px,2.3vw,26px)] leading-[1.5] text-neutral-200 text-pretty">
        {profile.aboutLead}
      </p>
      <p className="m-0 max-w-[62ch] text-base leading-[1.8] text-neutral-500">
        {profile.aboutBody}
      </p>
    </Section>
  );
}
