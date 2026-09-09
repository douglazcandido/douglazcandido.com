import { FaEnvelope, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { profile } from "../data/profile";

const links = [
  { href: `mailto:${profile.email}`, label: "E-mail", Icon: FaEnvelope, external: false },
  { href: profile.github, label: "GitHub", Icon: FaGithub, external: true },
  { href: profile.linkedin, label: "LinkedIn", Icon: FaLinkedin, external: true },
  { href: profile.instagram, label: "Instagram", Icon: FaInstagram, external: true },
];

export default function Contact() {
  return (
    <section
      id="contato"
      className="border-t border-neutral-900 pt-14 md:pt-[clamp(56px,9vh,110px)]"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-[clamp(24px,4vw,64px)]">
        <SectionHeading number="05" label="contato" />
        <div className="flex flex-wrap gap-6">
          {links.map(({ href, label, Icon, external }, index) => (
            <Reveal key={label} as="span" delay={index * 130}>
              <a
                href={href}
                aria-label={label}
                title={label}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex items-center justify-center p-2 text-neutral-300 transition-colors hover:text-accent"
              >
                <Icon aria-hidden="true" className="h-6 w-6" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-wrap justify-between gap-5 border-t border-neutral-900 py-6 md:mt-[clamp(56px,9vh,110px)]">
        <p className="m-0 font-mono text-xs tracking-[0.16em] text-neutral-700">
          © {profile.year} {profile.name}. Todos os direitos reservados.
        </p>
      </div>
    </section>
  );
}
