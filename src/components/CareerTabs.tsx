import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { FiChevronDown } from "react-icons/fi";
import SpotlightCard from "./SpotlightCard";
import { CertificationRows } from "./CertificationStrip";
import { certifications } from "../data/certifications";
import { profile } from "../data/profile";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import { useI18n } from "../i18n/context";

type TabId = "professional" | "academic" | "courses";

/** Topics shown before "See more": the rest stay in the DOM, folded away. */
const PREVIEW = 2;

const EASE = "ease-[cubic-bezier(0.19,1,0.22,1)]";

/** Tab switch (phones): timings in ms and the one easing curve shared by the indicator, the height and the entrance. */
const SWAP_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const OUT_MS = 120; // the panel that leaves fades out
const IN_MS = 240; // the panel that arrives fades in and rises
const SLIDE_PX = 8;
const STEP_MS = 40; // delay between one card and the next on arrival...
const CASCADE_MAX = 4; // ...up to this many cards; the rest arrive with the last of them
const SIZE_MS = 260; // height of the panel area
const PILL_MS = 260; // the highlight sliding from one tab to the other

type Swap = {
  /** The tab that is being left, and what its panel looked like at the instant of the switch. */
  from: TabId;
  height: number;
  opacity: number;
  transform: string;
};
type Running = { anim: Animation; panel: TabId | null; kind: "size" | "panel" | "card" };

