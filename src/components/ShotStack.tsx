import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import { prefersReducedMotion } from "../hooks/useReducedMotion";
import { useI18n } from "../i18n/context";

/** Full-screen viewer: arrows / keys to move, Esc or a click outside to close. */
function Lightbox({
  images,
  alts,
  index,
  onChange,
  onClose,
}: {
  images: readonly string[];
  alts: readonly string[];
  index: number;
  onChange: (next: number) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);
  const n = images.length;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onChange((index + 1) % n);
      else if (e.key === "ArrowLeft") onChange((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, onChange, onClose]);

  const round =
    "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors duration-300 hover:border-accent hover:text-accent";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alts[index]}
      data-lenis-prevent
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
    >
      <img
        key={index}
        src={images[index]}
        alt={alts[index]}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[86vh] max-w-[94vw] animate-[lightbox-in_0.5s_cubic-bezier(0.19,1,0.22,1)] rounded-xl border border-white/10 object-contain shadow-2xl"
      />

      <p className="pointer-events-none absolute bottom-4 left-1/2 m-0 -translate-x-1/2 text-[12px] tracking-[0.18em] text-white/60 tabular-nums">
        {index + 1} / {n}
      </p>

      <button ref={closeRef} type="button" aria-label={t.a11y.closeImage} onClick={onClose} className={`${round} absolute top-4 right-4`}>
        <FiX aria-hidden="true" className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label={t.a11y.prevImage}
        onClick={(e) => {
          e.stopPropagation();
          onChange((index - 1 + n) % n);
        }}
        className={`${round} absolute top-1/2 left-3 -translate-y-1/2 sm:left-6`}
      >
        <FiArrowLeft aria-hidden="true" className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label={t.a11y.nextImage}
        onClick={(e) => {
          e.stopPropagation();
          onChange((index + 1) % n);
        }}
        className={`${round} absolute top-1/2 right-3 -translate-y-1/2 sm:right-6`}
      >
        <FiArrowRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>,
    document.body,
  );
}

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
}: {
  images: readonly string[];
  alts: readonly string[];
  active: boolean;
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
      <div className="flex w-[354px] max-w-full items-center justify-end py-1 max-sm:justify-start">
        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{ width: `calc(88px + var(--step) * ${n - 1})`, height: 63 }}
          className="relative [--step:22px] transition-[width] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:[--step:38px]"
        >
          {images.map((src, k) => {
            const pos = place(k);
            return (
              <button
                key={src}
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
                  <img src={src} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover object-top" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {open !== null && <Lightbox images={images} alts={alts} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
