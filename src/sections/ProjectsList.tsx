import { useState, type KeyboardEvent } from "react";
import { FiArrowRight } from "react-icons/fi";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { metricProject } from "../data/projects";
import { useI18n } from "../i18n/context";

interface Project {
  title: string;
  description: string;
  tags: readonly string[];
}

/** Everything about one project: title, text, optional before/after metric, tags. */
function ProjectDetail({ project, index, active }: { project: Project; index: number; active: boolean }) {
  const { t } = useI18n();
  const metric = index === metricProject.index ? { ...metricProject, caption: t.projects.metricCaption } : undefined;

  return (
    <div className="flex h-full flex-col gap-8">
      <div>
        <h3 className="m-0 max-w-[24ch] font-display text-[clamp(24px,2.7vw,42px)] leading-[1.08] font-semibold tracking-[-0.025em] text-pretty">
          {project.title}
        </h3>
        <p className="m-0 mt-5 max-w-[62ch] text-[clamp(15px,1.15vw,18px)] leading-[1.7] text-neutral-400">{project.description}</p>
      </div>

      {metric && (
        <div className={active ? "bar-visible" : ""}>
          <p className="display m-0 flex items-baseline gap-3 text-[clamp(44px,5.2vw,80px)] leading-[0.9]">
            <span className="text-neutral-600 line-through decoration-accent decoration-[3px]">{metric.from}</span>
            <span className="text-[0.22em] font-normal text-accent">→</span>
            <span className="text-accent">{metric.to}</span>
            <span className="text-[0.2em] font-normal tracking-normal text-neutral-300 normal-case">{metric.unit}</span>
          </p>
          <p className="m-0 mt-3 text-[11px] tracking-[0.16em] text-neutral-500 uppercase">{metric.caption}</p>

          <div className="mt-6 flex max-w-[420px] flex-col gap-2.5">
            <div>
              <div className="mb-1 flex justify-between text-[10px] tracking-[0.16em] text-neutral-500 uppercase">
                <span>{t.projects.before}</span>
                <span>{metric.from} {metric.unit}</span>
              </div>
              <div className="h-2 bg-neutral-900">
                <div className="bar-fill h-full bg-neutral-600" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-[10px] tracking-[0.16em] text-accent uppercase">
                <span>{t.projects.after}</span>
                <span>{metric.to} {metric.unit}</span>
              </div>
              <div className="h-2 bg-neutral-900">
                <div
                  className="bar-fill h-full bg-accent"
                  style={{ width: `${(Number(metric.to) / Number(metric.from)) * 100}%`, transitionDelay: "0.35s" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="m-0 mt-auto flex list-none flex-wrap gap-2 p-0">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-md border border-divider px-2.5 py-1 text-[10.5px] tracking-[0.12em] text-neutral-400 uppercase"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Master-detail: the list of projects on the left, the selected one on the right
 * (desktop). On narrow screens each row opens in place, like an accordion.
 * One project is always open; arrow keys move between rows.
 */
export default function ProjectsList() {
  const { t } = useI18n();
  const items = t.projects.items;
  const [current, setCurrent] = useState(0);

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

      <div className="grid grid-cols-1 gap-x-[clamp(24px,4vw,64px)] lg:grid-cols-12">
        <ul className="m-0 list-none border-t border-divider p-0 lg:col-span-5 lg:self-start" onKeyDown={onKeyDown}>
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
                  className="group relative flex w-full cursor-pointer items-center justify-between gap-4 py-[clamp(16px,1.7vw,24px)] pr-1 pl-5 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-3 left-0 w-[3px] origin-center bg-accent transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                      active ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                  <span
                    className={`font-display text-[clamp(18px,1.6vw,25px)] leading-[1.15] font-semibold tracking-[-0.02em] text-pretty transition-colors duration-300 ${
                      active ? "text-neutral-100" : "text-neutral-500 group-hover:text-neutral-200"
                    }`}
                  >
                    {project.title}
                  </span>
                  <FiArrowRight
                    aria-hidden="true"
                    className={`hidden h-5 w-5 shrink-0 text-accent transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] lg:block ${
                      active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                    }`}
                  />
                </button>

                {/* Narrow screens: the detail opens right under its row. */}
                <div
                  id={`project-panel-${i}`}
                  role="region"
                  aria-labelledby={`project-tab-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] lg:hidden ${
                    active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-2 pr-1 pb-8 pl-5">
                      <ProjectDetail project={project} index={i} active={active} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Desktop: all details share one cell so the panel never changes height; the active one fades in. */}
        <div className="hidden lg:col-span-7 lg:grid">
          {items.map((project, i) => {
            const active = i === current;
            return (
              <div
                key={i}
                inert={!active}
                className={`col-start-1 row-start-1 rounded-[14px] border border-divider bg-surface p-[clamp(28px,3.2vw,52px)] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                }`}
              >
                <ProjectDetail project={project} index={i} active={active} />
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
