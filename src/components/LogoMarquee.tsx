import type { Skill } from "../data/skills";
import Marquee from "./Marquee";
import { useI18n } from "../i18n/context";

interface LogoMarqueeProps {
  skills: Skill[];
}

function LogoTile({ skill }: { skill: Skill }) {
  return (
    <div className="group relative mr-[clamp(12px,1.4vw,20px)] flex h-[clamp(96px,11vw,150px)] w-[clamp(150px,17vw,240px)] shrink-0 items-center justify-center border border-divider bg-surface p-[clamp(6px,0.8vw,12px)] transition-colors duration-500 hover:border-accent">
      {skill.mono ? (
        /* dark artwork: flat light mark on the dark theme, flat dark mark on the light one */
        <img
          src={skill.logo}
          alt={skill.name}
          width={160}
          height={160}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="logo-mono h-full w-full object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : (
        /* muted grayscale at rest, true colors on hover */
        <img
          src={skill.logo}
          alt={skill.name}
          width={160}
          height={160}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain opacity-70 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        />
      )}
      <span className="absolute top-2 left-2.5 font-mono text-[9px] tracking-[0.18em] text-neutral-600 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {skill.name}
      </span>
    </div>
  );
}

/** Two opposing logo tickers; both speed up with scroll and keep a steady base speed. */
export default function LogoMarquee({ skills }: LogoMarqueeProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-[clamp(14px,2vw,28px)]" role="list" aria-label={t.a11y.tools}>
      <Marquee speed={55} className="[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {skills.map((skill) => (
          <div key={skill.name} role="listitem">
            <LogoTile skill={skill} />
          </div>
        ))}
      </Marquee>

      <Marquee
        speed={40}
        direction={-1}
       
        className="[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        {[...skills].reverse().map((skill) => (
          <div key={skill.name} role="listitem">
            <LogoTile skill={skill} />
          </div>
        ))}
      </Marquee>
    </div>
  );
}
