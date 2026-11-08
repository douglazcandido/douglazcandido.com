import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useActiveSection } from "../hooks/useActiveSection";
import { useI18n } from "../i18n/context";

const sectionDefs = [
  { id: "sobre", key: "about" },
  { id: "projetos", key: "projects" },
  { id: "skills", key: "skills" },
  { id: "educacao", key: "education" },
  { id: "contato", key: "contact" },
] as const;

const sectionIds = sectionDefs.map((s) => s.id);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  const { t } = useI18n();
  const sections = sectionDefs.map((s) => ({ id: s.id, label: t.nav[s.key] }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`px-nav fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-out ${
          scrolled || open
            ? "border-divider bg-bg/80 backdrop-blur-md"
            : "border-transparent"
        }`}
      >
        <nav className="flex items-center justify-end py-[18px]">
          <div className="ml-auto flex items-center gap-4 sm:gap-6 md:gap-8">
            <ul className="m-0 hidden list-none items-center gap-8 p-0 md:flex">
              {sections.map((s, i) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`group relative inline-flex items-baseline gap-2 py-1 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                        isActive ? "text-neutral-100" : "text-neutral-500 hover:text-neutral-100"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`text-[9px] tracking-[0.1em] tabular-nums transition-colors duration-300 ${
                          isActive ? "text-accent" : "text-neutral-700 group-hover:text-accent"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <span aria-hidden="true" className="hidden h-3.5 w-px bg-divider md:block" />
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              className="font-mono text-[11px] tracking-[0.18em] uppercase md:hidden"
            >
              {open ? t.nav.close : t.nav.menu}
            </button>
          </div>
        </nav>
        <div
          aria-hidden="true"
          data-scroll-progress="x"
          className="absolute inset-x-0 -bottom-px h-px origin-left bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </header>

      <div
        id="menu-overlay"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-bg px-[var(--gutter)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] md:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {sections.map((s, i) => (
            <li key={s.id} className="overflow-hidden">
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="display flex items-baseline gap-4 text-[clamp(44px,14vw,88px)] leading-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                style={{
                  transform: open ? "translateY(0)" : "translateY(110%)",
                  transitionDelay: open ? `${150 + i * 60}ms` : "0ms",
                }}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
