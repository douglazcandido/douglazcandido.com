/**
 * Career timeline: one entry per card, in the order they start.
 * The texts live in the dictionaries (`career.items` for the professional track, oldest first,
 * and `career.academic` for the academic one, oldest first); `index` points into them.
 * Cards are aligned to the year line they start in. The month stays in the period text.
 */
export type Track = "professional" | "academic";

export interface TimelineEntry {
  track: Track;
  /** Position inside that track's list in the dictionary. */
  index: number;
  /** Year line the card is aligned to. */
  startYear: number;
  /** The role the person holds today. */
  current?: boolean;
}

export const FIRST_YEAR = 2020;
export const LAST_YEAR = 2026;

export const timeline: readonly TimelineEntry[] = [
  { track: "academic", index: 0, startYear: 2020 },
  { track: "academic", index: 1, startYear: 2022 },
  { track: "professional", index: 0, startYear: 2022 },
  { track: "professional", index: 1, startYear: 2024 },
  { track: "academic", index: 2, startYear: 2025 },
  { track: "professional", index: 2, startYear: 2026, current: true },
];

export const years = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);
