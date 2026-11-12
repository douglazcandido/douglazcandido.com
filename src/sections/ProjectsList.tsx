import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { FaGithub } from "react-icons/fa";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { useI18n } from "../i18n/context";

interface Project {
  title: string;
  description: string;
  tags: readonly string[];
  /** Public repository, when there is one. */
  repo?: string;
}

const EASE = "ease-[cubic-bezier(0.19,1,0.22,1)]";

/** One block of a detail: fades and rises in after the previous one, so the panel "assembles". */
function Step({ order, active, className = "", children }: { order: number; active: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`transition-[opacity,translate] duration-700 ${EASE} ${
        active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
      style={{ transitionDelay: active ? `${120 + order * 90}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/** Everything about one project: title, text and tags. */
function ProjectDetail({ project, active }: { project: Project; active: boolean }) {
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col gap-9">
      <Step order={0} active={active}>
        <h3 className="m-0 max-w-[24ch] font-display text-[clamp(26px,2.9vw,46px)] leading-[1.05] font-semibold tracking-[-0.03em] text-pretty">
          {project.title}
        </h3>
      </Step>

      <Step order={1} active={active}>
        <p className="m-0 max-w-[60ch] text-[clamp(15px,1.15vw,18px)] leading-[1.75] text-neutral-400">{project.description}</p>
      </Step>

      {project.repo && (
        <Step order={2} active={active}>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="group/repo inline-flex items-center gap-3 rounded-full border border-divider py-2.5 pr-4 pl-4 text-[13px] font-medium tracking-[0.04em] text-neutral-200 transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <FaGithub aria-hidden="true" className="h-[18px] w-[18px]" />
            {t.projects.repoCta}
            <FiArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5"
            />
          </a>
        </Step>
      )}

      <Step order={project.repo ? 3 : 2} active={active} className="mt-auto">
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-accent/10 px-3 py-1 text-[10.5px] tracking-[0.12em] text-accent uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
      </Step>
    </div>
  );
}

/**
 * Master-detail: the list of projects on the left, the selected one on the right.
 * On desktop, hovering a row (or focusing it) opens it; the panel keeps the last one
 * until another is hovered. On narrow or touch screens each row opens in place on click.
 */
export default function ProjectsList() {
  const { t } = useI18n();
  const items = t.projects.items;
  const [current, setCurrent] = useState(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  /** Hover opens a project only where the panel sits beside the list (desktop with a mouse). */
  const hoverOpen = (i: number) => {
    if (!window.matchMedia("(min-width: 1024px) and (hover: hover)").matches) return;
    clearTimeout(hoverTimer.current);
    // A short intent delay so sweeping the pointer across rows does not flicker the panel.
    hoverTimer.current = setTimeout(() => setCurrent(i), 70);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (current + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length;
    setCurrent(next);
    e.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  return (
    <Section id="projetos" title={t.projects.title}>
      <Reveal as="p" className="m-0 mb-[clamp(28px,4vw,56px)] max-w-[60ch] text-[clamp(17px,1.5vw,22px)] leading-[1.55] text-neutral-400">
        {t.projects.intro}
      </Reveal>

      <div className="grid grid-cols-1 gap-x-[clamp(32px,5vw,88px)] lg:grid-cols-12">
        <ul
          className="m-0 list-none border-t border-divider p-0 lg:col-span-5 lg:self-start"
          onKeyDown={onKeyDown}
          onPointerLeave={() => clearTimeout(hoverTimer.current)}
        >
          {items.map((project, i) => {
            const active = i === current;
            return (
              <li key={i} className="border-b border-divider">
                <button
                  type="button"
                  id={`project-tab-${i}`}
                  aria-expanded={active}
                  aria-controls={`project-panel-${i}`}
                  onClick={() => setCurrent(i)}
                  onFocus={() => setCurrent(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && hoverOpen(i)}
                  className="group relative flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden py-[clamp(16px,1.8vw,26px)] pr-2 pl-6 text-left"
                >
                  {/* soft wash that sweeps in behind the active row */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent transition-opacity duration-700 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-[3px] origin-top bg-accent transition-transform duration-500 ${EASE} ${
                      active ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                  <span
                    className={`relative font-display text-[clamp(18px,1.6vw,25px)] leading-[1.15] font-semibold tracking-[-0.02em] text-pretty transition-[color,translate] duration-500 ${EASE} ${
                      active ? "translate-x-1 text-neutral-100" : "text-neutral-500 group-hover:text-neutral-300"
                    }`}
                  >
                    {project.title}
                  </span>
                  <FiArrowRight
                    aria-hidden="true"
                    className={`relative hidden h-5 w-5 shrink-0 text-accent transition-all duration-500 ${EASE} lg:block ${
                      active ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                    }`}
                  />
                </button>

                {/* Narrow screens: the detail opens right under its row. */}
                <div
                  id={`project-panel-${i}`}
                  role="region"
                  aria-labelledby={`project-tab-${i}`}
                  inert={!active}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ${EASE} lg:hidden ${
                    active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-2 pr-1 pb-8 pl-6">
                      <ProjectDetail project={project} active={active} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Desktop: every detail shares one cell so the panel never changes height.
            The ones before the current slide away upward, the ones after wait below. */}
        <div className="hidden lg:col-span-7 lg:grid">
          {items.map((project, i) => {
            const active = i === current;
            const shift = active ? "translate-y-0" : i < current ? "-translate-y-4" : "translate-y-4";
            return (
              <div
                key={i}
                inert={!active}
                className={`col-start-1 row-start-1 rounded-[20px] border border-divider bg-surface p-[clamp(32px,3.6vw,60px)] transition-[opacity,translate,border-color] duration-700 ${EASE} ${shift} ${
                  active ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <ProjectDetail project={project} active={active} />
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
