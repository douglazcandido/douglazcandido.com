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
export const RADIUS_BOTTOM = 0.46;
export const RADIUS_TOP = 0.86;
/** Radius of the central hole of each disc, and of the column that runs through them. */
export const HOLE_RADIUS = 0.2;
export const COLUMN_RADIUS = 0.09;
export const COLUMN_SIDES = 6;

export const DISC_HEIGHT = 0.09;
export const GAP_HEIGHT = 0.22;
/** How far the column sticks out above the top disc and below the bottom one. */
export const COLUMN_OVERHANG = 0.1;

/** Segmented outer rim: number of teeth and how deep they cut into the rim. */
export const TEETH = 24;
export const TOOTH_DEPTH = 0.06;

/** Each opening grows to this many times its resting height while hovered. */
export const OPEN_FACTOR = 2.6;

/** Camera: elevation above the horizon (degrees), distance, and visible world height. */
export const CAMERA_ELEVATION_DEG = 16;
export const CAMERA_DISTANCE = 9;
export const FRAME_HEIGHT = 3.1;

/** Width / height of the stage (the box that holds the canvas, or the SVG). */
export const STAGE_ASPECT = 0.68;

/**
 * Compact stage (phones and tablets, below 900px): a box 1 : 1.27 and a tighter camera frame, so the
 * tower fills the box instead of floating in the room the desktop layout leaves for the opening labels.
 */
export const COMPACT_STAGE_ASPECT = 1 / 1.27;
// 2.43 units of it is the tower at rest; an open opening grows the tower by 0.35 (OPEN_FACTOR), which has to fit too.
export const COMPACT_FRAME_HEIGHT = 2.8;

/**
 * The stage is a bit wider than the tower; shifting it right by this fraction of its own width puts
 * the tower's right edge on the page's right margin. The CSS then pulls it back by --tower-inset.
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

/**
 * Compact layout (below 900px): the tower sits in the free column to the right of the name.
 * The widest part of the tower (the top disc) spans this fraction of the stage's width, so the stage has an
 * empty margin of COMPACT_STAGE_INSET of its width on each side of the silhouette. The 3D camera is a
 * perspective one, which magnifies the top disc (it is nearer to the camera than the center of the frame).
 */
const TOP_DISC_Y = discCenterY(DISC_COUNT - 1) + DISC_HEIGHT / 2;
const PERSPECTIVE = CAMERA_DISTANCE / (CAMERA_DISTANCE - TOP_DISC_Y * Math.sin((CAMERA_ELEVATION_DEG * Math.PI) / 180));
export const COMPACT_TOWER_SPAN = (2 * RADIUS_TOP * PERSPECTIVE) / (COMPACT_FRAME_HEIGHT * COMPACT_STAGE_ASPECT);
export const COMPACT_STAGE_INSET = (1 - COMPACT_TOWER_SPAN) / 2;

/** Least air (px) between the silhouette of the compact tower and the letters of the name. */
export const COMPACT_NAME_GAP = 16;
/** Extra px kept on each side of the silhouette, for the antialiased edge and sub-pixel rounding of the render. */
export const COMPACT_EDGE_SLACK = 1;

/** Below this stage width (px) the compact tower is not rendered at all (no SVG, no 3D, no Three.js download). */
export const COMPACT_MIN_WIDTH = 110;

/**
 * Widest compact stage (px) for a free column `room` px wide (from the end of the longest line of the name to
 * the page margin; `pad` is the page margin, the most the stage may hang into it). The stage never overlaps
 * the name (its left edge stays inside the column), the silhouette keeps COMPACT_NAME_GAP from the name and does
 * not go past the page margin (the stage's empty margin may hang into it, but never out of the screen).
 * With i = COMPACT_STAGE_INSET, s = COMPACT_EDGE_SLACK and W the width:
 * W <= room + min(i W - s, pad) - max(0, gap + s - i W), which is the smallest of four closed forms.
 */
export function compactStageWidth(room: number, pad: number): number {
  const i = COMPACT_STAGE_INSET;
  const g = COMPACT_NAME_GAP + COMPACT_EDGE_SLACK;
  const s = COMPACT_EDGE_SLACK;
  return Math.min((room - s) / (1 - i), room + pad, (room - g - s) / (1 - 2 * i), (room + pad - g) / (1 - i));
}
