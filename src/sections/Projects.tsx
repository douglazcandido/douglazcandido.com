import Section from "../components/Section";
import Reveal from "../components/Reveal";
import ExperienceRadar from "../components/ExperienceRadar";
import { experienceRadar, projects, projectsIntro, type Project } from "../data/projects";

function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <p className="m-0 mb-2 font-mono text-[clamp(15px,1.7vw,17px)] leading-[1.4] tracking-[-0.01em] text-neutral-200">
        {project.title}
      </p>
      <p className="m-0 text-sm leading-[1.7] text-neutral-500">{project.description}</p>
    </Reveal>
  );
}

function RadarCard({ delay = 0 }: { delay?: number }) {
  return (
    <Reveal className="flex items-center justify-center" delay={delay}>
      <ExperienceRadar data={experienceRadar} />
    </Reveal>
  );
}

export default function Projects() {
  const [ingestao, analytics, lideranca, otimizacao, backend, scraping, aiops] = projects;
  const stagger = (index: number) => index * 130;

  return (
    <Section id="projetos" number="02" label="projetos">
      <Reveal as="p" className="m-0 mb-8 max-w-[62ch] text-base leading-[1.8] text-neutral-500">
        {projectsIntro}
      </Reveal>

      {/* Mobile: flat stack in reading order. */}
      <div className="flex flex-col gap-y-8 md:hidden">
        <ProjectCard project={ingestao} delay={stagger(0)} />
        <ProjectCard project={analytics} delay={stagger(1)} />
        <RadarCard delay={stagger(2)} />
        <ProjectCard project={lideranca} delay={stagger(3)} />
        <ProjectCard project={otimizacao} delay={stagger(4)} />
        <ProjectCard project={scraping} delay={stagger(5)} />
        <ProjectCard project={backend} delay={stagger(6)} />
        <ProjectCard project={aiops} delay={stagger(7)} />
      </div>

      {/* Desktop: two independent columns so a shorter card isn't stretched
          to match a taller sibling in the same grid row (avoids dead space). */}
      <div className="hidden gap-x-[clamp(24px,4vw,48px)] md:flex">
        <div className="flex flex-1 flex-col justify-between gap-y-8">
          <ProjectCard project={ingestao} delay={stagger(0)} />
          <RadarCard delay={stagger(1)} />
          <ProjectCard project={otimizacao} delay={stagger(2)} />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-y-8">
          <ProjectCard project={analytics} delay={stagger(0)} />
          <ProjectCard project={lideranca} delay={stagger(1)} />
          <ProjectCard project={scraping} delay={stagger(2)} />
          <ProjectCard project={backend} delay={stagger(3)} />
          <ProjectCard project={aiops} delay={stagger(4)} />
        </div>
      </div>
    </Section>
  );
}
