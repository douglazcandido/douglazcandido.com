import { useActiveSection } from "../hooks/useActiveSection";
import { useI18n } from "../i18n/context";

const stops = [
  { id: "inicio", key: "home" },
  { id: "sobre", key: "about" },
  { id: "projetos", key: "projects" },
  { id: "skills", key: "skills" },
  { id: "educacao", key: "education" },
  { id: "contato", key: "contact" },
] as const;

const ids: readonly string[] = stops.map((s) => s.id);

/**
 * Vertical "lineage" rail: one node per section, joined by a line that fills
 * with page scroll progress. Desktop-wide only so it never crowds the content.
 */
export default function ScrollRail() {
  const active = useActiveSection(ids);
  const { t } = useI18n();
  const activeIndex = Math.max(0, ids.indexOf(active));

  return (
    <aside
      aria-label={t.a11y.progress}
      className="pointer-events-none fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative flex h-[min(46vh,340px)] flex-col justify-between">
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-[3px] w-px bg-divider" />
        <span
          aria-hidden="true"
          data-scroll-progress="y"
          className="absolute top-0 bottom-0 left-[3px] w-px origin-top bg-accent"
          style={{ transform: "scaleY(0)" }}
        />
        {stops.map((stop, i) => (
          <a
            key={stop.id}
            href={`#${stop.id}`}
            aria-label={t.nav[stop.key]}
            className="group pointer-events-auto relative block h-2 w-2"
          >
            <span
              className={`absolute inset-0 border transition-all duration-500 ${
                i === activeIndex
                  ? "scale-150 border-accent bg-accent"
                  : i < activeIndex
                    ? "border-accent bg-bg"
                    : "border-neutral-700 bg-bg"
              }`}
            />
            <span className="absolute top-1/2 left-5 -translate-y-1/2 border border-divider bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap text-neutral-300 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {t.nav[stop.key]}
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}
