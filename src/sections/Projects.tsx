import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Section from "../components/Section";
import Reveal from "../components/Reveal";
import SpotlightCard from "../components/SpotlightCard";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import { metricProject } from "../data/projects";
import { useI18n } from "../i18n/context";

interface Project {
  title: string;
  description: string;
  tags: readonly string[];
}

/** Cards fade and shrink a little as they leave the visible window (set from the scroll handler). */
function ProjectCard({ project, index, seen, onSelect }: { project: Project; index: number; seen: boolean; onSelect: (e: MouseEvent) => void }) {
  const { t } = useI18n();
  const metric = index === metricProject.index ? { ...metricProject, caption: t.projects.metricCaption } : undefined;

  return (
    <div
      data-card
      onClick={onSelect}
      className="w-[min(86vw,520px)] shrink-0 snap-start will-change-transform lg:w-[min(40vw,560px)]"
      style={{ opacity: 0.4 }}
    >
      <SpotlightCard className="flex h-full min-h-[clamp(380px,52vh,540px)] flex-col gap-8 p-[clamp(24px,2.6vw,40px)]">
        <div>
          <h3 className="m-0 font-display text-[clamp(22px,2vw,32px)] leading-[1.12] font-semibold tracking-[-0.02em] text-pretty">
            {project.title}
          </h3>
          <p className="m-0 mt-4 text-[15px] leading-[1.7] text-neutral-400">{project.description}</p>
        </div>

        {metric && (
          <div className={seen ? "bar-visible" : ""}>
            <p className="display m-0 flex items-baseline gap-3 text-[clamp(40px,4.4vw,64px)] leading-[0.9]">
              <span className="text-neutral-600 line-through decoration-accent decoration-[3px]">{metric.from}</span>
              <span className="text-[0.22em] font-normal text-accent">→</span>
              <span className="text-accent">{metric.to}</span>
              <span className="text-[0.2em] font-normal tracking-normal text-neutral-300 normal-case">{metric.unit}</span>
            </p>
            <p className="m-0 mt-3 text-[11px] tracking-[0.16em] text-neutral-500 uppercase">{metric.caption}</p>

            <div className="mt-5 flex flex-col gap-2.5">
              <div>
                <div className="mb-1 flex justify-between text-[10px] tracking-[0.16em] text-neutral-500 uppercase">
                  <span>{t.projects.before}</span>
                  <span>{metric.from} {metric.unit}</span>
                </div>
                <div className="h-2 bg-neutral-900">
                  <div className="bar-fill h-full bg-neutral-600" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[10px] tracking-[0.16em] text-accent uppercase">
                  <span>{t.projects.after}</span>
                  <span>{metric.to} {metric.unit}</span>
                </div>
                <div className="h-2 bg-neutral-900">
                  <div
                    className="bar-fill h-full bg-accent"
                    style={{ width: `${(Number(metric.to) / Number(metric.from)) * 100}%`, transitionDelay: "0.35s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <ul className="m-0 mt-auto flex list-none flex-wrap gap-2 p-0">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-divider px-2.5 py-1 text-[10.5px] tracking-[0.12em] text-neutral-400 uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
      </SpotlightCard>
    </div>
  );
}

const EDGE = 8;

/**
 * Projects as a horizontal strip of cards: native scroll with snapping, mouse drag,
 * arrow buttons and keys, click-a-card-to-focus, and a scrollbar-like progress track.
 * Everything is position-based, so the last cards (which cannot all reach the start) still work.
 */
export default function Projects() {
  const { t } = useI18n();
  const items = t.projects.items;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState<ReadonlySet<number>>(new Set());
  const [edges, setEdges] = useState({ start: true, end: false });
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });
  const samples = useRef<{ t: number; left: number }[]>([]);
  const anim = useRef(0);

  const cards = useCallback(
    () => Array.from(scrollerRef.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []),
    [],
  );
  const maxScroll = useCallback(() => {
    const s = scrollerRef.current;
    return s ? Math.max(0, s.scrollWidth - s.clientWidth) : 0;
  }, []);
  /** scrollLeft that puts card i on the content margin (limited to what can be scrolled). */
  const leftFor = useCallback(
    (i: number) => {
      const s = scrollerRef.current;
      const card = cards()[i];
      if (!s || !card) return 0;
      return Math.min(maxScroll(), Math.max(0, card.offsetLeft - parseFloat(getComputedStyle(s).paddingLeft)));
    },
    [cards, maxScroll],
  );

  const stopAnim = useCallback(() => {
    cancelAnimationFrame(anim.current);
    anim.current = 0;
    if (scrollerRef.current) scrollerRef.current.style.scrollSnapType = "";
  }, []);

  /**
   * Critically damped spring towards `target` (ease in and out, no overshoot), optionally
   * starting with the speed of a mouse fling. Native snapping is paused while it runs.
   */
  const animateTo = useCallback(
    (target: number, initialVelocity = 0) => {
      const s = scrollerRef.current;
      if (!s) return;
      cancelAnimationFrame(anim.current);
      if (prefersReducedMotion()) {
        s.scrollTo({ left: target });
        return;
      }
      s.style.scrollSnapType = "none";
      let cur = s.scrollLeft;
      let vel = initialVelocity;
      let last = performance.now();
      const omega = 2 / 0.3;
      const step = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const x = omega * dt;
        const k = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        const change = cur - target;
        const temp = (vel + omega * change) * dt;
        vel = (vel - omega * temp) * k;
        cur = target + (change + temp) * k;
        s.scrollLeft = cur;
        if (Math.abs(cur - target) < 0.4 && Math.abs(vel) < 8) {
          s.scrollLeft = target;
          s.style.scrollSnapType = "";
          anim.current = 0;
          return;
        }
        anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
    },
    [],
  );

  const scrollToX = useCallback((x: number) => animateTo(x), [animateTo]);

  /** The scroll position that card-start snapping would settle on, closest to x. */
  const nearestSnap = useCallback(
    (x: number) => {
      const xs = cards().map((_, i) => leftFor(i));
      return xs.reduce((best, c) => (Math.abs(c - x) < Math.abs(best - x) ? c : best), xs[0] ?? 0);
    },
    [cards, leftFor],
  );

  const goNext = useCallback(() => {
    const s = scrollerRef.current;
    if (!s) return;
    const sl = s.scrollLeft;
    const target = cards().map((_, i) => leftFor(i)).find((x) => x > sl + EDGE);
    scrollToX(target ?? maxScroll());
  }, [cards, leftFor, maxScroll, scrollToX]);

  const goPrev = useCallback(() => {
    const s = scrollerRef.current;
    if (!s) return;
    const sl = s.scrollLeft;
    const before = cards().map((_, i) => leftFor(i)).filter((x) => x < sl - EDGE);
    scrollToX(before.length ? before[before.length - 1] : 0);
  }, [cards, leftFor, scrollToX]);

  // Scroll-linked visuals: each card eases in/out with how much of it is in the window,
  // and the thumb mirrors the scroll position. Done imperatively to stay smooth.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = scroller.getBoundingClientRect();
      const winLeft = rect.left + parseFloat(getComputedStyle(scroller).paddingLeft);
      const winRight = rect.right;
      for (const card of cards()) {
        const r = card.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(r.right, winRight) - Math.max(r.left, winLeft));
        const v = Math.min(1, overlap / Math.max(1, r.width));
        const e = 1 - (1 - v) * (1 - v);
        card.style.opacity = (0.35 + 0.65 * e).toFixed(3);
        card.style.transform = `scale(${(0.96 + 0.04 * e).toFixed(4)})`;
      }

      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const thumb = thumbRef.current;
      if (thumb) {
        const pct = Math.min(100, (scroller.clientWidth / Math.max(1, scroller.scrollWidth)) * 100);
        const ratio = max > 0 ? scroller.scrollLeft / max : 0;
        thumb.style.width = `${pct.toFixed(2)}%`;
        thumb.style.left = `${(ratio * (100 - pct)).toFixed(2)}%`;
      }

      const start = scroller.scrollLeft <= EDGE;
      const end = scroller.scrollLeft >= max - EDGE;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cards, items.length]);

  // Any direct input (wheel, touch) takes over from a running animation.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.addEventListener("wheel", stopAnim, { passive: true });
    scroller.addEventListener("touchstart", stopAnim, { passive: true });
    return () => {
      scroller.removeEventListener("wheel", stopAnim);
      scroller.removeEventListener("touchstart", stopAnim);
      stopAnim();
    };
  }, [stopAnim]);

  // A card counts as "seen" once mostly on screen (starts its before/after bars).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const els = cards();
    const io = new IntersectionObserver(
      (entries) => {
        setSeen((prev) => {
          const next = new Set(prev);
          for (const e of entries) if (e.isIntersecting) next.add(els.indexOf(e.target as HTMLElement));
          return next.size === prev.size ? prev : next;
        });
      },
      { root: scroller, threshold: 0.6 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [cards, items.length]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") goNext();
    else if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "Home") scrollToX(0);
    else if (e.key === "End") scrollToX(maxScroll());
    else return;
    e.preventDefault();
  };

  // Mouse drag (touch and trackpads already scroll natively).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    stopAnim();
    drag.current = { active: true, moved: false, startX: e.clientX, startLeft: e.currentTarget.scrollLeft };
    samples.current = [{ t: performance.now(), left: e.currentTarget.scrollLeft }];
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) {
      e.currentTarget.scrollLeft = d.startLeft - dx;
      const now = performance.now();
      samples.current.push({ t: now, left: e.currentTarget.scrollLeft });
      samples.current = samples.current.filter((p) => now - p.t < 120);
    }
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.moved) {
      setDragging(false);
      // Fling: carry the release speed into the spring and settle on the card it points at.
      const s = scrollerRef.current;
      const pts = samples.current;
      let velocity = 0;
      if (s && pts.length > 1) {
        const first = pts[0];
        const lastPt = pts[pts.length - 1];
        const dt = (lastPt.t - first.t) / 1000;
        if (dt > 0.01 && performance.now() - lastPt.t < 80) velocity = (lastPt.left - first.left) / dt;
      }
      velocity = Math.max(-4000, Math.min(4000, velocity));
      if (s) animateTo(nearestSnap(s.scrollLeft + velocity * 0.22), velocity);
    }
  };

  /** Clicking a card (not after a drag) brings it to the start of the strip. */
  const selectCard = (i: number) => (e: MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      return;
    }
    scrollToX(leftFor(i));
  };

  /** Click on the track jumps to that point. */
  const onTrackClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    scrollToX(nearestSnap(((e.clientX - rect.left) / rect.width) * maxScroll()));
  };

  const arrowClass =
    "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-divider text-neutral-300 transition-colors duration-300 hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-30 disabled:hover:border-divider disabled:hover:text-neutral-300";

  return (
    <Section id="projetos" title={t.projects.title}>
      <Reveal as="p" className="m-0 mb-[clamp(28px,4vw,56px)] max-w-[60ch] text-[clamp(17px,1.5vw,22px)] leading-[1.55] text-neutral-400">
        {t.projects.intro}
      </Reveal>

      {/* Full-bleed strip: starts on the content margin, runs off the right edge. */}
      <div className="ml-[calc(50%-50vw)] w-screen">
        <div
          ref={scrollerRef}
          role="region"
          aria-label={t.a11y.projectsRegion}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          className={`no-scrollbar relative flex items-stretch gap-[clamp(14px,1.6vw,24px)] overflow-x-auto overscroll-x-contain pr-[var(--page-pad)] pl-[var(--page-pad)] py-3 [scroll-padding-inline:var(--page-pad)] [clip-path:inset(0_0_0_var(--page-pad))] ${
            dragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"
          }`}
        >
          {items.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} seen={seen.has(i)} onSelect={selectCard(i)} />
          ))}
        </div>
      </div>

      <div className="mt-[clamp(14px,2vw,26px)] flex items-center justify-between gap-6">
        {/* Scrollbar-like track: the thumb is the share of the strip currently on screen. */}
        <div
          aria-hidden="true"
          onClick={onTrackClick}
          className="group relative flex h-6 flex-1 cursor-pointer items-center sm:max-w-[360px]"
        >
          <div className="relative h-[3px] w-full bg-neutral-800 transition-colors group-hover:bg-neutral-700">
            <span ref={thumbRef} className="absolute inset-y-0 bg-accent" style={{ width: "40%", left: "0%" }} />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" aria-label={t.a11y.previous} disabled={edges.start} onClick={goPrev} className={arrowClass}>
            <FiArrowLeft aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
          <button type="button" aria-label={t.a11y.next} disabled={edges.end} onClick={goNext} className={arrowClass}>
            <FiArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </Section>
  );
}
