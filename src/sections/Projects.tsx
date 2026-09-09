import Section from "../components/Section";
import ExperienceRadar from "../components/ExperienceRadar";
import { experienceRadar, projects, projectsIntro, type Project } from "../data/projects";

function ProjectCard({ project }: { project: Project }) {
  return (
    <div>
      <p className="m-0 mb-2 font-mono text-[clamp(15px,1.7vw,17px)] leading-[1.4] tracking-[-0.01em] text-neutral-200">
        {project.title}
      </p>
      <p className="m-0 text-sm leading-[1.7] text-neutral-500">{project.description}</p>
    </div>
  );
}

function RadarCard() {
  return (
    <div className="flex items-center justify-center">
      <ExperienceRadar data={experienceRadar} />
    </div>
  );
}

export default function Projects() {
  const [ingestao, analytics, lideranca, otimizacao, backend, scraping, aiops] = projects;

  return (
    <Section id="projetos" number="02" label="projetos">
      <p className="m-0 mb-8 max-w-[62ch] text-base leading-[1.8] text-neutral-500">
        {projectsIntro}
      </p>

      {/* Mobile: flat stack in reading order. */}
      <div className="flex flex-col gap-y-8 md:hidden">
        <ProjectCard project={ingestao} />
        <ProjectCard project={analytics} />
        <RadarCard />
        <ProjectCard project={lideranca} />
        <ProjectCard project={otimizacao} />
        <ProjectCard project={scraping} />
        <ProjectCard project={backend} />
        <ProjectCard project={aiops} />
      </div>

      {/* Desktop: two independent columns so a shorter card isn't stretched
          to match a taller sibling in the same grid row (avoids dead space). */}
      <div className="hidden gap-x-[clamp(24px,4vw,48px)] md:flex">
        <div className="flex flex-1 flex-col justify-between gap-y-8">
          <ProjectCard project={ingestao} />
          <RadarCard />
          <ProjectCard project={otimizacao} />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-y-8">
          <ProjectCard project={analytics} />
          <ProjectCard project={lideranca} />
          <ProjectCard project={scraping} />
          <ProjectCard project={backend} />
          <ProjectCard project={aiops} />
        </div>
      </div>
    </Section>
  );
}
