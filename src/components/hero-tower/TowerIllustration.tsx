import {
  CAMERA_ELEVATION_DEG,
  COLUMN_RADIUS,
  DISC_COUNT,
  DISC_HEIGHT,
  FRAME_HEIGHT,
  HOLE_RADIUS,
  STAGE_ASPECT,
  TEETH,
  TOOTH_DEPTH,
  TOWER_HEIGHT,
  discCenterY,
  discRadius,
  rimProfile,
} from "./towerSpec";

/**
 * Static illustration of the tower: same silhouette as the 3D scene (both are generated from
 * towerSpec.ts), drawn in the theme colors through CSS variables. Like the 3D scene it has no
 * outlines: light and shade between the faces (and the dark notches of the rim) do the drawing.
 * It is the placeholder while the 3D code loads, and what stays on screen when WebGL is unavailable
 * or the user prefers less motion.
 */

const VIEW_H = 1000;
const VIEW_W = VIEW_H * STAGE_ASPECT;
const SCALE = VIEW_H / FRAME_HEIGHT;
const CX = VIEW_W / 2;
const SIN_E = Math.sin((CAMERA_ELEVATION_DEG * Math.PI) / 180);
const COS_E = Math.cos((CAMERA_ELEVATION_DEG * Math.PI) / 180);

const f = (n: number) => n.toFixed(1);
const sy = (y: number) => VIEW_H / 2 - y * COS_E * SCALE;

/** Closed ellipse (centered at CX, cy) as a path. */
function ellipse(cy: number, rx: number, ry: number): string {
  return `M${f(CX - rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(CX + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(CX - rx)} ${f(cy)}Z`;
}

interface DiscShape {
  /** Side wall: the front half of the toothed rim, from the top edge down to the bottom edge. */
  side: string;
  /** Top face: the toothed rim plus the hole (drawn with the even-odd rule). */
  top: string;
  /** The notches of the segmented rim on the front half, as dark strips over the wall. */
  notches: string;
}

function disc(i: number): DiscShape {
  const radius = discRadius(i);
  const yTop = sy(discCenterY(i) + DISC_HEIGHT / 2);
  const yBottom = sy(discCenterY(i) - DISC_HEIGHT / 2);
  const profile = rimProfile(radius);
  const span = (Math.PI * 2) / TEETH;

  // A point of the rim (angle a, radius rr) at the height of a face, seen from the camera.
  const at = (a: number, rr: number, y: number): string => `${f(CX + rr * SCALE * Math.cos(a))} ${f(y + rr * SCALE * SIN_E * Math.sin(a))}`;

  // Front half only (angles 0..PI), closed off at both ends on the floor of a notch.
  const root = radius - TOOTH_DEPTH;
  const front: Array<[number, number]> = [[0, root], ...profile.filter(([a]) => Math.sin(a) > 0), [Math.PI, root]];
  const topFront = front.map(([a, rr]) => at(a, rr, yTop));
  const bottomFront = front.map(([a, rr]) => at(a, rr, yBottom)).reverse();
  const side = `M${topFront.join("L")}L${bottomFront.join("L")}Z`;

  const rim = `M${profile.map(([a, rr]) => at(a, rr, yTop)).join("L")}Z`;
  const hole = ellipse(yTop, HOLE_RADIUS * SCALE, HOLE_RADIUS * SCALE * SIN_E);
  const top = rim + hole;

  let notches = "";
  for (let j = 0; j < TEETH; j++) {
    // The notch floor is where the rim dips between two teeth (same fractions as rimProfile).
    const a1 = (j + 0.86) * span;
    const a2 = (j + 1.14) * span;
    if (Math.sin(a1) <= 0.05 || Math.sin(a2) <= 0.05) continue; // back half: hidden
    notches += `M${at(a1, root, yTop)}L${at(a2, root, yTop)}L${at(a2, root, yBottom)}L${at(a1, root, yBottom)}Z`;
  }
  return { side, top, notches };
}

const shapes: DiscShape[] = Array.from({ length: DISC_COUNT }, (_, i) => disc(i));

const columnX = COLUMN_RADIUS * SCALE;
const columnTop = sy(TOWER_HEIGHT / 2);
const columnBottom = sy(-TOWER_HEIGHT / 2);

export default function TowerIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${f(VIEW_W)} ${VIEW_H}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Light from the upper left: the walls go from lit on the left to shaded on the right. */}
        <linearGradient id="tower-wall" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" className="tower-svg__stop-lit" />
          <stop offset="0.45" className="tower-svg__stop-lit" />
          <stop offset="1" className="tower-svg__stop-shade" />
        </linearGradient>
      </defs>
      <g>
        {/* Column first, so the discs slide over it. */}
        <rect className="tower-svg__column" x={f(CX - columnX)} y={f(columnTop)} width={f(columnX * 2)} height={f(columnBottom - columnTop)} />
        <rect className="tower-svg__column-shade" x={f(CX)} y={f(columnTop)} width={f(columnX)} height={f(columnBottom - columnTop)} />
        {shapes.map((s, i) => (
          <g key={i}>
            <path fill="url(#tower-wall)" d={s.side} />
            <path className="tower-svg__notch" d={s.notches} />
            <path className="tower-svg__top" fillRule="evenodd" d={s.top} />
          </g>
        ))}
      </g>
    </svg>
  );
}
