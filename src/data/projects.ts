/** Radar scores (0-10), in the same order as `t.projects.axes`. */
export const radarValues = [10, 9, 8, 7, 5] as const;

/** Index (in `t.projects.items`) of the project that shows a before/after metric, and its numbers. */
export const metricProject = {
  index: 3,
  from: "112",
  to: "15",
  unit: "GB",
} as const;
