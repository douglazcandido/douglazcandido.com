import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { THUMB_SIZES, type Shot } from "../data/projectMedia";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import { afterFirstPaint } from "../lib/idle";
import { useI18n } from "../i18n/context";

// The full-screen viewer is its own chunk, fetched in idle time once a fan is on the page (and at the latest on
// the first hover or focus of a thumbnail), so opening it never waits for the network.
const loadLightbox = () => import("./Lightbox");
const Lightbox = lazy(loadLightbox);

const SHUFFLE_EVERY_MS = 4200;
/** One rotation is a single continuous gesture of this length (see `thumb-wrap` in index.css). */
const ROTATE_MS = 1300;

/**
 * A small fan of overlapping thumbnails that sits in the project's own card. Every few
 * seconds it rotates one place as a single smooth motion: every thumbnail glides forward
 * while the front one slides to the back, dissolving on the way and fading in again as it
 * arrives. It stops while hovered (the fan spreads out a little then), while the viewer is
 * open, when the project is not the open one, or with reduced motion.
 * Clicking a thumbnail opens the viewer at that screenshot.
 */
export default function ShotStack({
  images,
  alts,
  active,
  className = "",
}: {
  images: readonly Shot[];
  alts: readonly string[];
  active: boolean;
  /** Extra classes for the fan's own box (the project detail hides it on phones). */
  className?: string;
}) {
  const { t } = useI18n();
  const n = images.length;
  const [open, setOpen] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [offset, setOffset] = useState(0); // how many times the fan has rotated
  const [wrapping, setWrapping] = useState<number | null>(null); // image index travelling to the back
  const [arriving, setArriving] = useState<number | null>(null); // image index taking the front
  const offsetRef = useRef(0);
  const wrapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => afterFirstPaint(() => void loadLightbox()), []);

  const running = active && !hovering && open === null && n > 1 && !prefersReducedMotion();

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      // The image at the front is the one whose index equals the number of rotations so far.
      setWrapping(((offsetRef.current % n) + n) % n);
      setArriving((((offsetRef.current + 1) % n) + n) % n);
      offsetRef.current += 1;
      setOffset(offsetRef.current);
      clearTimeout(wrapTimer.current);
      wrapTimer.current = setTimeout(() => {
        setWrapping(null);
        setArriving(null);
      }, ROTATE_MS + 60);
    }, SHUFFLE_EVERY_MS);
    return () => clearInterval(id);
  }, [running, n]);

  // A rotation that is already under way is left to finish even if hovering stops the next ones.
  useEffect(() => () => clearTimeout(wrapTimer.current), []);

  // Position in the fan: 0 is the front. Image k sits at (k - offset) mod n.
  const place = (k: number) => (((k - offset) % n) + n) % n;

  return (
    <>
      <div className={`flex min-w-0 flex-1 items-center justify-end py-1 max-sm:justify-start ${className}`}>
        <div
          onMouseEnter={() => {
            setHovering(true);
            void loadLightbox();
          }}
          onMouseLeave={() => setHovering(false)}
          style={{
            width: `calc(88px + var(--step) * ${n - 1})`,
            height: 63,
            // On hover the fan spreads to at most 38px per step, less when the card is narrow so it never reaches the button beside it.
            "--hover-step": `clamp(22px, calc((100cqw - 302px) / ${n - 1}), 38px)`,
          } as React.CSSProperties}
          className="relative [--step:22px] transition-[width] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:[--step:var(--hover-step)]"
        >
          {images.map(({ thumb }, k) => {
            const pos = place(k);
            return (
              <button
                key={thumb.src}
                type="button"
                aria-label={`${t.a11y.openImage}: ${alts[k]}`}
                onClick={() => setOpen(k)}
                style={{
                  // moved with transform (GPU, sub-pixel) rather than left/margin
                  translate: `calc(var(--step) * ${pos}) 0`,
                  zIndex: n - pos,
                  transition: `translate ${ROTATE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
                  animation: wrapping === k ? `thumb-wrap ${ROTATE_MS}ms ease-in-out` : undefined,
                }}
                className="group/thumb absolute top-1 left-0 block h-[55px] w-[88px] cursor-zoom-in"
              >
                {/* The thumbnail taking the front lights up with a yellow outline only while the fan moves. */}
                <span
                  style={{ animation: arriving === k ? `thumb-glow ${ROTATE_MS}ms ease-in-out` : undefined }}
                  className="block h-full w-full overflow-hidden rounded-lg border border-divider bg-bg shadow-[0_6px_16px_-8px_rgba(0,0,0,0.9)] transition-[translate,border-color] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/thumb:-translate-y-1 group-hover/thumb:border-accent"
                >
                  <img
                    src={thumb.src}
                    srcSet={thumb.srcSet}
                    sizes={THUMB_SIZES}
                    width={88}
                    height={55}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover object-top"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {open !== null && (
        <Suspense fallback={null}>
          <Lightbox images={images} alts={alts} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
        </Suspense>
      )}
    </>
  );
}
