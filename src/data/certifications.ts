/**
 * Short courses and certifications, shown as a compact strip under the career timeline.
 * The strip is hidden while this array is empty. Real entries are proper names and are not translated.
 * Entries marked `example` are placeholders for the sketch: they render a translated
 * "course name / institution" and an "[example]" tag instead of `name` and `issuer`.
 */
export interface Certification {
  name: string;
  issuer: string;
  year: string;
  /** Optional verification link. */
  url?: string;
  example?: boolean;
}

export const certifications: readonly Certification[] = [
  { name: "", issuer: "", year: "2025", url: "https://example.com", example: true },
  { name: "", issuer: "", year: "2024", example: true },
  { name: "", issuer: "", year: "2023", example: true },
];
