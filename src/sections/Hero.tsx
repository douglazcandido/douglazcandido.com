import { profile } from "../data/profile";
import { useI18n } from "../i18n/context";
import { useParallax } from "../hooks/useParallax";
import HeroTower from "../components/hero-tower/HeroTower";

/** One headline line whose letters rise out of a clipped mask, staggered. */
function HeroLine({ text, base, className = "" }: { text: string; base: number; className?: string }) {
  return (
    <span className={`hero-line ${className}`} aria-hidden="true">
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

  return (
    <header id="inicio" className="screen px-page pt-[clamp(140px,32vh,320px)] pb-[clamp(48px,7vw,104px)]">
      <div ref={titleRef} className="relative will-change-transform">
        <h1
          aria-label={profile.name}
          className="display m-0 text-[clamp(60px,11vw,196px)] leading-[0.95] font-semibold tracking-[-0.045em]"
        >
          <HeroLine text="Douglas" base={150} />
          <HeroLine text="Candido" base={380} className="text-accent" />
        </h1>

        <div className="fade-up mt-[clamp(24px,3vw,44px)]" style={{ "--d": "800ms" } as React.CSSProperties}>
          <p className="m-0 max-w-[42ch] text-[clamp(20px,2.2vw,34px)] leading-[1.45] font-light text-neutral-300 text-pretty">
            {t.hero.summary}
          </p>
        </div>

        {/* Decorative, absolutely positioned on the right: adds nothing to the layout of the text. */}
        <HeroTower />
      </div>
    </header>
  );
}