/** Small tween of the window scroll: native `behavior: "smooth"` is switched off while Lenis runs. */
function scrollWindowTo(top: number) {
  const from = window.scrollY;
  if (prefersReducedMotion() || Math.abs(top - from) < 2) {
    window.scrollTo(0, top);
    return;
  }
  const start = performance.now();
  const duration = 420;
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    window.scrollTo(0, from + (top - from) * eased);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Career on phones: three tabs (professional, academic, courses) with one panel at a time, instead
 * of the long two-column timeline. ARIA tabs pattern: arrows, Home and End move between tabs.
 *
 * Switching is animated with opacity and transform only (plus the height of the panel area): the highlight slides to
 * the new tab, the old panel fades out, the new one fades in and rises while its cards arrive one after another, and
 * the area grows or shrinks to the new panel's height. Every panel stays in the DOM; the one that leaves is hidden
 * when the switch ends. With prefers-reduced-motion the switch is instant.
 */
export default function CareerTabs() {
  const { t } = useI18n();
  const c = t.career;
  const uid = useId();
  const [tab, setTab] = useState<TabId>("professional");
  /** The tab whose panel is still on screen, fading out, while the new one arrives. Null when nothing is moving. */
  const [leaving, setLeaving] = useState<TabId | null>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const userPicked = useRef(false);
  const pending = useRef<Swap | null>(null);
  const running = useRef<Running[]>([]);
  const swapToken = useRef(0);
  const pillPlaced = useRef(false);
  const tabNow = useRef(tab);

  const tabs: { id: TabId; label: string }[] = [
    { id: "professional", label: c.professionalLabel },
    { id: "academic", label: c.academicLabel },
    ...(certifications.length > 0 ? [{ id: "courses" as const, label: c.coursesLabel }] : []),
  ];

  const tabId = (id: TabId) => `${uid}-tab-${id}`;
  const panelId = (id: TabId) => `${uid}-panel-${id}`;

  /** Slides the highlight under the active tab (animated only for a tab change, not for the first paint or a resize). */
  const placePill = useCallback((animate: boolean) => {
    const list = tablistRef.current;
    const pill = pillRef.current;
    const btn = tabRefs.current[tabNow.current];
    if (!list || !pill || !btn) return;
    const lr = list.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    pill.style.transition =
      animate && pillPlaced.current && !prefersReducedMotion()
        ? `transform ${PILL_MS}ms ${SWAP_EASE}, width ${PILL_MS}ms ${SWAP_EASE}`
        : "none";
    pill.style.width = `${br.width}px`;
    pill.style.height = `${br.height}px`;
    pill.style.transform = `translate(${br.left - lr.left - list.clientLeft}px, ${br.top - lr.top - list.clientTop}px)`;
    pillPlaced.current = true;
  }, []);

  useLayoutEffect(() => {
    tabNow.current = tab;
    placePill(true);
  }, [tab, tabs.length, placePill]);

  useEffect(() => {
    const list = tablistRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => placePill(false));
    ro.observe(list);
    return () => ro.disconnect();
  }, [placePill]);

  const stopAnims = (match: (r: Running) => boolean) => {
    running.current = running.current.filter((r) => {
      if (!match(r)) return true;
      r.anim.cancel();
      return false;
    });
  };

  // The switch itself (phones, motion allowed). At this point the new panel is already in the DOM next to the old
  // one; both are taken out of the flow, so the panel area's height is driven here, from the old height to the new.
  useLayoutEffect(() => {
    const swap = pending.current;
    if (!swap) return;
    pending.current = null;
    const stage = stageRef.current;
    const to = panelRefs.current[tab];
    const from = panelRefs.current[swap.from];
    if (!stage || !to || !from) {
      setLeaving(null);
      return;
    }

    // A quick second tap: whatever the previous switch left running is dropped, except the cards of the panel that
    // is now leaving (they keep their own fade, so it fades out from where it was instead of jumping).
    stopAnims((r) => !(r.panel === swap.from && r.kind === "card"));
    document.documentElement.style.overflowAnchor = "none"; // the page must not scroll to compensate for the height change

    const style = getComputedStyle(to);
    const toHeight = to.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);

    const started: Running[] = [];
    const add = (el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions, panel: TabId | null, kind: Running["kind"]) => {
      const anim = el.animate(keyframes, { fill: "both", ...options });
      started.push({ anim, panel, kind });
    };
    add(stage, [{ height: `${swap.height}px` }, { height: `${toHeight}px` }], { duration: SIZE_MS, easing: SWAP_EASE }, null, "size");
    add(
      from,
      [
        { opacity: swap.opacity, transform: swap.transform },
        { opacity: 0, transform: swap.transform },
      ],
      { duration: OUT_MS, easing: "ease-out" },
      swap.from,
      "panel",
    );
    add(
      to,
      [
        { opacity: 0, transform: `translateY(${SLIDE_PX}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: IN_MS, delay: OUT_MS, easing: SWAP_EASE },
      tab,
      "panel",
    );
    to.querySelectorAll(":scope > ol > li, :scope > ul > li").forEach((card, i) => {
      add(
        card,
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: IN_MS, delay: OUT_MS + Math.min(i, CASCADE_MAX - 1) * STEP_MS, easing: SWAP_EASE },
        tab,
        "card",
      );
    });
    running.current.push(...started);

    const token = ++swapToken.current;
    Promise.all(started.map((r) => r.anim.finished)).then(
      () => {
        if (token === swapToken.current) setLeaving(null);
      },
      () => {
        // cancelled by the next switch, which takes over
      },
    );
  }, [tab]);

  // Back to rest: every animation removed (the panels return to the normal flow in the same commit).
  useLayoutEffect(() => {
    if (leaving !== null) return;
    stopAnims(() => true);
    document.documentElement.style.overflowAnchor = "";
  }, [leaving]);

  useEffect(
    () => () => {
      stopAnims(() => true);
      document.documentElement.style.overflowAnchor = "";
    },
    [],
  );

  // After a tab change by the user, bring the tab bar back below the fixed header if it scrolled off the top.
  useEffect(() => {
    if (!userPicked.current) return;
    const bar = tablistRef.current;
    if (!bar) return;
    const headerH = document.getElementById("site-header")?.offsetHeight ?? 60;
    const top = bar.getBoundingClientRect().top;
    if (top < headerH) scrollWindowTo(window.scrollY + top - headerH - 12);
  }, [tab]);

  const select = (id: TabId, focus = false) => {
    if (id !== tab) {
      userPicked.current = true;
      const from = panelRefs.current[tab];
      const stage = stageRef.current;
      if (from && stage && !prefersReducedMotion()) {
        const style = getComputedStyle(from);
        pending.current = { from: tab, height: stage.getBoundingClientRect().height, opacity: parseFloat(style.opacity), transform: style.transform };
        setLeaving(tab);
      } else {
        setLeaving(null); // reduced motion: an instant switch
      }
      setTab(id);
    }
    if (focus) tabRefs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((x) => x.id === tab);
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    select(tabs[next].id, true);
  };

  // Newest first, like the rest of the site's lists. The timeline dictionary is oldest first.
  const roles = [...c.items].reverse();
  const courses = [...c.academic].reverse();

  /** Props shared by the three panels: only the active one is read (the one leaving is inert and hidden from screen readers). */
  const panelProps = (id: TabId, margin: string) => {
    const leavingNow = leaving === id;
    return {
      ref: (el: HTMLDivElement | null) => {
        panelRefs.current[id] = el;
      },
      role: "tabpanel",
      id: panelId(id),
      "aria-labelledby": tabId(id),
      "aria-hidden": leavingNow || undefined,
      inert: leavingNow,
      tabIndex: leavingNow ? -1 : 0,
      hidden: tab !== id && !leavingNow,
      className: `${margin} ${leaving !== null ? "absolute inset-x-0 top-0" : ""}`,
    };
  };

  return (
    <div>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label={c.tabsLabel}
        onKeyDown={onKeyDown}
        className="relative flex gap-1 rounded-full border border-divider bg-surface p-1"
      >
        {/* The highlight: one pill that slides under the active tab (placed and sized in placePill). */}
        <span ref={pillRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 rounded-full bg-accent" />
        {tabs.map((x) => {
          const active = tab === x.id;
          return (
            <button
              key={x.id}
              ref={(el) => {
                tabRefs.current[x.id] = el;
              }}
              type="button"
              role="tab"
              id={tabId(x.id)}
              aria-selected={active}
              aria-controls={panelId(x.id)}
              tabIndex={active ? 0 : -1}
              onClick={() => select(x.id)}
              className={`relative min-h-11 min-w-0 flex-1 cursor-pointer rounded-full px-2 text-[13px] leading-none font-medium tracking-[0.01em] transition-colors duration-300 motion-reduce:transition-none ${
                active ? "text-on-accent" : "text-neutral-400"
              }`}
            >
              {x.label}
            </button>
          );
        })}
      </div>

      {/* The panels' area: while a switch runs, its height is animated from the old panel's to the new one's. */}
      <div ref={stageRef} className={`relative flow-root ${leaving !== null ? "[overflow-anchor:none]" : ""}`}>
        <div {...panelProps("professional", "mt-6")}>
          <CardAxis>
            {roles.map((role, i) => (
              <CareerCard
                key={role.title}
                period={role.period}
                title={role.title}
                sub={profile.company}
                items={role.items}
                current={i === 0}
                last={i === roles.length - 1}
              />
            ))}
          </CardAxis>
        </div>

        <div {...panelProps("academic", "mt-6")}>
          <CardAxis>
            {courses.map((course, i) => (
              <CareerCard
                key={course.title}
                period={course.period}
                title={course.title}
                sub={course.school}
                note={course.note}
                items={course.items}
                last={i === courses.length - 1}
              />
            ))}
          </CardAxis>
        </div>

        {certifications.length > 0 && (
          <div {...panelProps("courses", "mt-4")}>
            <CertificationRows />
          </div>
        )}
      </div>
    </div>
  );
}

/** Vertical axis down the left side; each card hangs a node on it. No year ruler on phones. */
function CardAxis({ children }: { children: React.ReactNode }) {
  return <ol className="m-0 flex list-none flex-col gap-3 p-0 pl-[26px]">{children}</ol>;
}

function CareerCard({
  period,
  title,
  sub,
  note,
  items,
  current = false,
  last,
}: {
  period: string;
  title: string;
  sub: string;
  note?: string;
  items: readonly string[];
  current?: boolean;
  last: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const foldable = items.length > PREVIEW;

  return (
    <li className="relative">
      {!last && <span aria-hidden="true" className="absolute top-[26px] -bottom-[34px] -left-[22px] w-px bg-accent/40" />}
      <span aria-hidden="true" className="absolute top-[22px] -left-[26px]">
        <span className={`block h-[9px] w-[9px] rounded-full border border-accent ${current ? "bg-accent" : "bg-bg"}`} />
        {current && <span className="pipe-pulse absolute inset-0 rounded-full border border-accent" />}
      </span>

      <SpotlightCard className="flex flex-col p-4">
        <p className={`m-0 text-[12px] tracking-[0.12em] uppercase ${current ? "text-accent" : "text-neutral-500"}`}>{period}</p>
        <h3 className="m-0 mt-2 font-display text-[18px] leading-[1.15] font-semibold tracking-[-0.02em] text-pretty">{title}</h3>
        <p className="m-0 mt-1 text-[14px] leading-[1.4] text-neutral-500">{sub}</p>
        {note && <p className="m-0 mt-1 text-[12px] leading-[1.4] text-neutral-500">{note}</p>}

        {items.length > 0 && (
          <ul id={listId} className="m-0 mt-3.5 flex list-none flex-col p-0">
            {items.map((item, i) =>
              i < PREVIEW ? (
                <li key={item} className={`relative pl-4 text-[14px] leading-[1.5] text-neutral-400 ${i > 0 ? "mt-2" : ""}`}>
                  <span aria-hidden="true" className="absolute top-[0.62em] left-0 h-1 w-1 rounded-full bg-accent" />
                  {item}
                </li>
              ) : (
                <li
                  key={item}
                  inert={!open}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ${EASE} ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="relative pt-2 pl-4 text-[14px] leading-[1.5] text-neutral-400">
                      <span aria-hidden="true" className="absolute top-[calc(0.5rem+0.62em)] left-0 h-1 w-1 rounded-full bg-accent" />
                      {item}
                    </div>
                  </div>
                </li>
              ),
            )}
          </ul>
        )}

        {foldable && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((v) => !v)}
            className="mt-1 inline-flex min-h-11 min-w-11 w-fit cursor-pointer items-center gap-1.5 text-[13px] font-medium tracking-[0.04em] text-accent"
          >
            {open ? t.career.seeLess : t.career.seeMore}
            <FiChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform duration-500 ${EASE} ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </SpotlightCard>
    </li>
  );
}
