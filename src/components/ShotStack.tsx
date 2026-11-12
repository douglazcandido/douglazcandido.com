import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import { useI18n } from "../i18n/context";

const EASE = "ease-[cubic-bezier(0.19,1,0.22,1)]";

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

/**
 * A small fan of overlapping thumbnails that sits in the project's own card. It spreads a
 * little on hover; clicking a thumbnail opens the full-size viewer at that screenshot.
 */
export default function ShotStack({ images, alts }: { images: readonly string[]; alts: readonly string[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const n = images.length;

  return (
    <>
      <div className="group/stack flex w-[354px] max-w-full items-center justify-end py-1 max-sm:justify-start">
        {images.map((src, k) => (
          <button
            key={src}
            type="button"
            aria-label={`${t.a11y.openImage}: ${alts[k]}`}
            onClick={() => setOpen(k)}
            style={{ zIndex: n - k }}
            className={`relative block h-[55px] w-[88px] shrink-0 cursor-zoom-in overflow-hidden rounded-lg border border-divider bg-bg shadow-[0_6px_16px_-8px_rgba(0,0,0,0.9)] transition-[margin,translate,border-color] duration-500 ${EASE} hover:-translate-y-1 hover:border-accent ${
              k > 0 ? "-ml-[66px] group-hover/stack:-ml-[50px]" : ""
            }`}
          >
            <img src={src} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover object-top" />
          </button>
        ))}
      </div>

      {open !== null && <Lightbox images={images} alts={alts} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
