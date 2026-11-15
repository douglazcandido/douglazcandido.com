import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useI18n } from "../../i18n/context";
import TowerIllustration from "./TowerIllustration";
import {
  COMPACT_EDGE_SLACK,
  COMPACT_MIN_WIDTH,
  COMPACT_NAME_GAP,
  COMPACT_STAGE_INSET,
  GROUP_BY_GAP,
  STAGE_ASPECT,
  STAGE_BLEED,
  compactStageWidth,
} from "./towerSpec";

/** From this width the tower sits in the hero's right margin; below it the compact version is used (when it fits). */
const WIDE_QUERY = "(min-width: 900px)";

/**
 * The compact (phone / tablet) tower always shows the static illustration, but only becomes 3D on a
 * device that can afford it: WebGL, no data saver, and (when the browser says) more than 2 GB of
 * memory and more than 3 cores. Reduced motion is checked by the caller.
 */
function canRunCompact3d(): boolean {
  if (!("WebGL2RenderingContext" in window)) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return false;
  if (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 3) return false;
  return true;
}

/** Slightly longer than the label's opacity transition in index.css (0.3s), so the fade-out is never cut short. */
const LABEL_FADE_MS = 400;

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
 * Free width (px) to the right of the name, below 900px: from the end of its longest line to the page margin.
 * Measured at runtime (font, language and screen change it), and only once the web font is in, so the first
 * answer is not made with a fallback font. `null` until then, and whenever the compact layout is not in use.
 */
function useNameRoom(nameRef: RefObject<HTMLElement | null>, active: boolean): { room: number; pad: number } | null {
  const [room, setRoom] = useState<{ room: number; pad: number } | null>(null);

  useLayoutEffect(() => {
    const name = nameRef.current;
    // The hero's content wrapper (its ref is not attached yet when this runs: it wraps this component).
    const wrap = name?.parentElement;
    if (!active || !wrap || !name) {
      setRoom(null);
      return;
    }
    let ready = !document.fonts;
    let cancelled = false;
    const measure = () => {
      if (!ready) return;
      // Rounded down: the column is never claimed wider than it is.
      const next = Math.floor(wrap.clientWidth - name.getBoundingClientRect().width);
      const pad = parseFloat(getComputedStyle(wrap.parentElement ?? wrap).paddingRight) || 0;
      setRoom((prev) => (prev && prev.room === next && prev.pad === pad ? prev : { room: next, pad }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    observer.observe(name);
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      ready = true;
      measure();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [nameRef, active]);

  return room;
}

/**
 * Decorative 3D tower in the hero: in the right margin from 900px up. Below that, in the free column to the
 * right of the name (a grid column of the hero, so it can never overlap the text), as long as that column is
 * wide enough; when it is not, nothing is rendered: no illustration, no 3D, and Three.js is never downloaded.
 * With reduced motion, or when WebGL (or the device) is not up to it, it stays a static illustration.
 *
 * `nameRef` is the name, the first column of the hero's content wrapper (a grid below 900px).
 */
export default function HeroTower({ nameRef }: { nameRef: RefObject<HTMLElement | null> }) {
  const wide = useMediaQuery(WIDE_QUERY);
  const free = useNameRoom(nameRef, !wide);
  if (wide) return <Tower key="wide" compact={false} />;
  if (free === null) return null;
  const { room, pad } = free;
  const width = compactStageWidth(room, pad);
  if (width < COMPACT_MIN_WIDTH) return null;
  return (
    <div
      className="hero-tower-cell"
      style={{ "--cell": `${room}px`, "--room": `${width}px`, "--inset": COMPACT_STAGE_INSET.toFixed(4), "--gap": `${COMPACT_NAME_GAP + COMPACT_EDGE_SLACK}px` } as React.CSSProperties}
    >
      <Tower key="compact" compact />
    </div>
  );
}

function Tower({ compact }: { compact: boolean }) {
  const { t } = useI18n();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const [live, setLive] = useState(false);
  // `gap` keeps the last hovered opening so the label text stays while it fades out.
  const [hover, setHover] = useState<{ gap: number; on: boolean }>({ gap: 0, on: false });
  // The label only holds text (and is only in the layout) while an opening is hovered, plus the
  // fade-out afterwards: `present` mounts the text, `shown` drives the opacity transition.
  const [present, setPresent] = useState(false);
  const [shown, setShown] = useState(false);

  const fadeTimer = useRef(0);
  const frame = useRef(0);

  /** Called by the tower on every hover change (`null` = no opening under the pointer). */
  const handleHover = useCallback((gap: number | null) => {
    setHover((prev) => (gap === null ? { gap: prev.gap, on: false } : { gap, on: true }));
    window.clearTimeout(fadeTimer.current);
    cancelAnimationFrame(frame.current);
    if (gap !== null) {
      setPresent(true);
      // Two frames: the label has to be laid out at opacity 0 first, or there is no fade-in.
      frame.current = requestAnimationFrame(() => {
        frame.current = requestAnimationFrame(() => setShown(true));
      });
    } else {
      setShown(false);
      fadeTimer.current = window.setTimeout(() => setPresent(false), LABEL_FADE_MS);
    }
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const hero = rootRef.current?.closest("header");
    if (!stage || !hero || reducedMotion || !("WebGL2RenderingContext" in window)) return;
    if (compact && !canRunCompact3d()) return;

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
            onHover: handleHover,
            onReady: () => setLive(true),
            onLost: () => setLive(false),
            signal: abort.signal,
            compact,
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
      handleHover(null);
    };
  }, [reducedMotion, handleHover, compact]);

  return (
    <div ref={rootRef} className={compact ? "hero-tower hero-tower--compact" : "hero-tower"} data-live={live} aria-hidden="true">
      <div
        ref={stageRef}
        className="hero-tower__stage"
        style={compact ? undefined : ({ aspectRatio: STAGE_ASPECT, "--tower-bleed": `${STAGE_BLEED * 100}%` } as React.CSSProperties)}
      >
        <TowerIllustration className="hero-tower__svg" compact={compact} />
        <div ref={labelRef} className="hero-tower__label" data-on={shown} hidden={!present} aria-hidden="true">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-[12px] leading-none tracking-[0.12em] text-accent uppercase">
            {present ? t.skills.groups[GROUP_BY_GAP[hover.gap]] : ""}
          </span>
          <span className="hero-tower__tick" />
        </div>
      </div>
    </div>
  );
}
