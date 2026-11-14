import type { SkillGroupId } from "../../data/skills";

/**
 * Shared description of the hero tower. Both the static SVG illustration and the
 * Three.js scene are generated from these numbers, so they share one silhouette.
 * Units are arbitrary "tower units"; the tower is centered on the origin.
 */

export const DISC_COUNT = 7;
export const GAP_COUNT = DISC_COUNT - 1;

/**
 * Stack group shown for each opening, from the lowest to the highest. The label text
 * comes from the same i18n keys as the titles in the Stack section (`skills.groups`).
 */
export const GROUP_BY_GAP: readonly SkillGroupId[] = ["cloud", "storage", "data", "web", "automation", "languages"];

/** Outer radius of the lowest and of the highest disc (the tower is wider at the top). */
export const RADIUS_BOTTOM = 0.5;
export const RADIUS_TOP = 0.64;
/** Radius of the central hole of each disc, and of the column that runs through them. */
export const HOLE_RADIUS = 0.17;
export const COLUMN_RADIUS = 0.085;
export const COLUMN_SIDES = 6;

export const DISC_HEIGHT = 0.09;
export const GAP_HEIGHT = 0.22;
/** How far the column sticks out above the top disc and below the bottom one. */
export const COLUMN_OVERHANG = 0.1;

/** Segmented outer rim: number of teeth and how deep they cut into the rim. */
export const TEETH = 20;
export const TOOTH_DEPTH = 0.06;

/** Each opening grows to this many times its resting height while hovered. */
export const OPEN_FACTOR = 2.6;

/** Camera: elevation above the horizon (degrees), distance, and visible world height. */
export const CAMERA_ELEVATION_DEG = 16;
export const CAMERA_DISTANCE = 9;
export const FRAME_HEIGHT = 3.1;

/** Width / height of the stage (the box that holds the canvas, or the SVG). */
export const STAGE_ASPECT = 0.54;

/**
 * The stage is a bit wider than the tower; shifting it right by this fraction of its own width puts
 * the tower's right edge on the page's right margin, in line with the rest of the content.
 */
export const STAGE_BLEED = (1 - (2 * RADIUS_TOP) / (FRAME_HEIGHT * STAGE_ASPECT)) / 2;

export const PITCH = DISC_HEIGHT + GAP_HEIGHT;
export const TOWER_HEIGHT = DISC_COUNT * DISC_HEIGHT + GAP_COUNT * GAP_HEIGHT + 2 * COLUMN_OVERHANG;

/** Vertical center of disc `i` (0 = lowest) at rest. */
export function discCenterY(i: number): number {
  return -TOWER_HEIGHT / 2 + COLUMN_OVERHANG + DISC_HEIGHT / 2 + i * PITCH;
}

/** Outer radius of disc `i` (0 = lowest). */
export function discRadius(i: number): number {
  return RADIUS_BOTTOM + (RADIUS_TOP - RADIUS_BOTTOM) * (i / (DISC_COUNT - 1));
}

/** Vertical center of opening `k` (0 = lowest) at rest. */
export function gapCenterY(k: number): number {
  return (discCenterY(k) + discCenterY(k + 1)) / 2;
}

/** Mean radius of the tower around opening `k`. */
export function gapRadius(k: number): number {
  return (discRadius(k) + discRadius(k + 1)) / 2;
}

/** Outline of a disc's segmented rim as (angle, radius) pairs: 4 points per tooth. */
export function rimProfile(radius: number): Array<[number, number]> {
  const span = (Math.PI * 2) / TEETH;
  const root = radius - TOOTH_DEPTH;
  const out: Array<[number, number]> = [];
  for (let j = 0; j < TEETH; j++) {
    const a0 = j * span;
    out.push([a0 + 0.14 * span, root], [a0 + 0.3 * span, radius], [a0 + 0.7 * span, radius], [a0 + 0.86 * span, root]);
  }
  return out;
}
