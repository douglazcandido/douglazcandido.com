import {
  SECTION_HEIGHT_COARSE_STEP,
  SECTION_HEIGHT_DATA,
  SECTION_HEIGHT_FINE_MAX,
  SECTION_HEIGHT_FINE_STEP,
  SECTION_HEIGHT_MIN_WIDTH,
} from "./sectionHeights.generated";

const decoded = new Map<string, number[]>();

/** Reads one table row ("first,delta,delta*run,...", see scripts/measure-sections.mjs) back into heights. */
function decode(row: string): number[] {
  const list: number[] = [];
  let value = 0;
  for (const part of row.split(",")) {
    const [delta, run = "1"] = part.split("*");
    for (let i = 0; i < +run; i++) list.push((value += +delta));
  }
  return list;
}

/**
 * Height (px) of a lazy section's content in a language at a layout width, from the table measured on the real
 * page (scripts/measure-sections.mjs). Between two measured widths it interpolates; outside the table it holds the
 * nearest value. 0 when the section is not in the table (the placeholder then just has no reserved height).
 */
export function sectionHeight(key: string, lang: string, width: number): number {
  const id = `${key}.${lang}`;
  let list = decoded.get(id);
  if (!list) {
    const row = SECTION_HEIGHT_DATA[id];
    if (!row) return 0;
    list = decode(row);
    decoded.set(id, list);
  }
  // Position in the list: every pixel up to FINE_MAX, then every COARSE_STEP pixels.
  const fineCount = (SECTION_HEIGHT_FINE_MAX - SECTION_HEIGHT_MIN_WIDTH) / SECTION_HEIGHT_FINE_STEP;
  const raw =
    width <= SECTION_HEIGHT_FINE_MAX
      ? (width - SECTION_HEIGHT_MIN_WIDTH) / SECTION_HEIGHT_FINE_STEP
      : fineCount + (width - SECTION_HEIGHT_FINE_MAX) / SECTION_HEIGHT_COARSE_STEP;
  const at = Math.min(list.length - 1, Math.max(0, raw));
  const lo = Math.floor(at);
  const hi = Math.min(list.length - 1, lo + 1);
  return Math.round(list[lo] + (list[hi] - list[lo]) * (at - lo));
}
