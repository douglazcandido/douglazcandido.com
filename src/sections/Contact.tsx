import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import Reveal from "../components/Reveal";
import { useInView } from "../hooks/useInView";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/context";

const socials = [
  { href: profile.github, label: "GitHub", handle: "@douglazcandido", Icon: FaGithub },
  { href: profile.linkedin, label: "LinkedIn", handle: "in/douglazcandido", Icon: FaLinkedin },
  { href: profile.instagram, label: "Instagram", handle: "@douglazcandido", Icon: FaInstagram },
];

export default function Contact() {
  const { t } = useI18n();
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <section id="contato" className="relative overflow-hidden border-t border-divider pt-[clamp(56px,8vw,112px)] pb-[clamp(24px,3vw,40px)]">
      <div className="px-page">
        <div ref={ref} className={isInView ? "mask-visible" : ""}>
          <h2 className="display m-0 text-[clamp(38px,5.8vw,92px)] leading-[1.05] tracking-[-0.04em]">
            <span className="mask-line">
              <span className="mask-inner">
                {t.contact.title}<span className="text-accent">.</span>
              </span>
            </span>
          </h2>
        </div>

        <Reveal className="mt-[clamp(28px,4vw,56px)] flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`mailto:${profile.email}`}
            className="group relative font-display text-[clamp(20px,3.2vw,52px)] leading-none font-medium tracking-[-0.03em] break-all"
          >
            {profile.email}
            <span className="absolute -bottom-2 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </a>
        </Reveal>

        <ul className="m-0 mt-[clamp(32px,4.5vw,64px)] list-none border-t border-divider p-0">
          {socials.map(({ href, label, handle, Icon }, index) => (
            <Reveal as="li" key={label} delay={index * 110} className="border-b border-divider">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="row-sweep group flex items-center gap-[clamp(14px,3vw,48px)] py-[clamp(14px,1.6vw,22px)] hover:px-[clamp(12px,1.5vw,24px)]"
              >
                <Icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                <span className="row-title flex-1 font-display text-[clamp(20px,2.4vw,36px)] leading-none font-semibold tracking-[-0.03em] transition-colors duration-300">
                  {label}
                </span>
                <span className="hidden font-mono text-xs tracking-[0.14em] text-neutral-500 sm:block">{handle}</span>
                <FiArrowUpRight
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
                />
              </a>
            </Reveal>
          ))}
        </ul>

        <div className="mt-[clamp(32px,4vw,56px)] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-[0.16em] text-neutral-600 capitalize">
          <p className="m-0">
            © {profile.year} {profile.name}. {t.contact.rights}
          </p>
        </div>
      </div>

    </section>
  );
}
