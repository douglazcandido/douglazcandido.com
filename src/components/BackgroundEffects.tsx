import { useEffect, useRef, useState } from "react";
import grain from "../assets/grain.png";

/**
 * Decorative-only background: a soft radial glow, a faint dot-grid
 * ("graph paper") texture, two line-chart motifs that drift with scroll
 * position (parallax, at different depths/directions), and an animated
 * film-grain layer on top. All layers are theme-aware via color-mix()
 * against --color-text / --color-accent so they hold up in both themes.
 *
 * The chart paths use a portrait-friendly viewBox/geometry below the
 * `sm` breakpoint - with "slice" scaling, the wide desktop curve would
 * get cropped down to a single oversized arc on a tall narrow screen.
 */
export default function BackgroundEffects() {
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = scrollable > 0 ? window.scrollY / scrollable : 0;

      const farY = fraction * 50 - 25;
      const nearY = -(fraction * 90 - 45);
      const nearX = fraction * 20 - 10;

      if (farRef.current) {
        farRef.current.style.transform = `translate3d(0, ${farY}px, 0)`;
      }
      if (nearRef.current) {
        nearRef.current.style.transform = `translate3d(${nearX}px, ${nearY}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const far = isMobile
    ? {
        viewBox: "0 0 400 900",
        line: "M0 330 C 60 300, 90 370, 150 330 S 230 250, 290 290 S 370 220, 400 240",
        fillClose: "L400 900 L0 900 Z",
        points: [
          [150, 330],
          [290, 290],
        ],
      }
    : {
        viewBox: "0 0 1600 900",
        line: "M0 640 C 140 600, 220 700, 360 620 S 560 480, 700 540 S 920 360, 1060 430 S 1280 300, 1420 350 S 1560 260, 1600 300",
        fillClose: "L1600 900 L0 900 Z",
        points: [
          [360, 620],
          [700, 540],
          [1060, 430],
          [1420, 350],
        ],
      };

  const near = isMobile
    ? {
        viewBox: "0 0 400 900",
        line: "M0 190 C 70 220, 110 140, 190 175 S 320 240, 400 200",
        fillClose: "L400 900 L0 900 Z",
        points: [
          [190, 175],
        ],
        pulse: [400, 200] as const,
      }
    : {
        viewBox: "0 0 1600 900",
        line: "M0 300 C 160 340, 260 220, 400 280 S 620 420, 780 360 S 980 220, 1140 270 S 1360 400, 1520 340 S 1600 320, 1600 320",
        fillClose: "L1600 900 L0 900 Z",
        points: [
          [400, 280],
          [780, 360],
          [1140, 270],
        ],
        pulse: [1520, 340] as const,
      };

  return (
    <>
      {/* Soft glow wash, top-left + a faint accent tint bottom-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(58% 42% at 18% 0%, rgba(255,255,255,0.06), transparent 70%),
            radial-gradient(50% 38% at 85% 100%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 70%)
          `,
        }}
      />

      {/* Dot-grid texture, evoking graph paper / scatter data */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle, color-mix(in srgb, var(--color-text) 22%, transparent) 1px, transparent 1.2px)`,
          backgroundSize: "26px 26px",
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 20%, black 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 20%, black 30%, transparent 85%)",
        }}
      />

      {/* Far line-chart layer: slow parallax, wider/quieter trend line */}
      <div
        ref={farRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-0 will-change-transform"
        style={{ inset: "-12%", opacity: 0.55 }}
      >
        <svg
          className="h-full w-full"
          viewBox={far.viewBox}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="chart-fill-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${far.line} ${far.fillClose}`} fill="url(#chart-fill-far)" />
          <path
            d={far.line}
            fill="none"
            stroke="var(--color-accent)"
            strokeOpacity="0.28"
            strokeWidth="1.5"
          />
          <g fill="var(--color-accent)" fillOpacity="0.4">
            {far.points.map(([cx, cy]) => (
              <circle key={`far-${cx}-${cy}`} cx={cx} cy={cy} r="2" />
            ))}
          </g>
        </svg>
      </div>

      {/* Near line-chart layer: faster/opposite parallax, sharper trend line */}
      <div
        ref={nearRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-0 will-change-transform"
        style={{ inset: "-12%", opacity: 0.6 }}
      >
        <svg
          className="h-full w-full"
          viewBox={near.viewBox}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="chart-fill-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-text)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--color-text)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${near.line} ${near.fillClose}`} fill="url(#chart-fill-near)" />
          <path
            d={near.line}
            fill="none"
            stroke="color-mix(in srgb, var(--color-text) 55%, transparent)"
            strokeOpacity="0.24"
            strokeWidth="1.25"
          />
          <g fill="var(--color-text)" fillOpacity="0.3">
            {near.points.map(([cx, cy]) => (
              <circle key={`near-${cx}-${cy}`} cx={cx} cy={cy} r="1.75" />
            ))}
          </g>
          <circle
            className="data-graph-pulse"
            cx={near.pulse[0]}
            cy={near.pulse[1]}
            r="3"
            fill="var(--color-accent)"
          />
        </svg>
      </div>

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
