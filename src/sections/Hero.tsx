import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/context";
import Portrait from "../components/Portrait";
import ScrambleText from "../components/ScrambleText";
import { useParallax } from "../hooks/useParallax";
import portrait from "../assets/douglas-candido-retrato.jpg";

/** One headline line whose letters rise out of a clipped mask, staggered. */
function HeroLine({ text, base }: { text: string; base: number }) {
  return (
    <span className="hero-line" aria-hidden="true">
      {text.split("").map((char, i) => (
        <span key={i} className="hero-char" style={{ "--i": i, "--base": `${base}ms` } as React.CSSProperties}>
          {char}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { t } = useI18n();
  const titleRef = useParallax<HTMLDivElement>({ y: 30 });
  const portraitRef = useParallax<HTMLDivElement>({ y: -60 });

  return (
    <header id="inicio" className="px-page pt-[clamp(88px,10vw,128px)] pb-[clamp(48px,7vw,104px)]">
      <div className="grid grid-cols-1 items-center gap-x-[clamp(24px,5vw,80px)] gap-y-10 lg:grid-cols-12">
        <div ref={titleRef} className="will-change-transform lg:col-span-8">
          <p
            className="fade-up m-0 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-neutral-400 uppercase"
            style={{ "--d": "100ms" } as React.CSSProperties}
          >
            <span className="h-px w-8 bg-accent" />
            <ScrambleText text={t.hero.role} delay={400} />
          </p>

          <h1
            aria-label={profile.name}
            className="display m-0 mt-[clamp(20px,2.6vw,36px)] text-[clamp(52px,9.2vw,152px)] leading-[0.95] font-semibold tracking-[-0.045em]"
          >
            <HeroLine text="Douglas" base={150} />
            <HeroLine text="Candido" base={380} />
          </h1>

          <div className="fade-up mt-[clamp(24px,3vw,44px)] flex flex-col gap-8" style={{ "--d": "800ms" } as React.CSSProperties}>
            <p className="m-0 max-w-[40ch] text-[clamp(18px,1.8vw,26px)] leading-[1.45] font-light text-neutral-300 text-pretty">
              {t.hero.summary}
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a href="#contato" className="btn btn-primary">
                {t.hero.ctaContact} <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a href="#skills" className="btn">
                {t.hero.ctaStack} <FiArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div ref={portraitRef} className="will-change-transform lg:col-span-4">
          <Portrait
            src={portrait}
            className="fade-up mx-auto w-full max-w-[400px] lg:mx-0 lg:ml-auto lg:max-w-[460px]"
          />
        </div>
      </div>
    </header>
  );
}
