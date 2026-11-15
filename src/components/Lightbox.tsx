import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import { FULL_SIZES, type Shot } from "../data/projectMedia";
import { useI18n } from "../i18n/context";

/** Full-screen viewer: arrows / keys to move, Esc or a click outside to close. */
export default function Lightbox({
  images,
  alts,
  index,
  onChange,
  onClose,
}: {
  images: readonly Shot[];
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
        src={images[index].full.src}
        srcSet={images[index].full.srcSet}
        sizes={FULL_SIZES}
        width={images[index].full.width}
        height={images[index].full.height}
        decoding="async"
        alt={alts[index]}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-auto max-h-[86vh] max-w-[94vw] animate-[lightbox-in_0.5s_cubic-bezier(0.19,1,0.22,1)] rounded-xl border border-white/10 object-contain shadow-2xl"
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
