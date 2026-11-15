/** One size of a screenshot: what goes into an <img>. */
export interface ShotSource {
  /** The largest variant, for browsers that ignore srcset. */
  src: string;
  srcSet: string;
  /** Intrinsic size of the largest variant (the browser reserves the box from the ratio before it loads). */
  width: number;
  height: number;
}

/** A screenshot as the fan's thumbnail and as the full-screen viewer image. */
export interface Shot {
  thumb: ShotSource;
  full: ShotSource;
}

/** The fan's thumbnail is 88 CSS px wide (see ShotStack). */
export const THUMB_SIZES = "88px";
/**
 * Width the viewer image is shown at: its natural 1920px, but never wider than 94vw or taller than 86vh
 * (the 1920x1200 ratio makes 86vh worth 137.6vw), the limits Lightbox sets in CSS.
 */
export const FULL_SIZES = "min(1920px, 94vw, 137.6vh)";

/** Files made by scripts/optimize-sentinel.mjs: <name>-<width>.webp. Vite hashes them and gives their URLs. */
const files = import.meta.glob("../assets/projects/sentinel/*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

const RATIO = 1200 / 1920;

function source(name: string, widths: readonly number[]): ShotSource {
  const largest = Math.max(...widths);
  const url = (w: number) => files[`../assets/projects/sentinel/${name}-${w}.webp`];
  return {
    src: url(largest),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(", "),
    width: largest,
    height: Math.round(largest * RATIO),
  };
}

function shots(names: readonly string[]): readonly Shot[] {
  return names.map((name) => ({ thumb: source(name, [176, 264]), full: source(name, [960, 1920]) }));
}

/**
 * Screenshots per project, keyed by the `media` field of a project in the i18n files.
 * Order matters: the alt texts (`shotAlts`) follow the same order.
 */
export const projectMedia: Record<string, readonly Shot[]> = {
  sentinel: shots(["01-login", "02-dashboard", "03-historico", "04-previsao", "05-risco-ola", "06-padroes", "07-recomendacoes", "08-exportacao"]),
};
