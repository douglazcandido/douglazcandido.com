import { FiArrowUpRight } from "react-icons/fi";
import { useInView } from "../hooks/useInView";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import SpotlightCard from "../components/SpotlightCard";
import { Fragment, lazy, Suspense } from "react";
import { metricProject, radarValues } from "../data/projects";
import { useI18n } from "../i18n/context";

const ExperienceRadar = lazy(() => import("../components/ExperienceRadar"));
const NEAR_VIEWPORT = { threshold: 0, rootMargin: "600px 0px" } as const;

/** Mounts the (heavy) chart library only once the card is close to the screen. */
function LazyRadar() {
  const { t } = useI18n();
  const { ref, isInView } = useInView<HTMLDivElement>(NEAR_VIEWPORT);
  const data = t.projects.axes.map((subject, i) => ({ subject, value: radarValues[i], fullMark: 10 }));
  return (
    <div ref={ref} className="aspect-square w-full max-w-[360px] md:max-w-[460px]">
      {isInView && (
        <Suspense fallback={null}>
          <ExperienceRadar data={data} />
        </Suspense>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: { title: string; description: string; tags: string[] };
  index: number;
  className?: string;
}

function ProjectCard({ project, index, className = "" }: ProjectCardProps) {
  const { t } = useI18n();
  const metric = index === metricProject.index ? { ...metricProject, caption: t.projects.metricCaption } : undefined;
  const { ref: barRef, isInView: barsVisible } = useInView<HTMLDivElement>();

  return (
    <Reveal className={`h-full ${className}`} delay={(index % 3) * 110}>
      <SpotlightCard className="group flex h-full flex-col p-[clamp(20px,2.2vw,36px)]">
        <div className="flex items-center justify-end text-neutral-500">
          <FiArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 -translate-x-1 translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-0 group-hover:text-accent group-hover:opacity-100"
          />
        </div>

        <div className={metric ? "flex flex-1 flex-col gap-8 xl:flex-row xl:items-end xl:justify-between" : "flex flex-1 flex-col"}>
          <div className={metric ? "xl:max-w-[52%]" : ""}>
            <h3 className="m-0 mt-[clamp(20px,3vw,44px)] font-display text-[clamp(20px,1.7vw,28px)] leading-[1.15] font-semibold tracking-[-0.02em] text-pretty">
              {project.title}
            </h3>
            <p className="m-0 mt-4 text-[15px] leading-[1.7] text-neutral-400">{project.description}</p>
          </div>

          {metric && (
            <div className="xl:text-right">
              <p className="display m-0 flex items-baseline gap-3 text-[clamp(44px,5.6vw,88px)] leading-[0.9] xl:justify-end">
                <span className="text-neutral-600 line-through decoration-accent decoration-[3px]">{metric.from}</span>
                <span className="font-mono text-[0.22em] font-normal text-accent">→</span>
                <span className="text-accent">{metric.to}</span>
                <span className="font-mono text-[0.2em] font-normal tracking-normal text-neutral-300 normal-case">{metric.unit}</span>
              </p>
              <p className="m-0 mt-3 font-mono text-[11px] tracking-[0.16em] text-neutral-500 uppercase">{metric.caption}</p>

              <div ref={barRef} className={`mt-6 flex flex-col gap-2.5 xl:min-w-[320px] ${barsVisible ? "bar-visible" : ""}`}>
                <div>
                  <div className="mb-1 flex justify-between font-mono text-[10px] tracking-[0.16em] text-neutral-500 uppercase">
                    <span>{t.projects.before}</span>
                    <span>{metric.from} {metric.unit}</span>
                  </div>
                  <div className="h-2 bg-neutral-900">
                    <div className="bar-fill h-full bg-neutral-600" />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                    <span>{t.projects.after}</span>
                    <span>{metric.to} {metric.unit}</span>
                  </div>
                  <div className="h-2 bg-neutral-900">
                    <div
                      className="bar-fill h-full bg-accent"
                      style={{ width: `${(Number(metric.to) / Number(metric.from)) * 100}%`, transitionDelay: "0.6s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ul className="m-0 mt-8 flex list-none flex-wrap gap-2 p-0">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-divider px-2.5 py-1 font-mono text-[10.5px] tracking-[0.12em] text-neutral-400 uppercase transition-colors group-hover:border-accent/50"
            >
              {tag}
            </li>
          ))}
        </ul>
      </SpotlightCard>
    </Reveal>
  );
}

function RadarCard({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const [pre, accent, post] = t.projects.radarTitle;

  return (
    <Reveal className={`h-full ${className}`} delay={110}>
      <SpotlightCard className="flex h-full flex-col p-[clamp(20px,2.2vw,36px)]">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
          <span>
            <span className="text-accent">R—</span>00
          </span>
          <span>{t.projects.radarScale}</span>
        </div>
        <h3 className="m-0 mt-[clamp(20px,3vw,44px)] font-display text-[clamp(20px,1.7vw,28px)] leading-[1.15] font-semibold tracking-[-0.02em]">
          {pre}<span className="text-accent">{accent}</span>{post}
        </h3>
        <div className="flex flex-1 items-center justify-center py-6">
          <LazyRadar />
        </div>
      </SpotlightCard>
    </Reveal>
  );
}

export default function Projects() {
  const { t } = useI18n();
  const items = t.projects.items;
  const spans = [
    "md:col-span-7",
    "md:col-span-7",
    "md:col-span-5 lg:col-span-4",
    "md:col-span-7 lg:col-span-8",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-4",
  ];

  // The radar sits right after the first card and spans two rows (12-col bento keeps every row full).
  return (
    <Section id="projetos" title={t.projects.title}>
      <Reveal as="p" className="m-0 mb-[clamp(28px,4vw,56px)] max-w-[60ch] text-[clamp(17px,1.5vw,22px)] leading-[1.55] text-neutral-400">
        {t.projects.intro}
      </Reveal>

      <div className="grid grid-cols-1 gap-[clamp(12px,1.4vw,20px)] md:grid-cols-12">
        {items.map((project, i) => (
          <Fragment key={i}>
            <ProjectCard project={project} index={i} className={spans[i]} />
            {i === 0 && <RadarCard className="md:col-span-5 md:row-span-2" />}
          </Fragment>
        ))}
      </div>
    </Section>
  );
}
