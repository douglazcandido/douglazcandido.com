import type { CSSProperties } from "react";
import type { Skill } from "../data/skills";

interface LogoMarqueeProps {
  skills: Skill[];
}

function LogoItem({ skill }: { skill: Skill }) {
  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url(${skill.logo})`,
    maskImage: `url(${skill.logo})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };

  return (
    <div className="group relative isolate inline-flex h-10 items-center sm:h-12">
      {/* grayscale artwork keeps the logo's own shading/texture visible */}
      <img
        src={skill.logo}
        alt={skill.name}
        className={
          skill.whiteOnHover
            ? "h-10 w-auto object-contain grayscale opacity-80 transition-[filter,opacity] duration-300 ease-out group-hover:opacity-100 group-hover:brightness-0 group-hover:invert sm:h-12"
            : "h-10 w-auto object-contain grayscale opacity-80 transition-[filter,opacity] duration-300 ease-out group-hover:opacity-100 group-hover:grayscale-0 sm:h-12"
        }
      />
      {/* tints that grayscale artwork accent-green at rest, keeping its luminance/texture; fades out to reveal true colors on hover */}
      <span
        aria-hidden="true"
        style={maskStyle}
        className="pointer-events-none absolute inset-0 bg-neutral-300 opacity-80 mix-blend-color transition-opacity duration-300 ease-out group-hover:opacity-0"
      />
    </div>
  );
}

export default function LogoMarquee({ skills }: LogoMarqueeProps) {
  return (
    <div
      className="group/marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]"
      role="list"
      aria-label="Ferramentas e tecnologias"
    >
      <div className="animate-marquee flex w-max items-center gap-10 py-2 group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-8 motion-reduce:gap-y-6">
        {[...skills, ...skills].map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            role="listitem"
            className={i >= skills.length ? "motion-reduce:hidden" : undefined}
            aria-hidden={i >= skills.length}
          >
            <LogoItem skill={skill} />
          </div>
        ))}
      </div>
    </div>
  );
}
