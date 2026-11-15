import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
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
 */
export default function CareerTabs() {
  const { t } = useI18n();
  const c = t.career;
  const uid = useId();
  const [tab, setTab] = useState<TabId>("professional");
  const tablistRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const userPicked = useRef(false);

  const tabs: { id: TabId; label: string }[] = [
    { id: "professional", label: c.professionalLabel },
    { id: "academic", label: c.academicLabel },
    ...(certifications.length > 0 ? [{ id: "courses" as const, label: c.coursesLabel }] : []),
  ];

  const tabId = (id: TabId) => `${uid}-tab-${id}`;
  const panelId = (id: TabId) => `${uid}-panel-${id}`;

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
    userPicked.current = true;
    setTab(id);
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

  return (
    <div>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label={c.tabsLabel}
        onKeyDown={onKeyDown}
        className="flex gap-1 rounded-full border border-divider bg-surface p-1"
      >
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
              className={`min-h-11 min-w-0 flex-1 cursor-pointer rounded-full px-2 text-[13px] leading-none font-medium tracking-[0.01em] transition-colors duration-300 ${
                active ? "bg-accent text-on-accent" : "text-neutral-400"
              }`}
            >
              {x.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId("professional")}
        aria-labelledby={tabId("professional")}
        tabIndex={0}
        hidden={tab !== "professional"}
        className="mt-6"
      >
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

      <div
        role="tabpanel"
        id={panelId("academic")}
        aria-labelledby={tabId("academic")}
        tabIndex={0}
        hidden={tab !== "academic"}
        className="mt-6"
      >
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
        <div
          role="tabpanel"
          id={panelId("courses")}
          aria-labelledby={tabId("courses")}
          tabIndex={0}
          hidden={tab !== "courses"}
          className="mt-4"
        >
          <CertificationRows />
        </div>
      )}
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
