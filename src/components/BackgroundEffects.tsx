import grain from "../assets/grain.png";

/**
 * Decorative-only layers ported from the original design: a soft radial
 * gradient wash plus an animated film-grain texture over the whole page.
 */
export default function BackgroundEffects() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(58% 42% at 18% 0%, rgba(255,255,255,0.06), transparent 70%)
          `,
        }}
      />
      <div
        aria-hidden="true"
        className="grain-layer pointer-events-none fixed z-9 opacity-55 mix-blend-soft-light"
        style={{
          inset: "-20%",
          backgroundImage: `url(${grain})`,
          backgroundSize: "220px 220px",
        }}
      />
    </>
  );
}
