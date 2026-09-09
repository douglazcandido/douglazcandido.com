import { profile } from "../data/profile";
import PortraitPlaceholder from "../components/PortraitPlaceholder";
import portrait from "../assets/portrait.jpg";

export default function Hero() {
  return (
    <header className="grid grid-cols-1 items-end gap-10 py-16 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:gap-[clamp(28px,5vw,72px)] md:py-[clamp(64px,11vh,140px)_0_clamp(56px,9vh,104px)]">
      <div>
        <h1 className="m-0 mb-5 font-mono text-[clamp(38px,7.2vw,86px)] leading-[0.98] font-medium tracking-[-0.04em] text-balance">
          Douglas
          <br />
          Candido
        </h1>
        <p className="m-0 mb-5 font-mono text-[clamp(13px,1.5vw,17px)] tracking-[0.02em] text-neutral-200">
          Engenheiro de Dados <span className="text-accent">&amp;</span> Backend
        </p>
        <p className="m-0 mb-8 max-w-[46ch] text-base leading-[1.7] text-neutral-400 text-pretty">
          {profile.heroSummary}
        </p>
        <div className="flex flex-wrap gap-3.5">
          <a
            href="#contato"
            className="inline-flex items-center justify-center rounded-sm border border-accent px-[22px] py-[13px] font-mono text-xs tracking-[0.12em] text-accent uppercase transition-colors hover:bg-accent/12 active:bg-accent/22"
          >
            Falar comigo
          </a>
          <a
            href="#skills"
            className="inline-flex items-center justify-center rounded-sm border border-accent px-[22px] py-[13px] font-mono text-xs tracking-[0.12em] text-accent uppercase transition-colors hover:bg-accent/12 active:bg-accent/22"
          >
            Stack técnica
          </a>
        </div>
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="animate-portrait-glow pointer-events-none absolute -inset-[5px] rounded-[21px]"
          style={{
            padding: "5px",
            background:
              "conic-gradient(from var(--portrait-glow-angle, 0deg), transparent 0%, var(--color-accent) 10%, transparent 30%, transparent 50%, var(--color-accent) 60%, transparent 80%, transparent 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            filter: "blur(2px) drop-shadow(0 0 4px var(--color-accent))",
          }}
        />
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-neutral-800/15 bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06),0_0_18px_rgba(77,143,240,0.12)]">
          <PortraitPlaceholder src={portrait} />
        </div>
      </div>
    </header>
  );
}
