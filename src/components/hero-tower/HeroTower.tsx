import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useI18n } from "../../i18n/context";
import TowerIllustration from "./TowerIllustration";
import { GROUP_BY_GAP, STAGE_ASPECT, STAGE_BLEED } from "./towerSpec";

/** Below this width the tower is not rendered at all (and Three.js is never downloaded). */
const MIN_WIDTH_QUERY = "(min-width: 900px)";

/** Runs `run` once the page has loaded and the browser is idle, so the 3D never competes with the text. */
function whenIdle(run: () => void): () => void {
  let cancelled = false;
  let idleId = 0;
  let timerId = 0;
  let started = false;
  const go = () => {
    if (cancelled || started) return; // `load` and the safety timer can both get here
    started = true;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => !cancelled && run(), { timeout: 4000 });
    } else {
      timerId = window.setTimeout(() => !cancelled && run(), 400);
    }
  };
  let safety = 0;
  if (document.readyState === "complete") {
    go();
  } else {
    window.addEventListener("load", go, { once: true });
    safety = window.setTimeout(go, 6000); // a stuck resource must not hold the tower back forever
  }
  return () => {
    cancelled = true;
    window.removeEventListener("load", go);
    window.clearTimeout(safety);
    window.clearTimeout(timerId);
    if (idleId) window.cancelIdleCallback(idleId);
  };
}

/**
 * Decorative 3D tower on the right side of the hero. Renders nothing on narrow screens; with
 * reduced motion, or when WebGL is unavailable, it stays a static illustration.
 */
export default function HeroTower() {
  const wide = useMediaQuery(MIN_WIDTH_QUERY);
  return wide ? <Tower /> : null;
}

function Tower() {
  const { t } = useI18n();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const [live, setLive] = useState(false);
  // `gap` keeps the last hovered opening so the label text stays while it fades out.
  const [hover, setHover] = useState<{ gap: number; on: boolean }>({ gap: 0, on: false });

  useEffect(() => {
    const stage = stageRef.current;
    const hero = rootRef.current?.closest("header");
    if (!stage || !hero || reducedMotion || !("WebGL2RenderingContext" in window)) return;

    const abort = new AbortController();
    let dispose: (() => void) | undefined;

    const cancelIdle = whenIdle(() => {
      import("./tower3d")
        // Evaluating the chunk is one long task; let the browser breathe before building the scene.
        .then(async (module) => {
          await new Promise((resolve) => setTimeout(resolve, 0));
          return module;
        })
        .then(async ({ mountTower }) => {
          if (abort.signal.aborted) return;
          const handle = await mountTower({
            host: stage,
            interactionRoot: hero,
            label: labelRef.current,
            onHover: (gap) => setHover((prev) => (gap === null ? { gap: prev.gap, on: false } : { gap, on: true })),
            onReady: () => setLive(true),
            onLost: () => setLive(false),
            signal: abort.signal,
          });
          dispose = handle.dispose;
          if (abort.signal.aborted) handle.dispose();
        })
        .catch(() => {
          // WebGL unavailable or the chunk failed to load: the illustration simply stays.
        });
    });

    return () => {
      abort.abort();
      cancelIdle();
      dispose?.();
      setLive(false);
      setHover((prev) => ({ gap: prev.gap, on: false }));
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="hero-tower" data-live={live} aria-hidden="true">
      <div ref={stageRef} className="hero-tower__stage" style={{ aspectRatio: STAGE_ASPECT, "--tower-bleed": `${STAGE_BLEED * 100}%` } as React.CSSProperties}>
        <TowerIllustration className="hero-tower__svg" />
        <div ref={labelRef} className="hero-tower__label" data-on={hover.on}>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-[12px] leading-none tracking-[0.12em] text-accent uppercase">
            {t.skills.groups[GROUP_BY_GAP[hover.gap]]}
          </span>
          <span className="hero-tower__tick" />
        </div>
      </div>
    </div>
  );
}
