/**
 * Three.js scene for the hero tower. This module (and `three` with it) is only ever loaded
 * through a dynamic import, after the first paint, see HeroTower.tsx.
 *
 * Budget: 1 draw call (one mesh for every face), ~4.5k triangles, no textures, no cast shadows,
 * no post-processing. There are no outlines: the shape reads through the play of light and shade
 * between faces (one directional light, plus a little baked darkening towards the openings and the
 * notches). The discs slide along the column through a per-disc offset applied in the vertex
 * shader, so nothing is rebuilt while it animates.
 */
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  type IUniform,
  type WebGLProgramParametersWithUniforms,
} from "three";
import {
  CAMERA_DISTANCE,
  CAMERA_ELEVATION_DEG,
  COLUMN_RADIUS,
  COLUMN_SIDES,
  DISC_COUNT,
  DISC_HEIGHT,
  FRAME_HEIGHT,
  GAP_COUNT,
  GAP_HEIGHT,
  HOLE_RADIUS,
  OPEN_FACTOR,
  TOWER_HEIGHT,
  discCenterY,
  discRadius,
  gapCenterY,
  gapRadius,
  rimProfile,
} from "./towerSpec";

export interface TowerOptions {
  /** The stage: the canvas is appended to it and fills it. */
  host: HTMLElement;
  /** The pointer only counts while its target is inside this element (the hero). */
  interactionRoot: HTMLElement;
  /** Receives its position (px, relative to the stage) through CSS variables --lx / --ly. */
  label: HTMLElement | null;
  /** Called when the hovered opening changes (0 = lowest), or null when none is. */
  onHover: (gap: number | null) => void;
  /** Called once the first frame is on screen. */
  onReady: () => void;
  /** Called when the WebGL context is lost: the caller falls back to the static image. */
  onLost: () => void;
  /** Aborting it while the scene is still being set up disposes everything and stops the setup. */
  signal: AbortSignal;
}

export interface TowerHandle {
  dispose: () => void;
}

// ---------------------------------------------------------------------------------------------
// Motion constants (the numbers to tweak when tuning the feel)
// ---------------------------------------------------------------------------------------------

/** One full turn of the tower every 50 seconds. */
const TURN_SECONDS = 50;
const BASE_SPEED = (Math.PI * 2) / TURN_SECONDS;
/** How quickly the rotation eases to a stop / back up (1/s, exponential approach). */
const STOP_RATE = 3.2;
const RESUME_RATE = 1.6;
/** How quickly an opening opens / closes (1/s). The result is also run through a smoothstep. */
const OPEN_RATE = 6;
/** Accent-colored glow that travels up the faces: seconds per sweep, half-width (tower units), strength 0..1. */
const SHIMMER_SECONDS = 7;
const SHIMMER_WIDTH = 0.32;
const SHIMMER_STRENGTH = 0.24;
/** How strongly the faces around the hovered opening take the accent color (0..1). */
const GLOW_STRENGTH = 0.7;
/** Extra reach of the invisible hit volumes above and below each opening. */
const HIT_PAD = DISC_HEIGHT * 0.25;
/** Never render faster than this (keeps 120/144 Hz screens at ~60 fps). */
const MIN_FRAME_MS = 12;

// ---------------------------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------------------------

type Vec3 = [number, number, number];

/**
 * One vertex: position, normal, a baked "shade" (1 = fully lit, lower = darkened, like ambient
 * occlusion: it separates the discs and deepens the notches and the hole) and the opening the
 * vertex borders (-1 = none) and how much of the hover glow it takes (1 at the rim of the opening,
 * less towards the hole), which is what lights up when that opening is hovered.
 */
interface Vertex {
  p: Vec3;
  n: Vec3;
  shade: number;
  rim: number;
  glow: number;
}

const vertex = (p: Vec3, n: Vec3, shade: number, rim: number, glow = 1): Vertex => ({ p, n, shade, rim, glow });

/** Every face of the tower: positions, normals, baked shade, the disc each vertex belongs to (7 = the column) and its rim. */
class FaceBuilder {
  readonly position: number[] = [];
  readonly normal: number[] = [];
  readonly color: number[] = [];
  readonly disc: number[] = [];
  readonly rim: number[] = [];
  readonly glow: number[] = [];

  /** Adds a triangle wound counter-clockwise as seen from the side its normals point to. */
  tri(a: Vertex, b: Vertex, c: Vertex, disc: number): void {
    const ux = b.p[0] - a.p[0], uy = b.p[1] - a.p[1], uz = b.p[2] - a.p[2];
    const vx = c.p[0] - a.p[0], vy = c.p[1] - a.p[1], vz = c.p[2] - a.p[2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    const facing = cx * (a.n[0] + b.n[0] + c.n[0]) + cy * (a.n[1] + b.n[1] + c.n[1]) + cz * (a.n[2] + b.n[2] + c.n[2]);
    if (facing < 0) [b, c] = [c, b];
    for (const v of [a, b, c]) {
      this.position.push(v.p[0], v.p[1], v.p[2]);
      this.normal.push(v.n[0], v.n[1], v.n[2]);
      this.color.push(v.shade, v.shade, v.shade);
      this.disc.push(disc);
      this.rim.push(v.rim);
      this.glow.push(v.glow);
    }
  }

  quad(a: Vertex, b: Vertex, c: Vertex, d: Vertex, disc: number): void {
    this.tri(a, b, c, disc);
    this.tri(a, c, d, disc);
  }
}

/** Share of the hover glow that reaches the hole of a disc (the outer rim takes all of it). */
const INNER_GLOW = 0.25;

/** Baked shade of the outer wall segment that starts at profile point `k % 4`: flank, tip, flank, notch floor. */
const WALL_SHADE = [0.9, 1, 0.9, 0.7];

function addDisc(faces: FaceBuilder, i: number): void {
  const yTop = discCenterY(i) + DISC_HEIGHT / 2;
  const yBottom = discCenterY(i) - DISC_HEIGHT / 2;
  const profile = rimProfile(discRadius(i));
  const count = profile.length;
  // The top of a disc borders the opening above it, the bottom borders the opening below it.
  const rimAbove = i < GAP_COUNT ? i : -1;
  const rimBelow = i > 0 ? i - 1 : -1;

  const outerAt = (k: number, y: number): Vec3 => [profile[k][1] * Math.cos(profile[k][0]), y, profile[k][1] * Math.sin(profile[k][0])];
  const innerAt = (k: number, y: number): Vec3 => [HOLE_RADIUS * Math.cos(profile[k][0]), y, HOLE_RADIUS * Math.sin(profile[k][0])];
  const up: Vec3 = [0, 1, 0];
  const down: Vec3 = [0, -1, 0];

  for (let k = 0; k < count; k++) {
    const k1 = (k + 1) % count;
    const wallShade = WALL_SHADE[k % 4];

    // Outer wall: flat panel, normal pointing away from the axis, a bit darker towards the opening below.
    const a = outerAt(k, yTop), b = outerAt(k1, yTop);
    let nx = b[2] - a[2], nz = -(b[0] - a[0]);
    if (nx * (a[0] + b[0]) + nz * (a[2] + b[2]) < 0) {
      nx = -nx;
      nz = -nz;
    }
    const len = Math.hypot(nx, nz) || 1;
    const wall: Vec3 = [nx / len, 0, nz / len];
    faces.quad(
      vertex(a, wall, wallShade, rimAbove),
      vertex(b, wall, wallShade, rimAbove),
      vertex(outerAt(k1, yBottom), wall, wallShade * 0.75, rimBelow),
      vertex(outerAt(k, yBottom), wall, wallShade * 0.75, rimBelow),
      i,
    );

    // Top face (annulus between the rim and the hole): darker towards the hole.
    faces.quad(
      vertex(outerAt(k, yTop), up, 1, rimAbove),
      vertex(outerAt(k1, yTop), up, 1, rimAbove),
      vertex(innerAt(k1, yTop), up, 0.72, rimAbove, INNER_GLOW),
      vertex(innerAt(k, yTop), up, 0.72, rimAbove, INNER_GLOW),
      i,
    );
    // Bottom face.
    faces.quad(
      vertex(outerAt(k, yBottom), down, 0.55, rimBelow),
      vertex(outerAt(k1, yBottom), down, 0.55, rimBelow),
      vertex(innerAt(k1, yBottom), down, 0.4, rimBelow, INNER_GLOW),
      vertex(innerAt(k, yBottom), down, 0.4, rimBelow, INNER_GLOW),
      i,
    );

    // Wall of the hole, smooth, normal pointing at the axis: the darkest part of the disc.
    const n0: Vec3 = [-Math.cos(profile[k][0]), 0, -Math.sin(profile[k][0])];
    const n1: Vec3 = [-Math.cos(profile[k1][0]), 0, -Math.sin(profile[k1][0])];
    faces.quad(
      vertex(innerAt(k, yTop), n0, 0.6, rimAbove, INNER_GLOW),
      vertex(innerAt(k1, yTop), n1, 0.6, rimAbove, INNER_GLOW),
      vertex(innerAt(k1, yBottom), n1, 0.35, rimBelow, INNER_GLOW),
      vertex(innerAt(k, yBottom), n0, 0.35, rimBelow, INNER_GLOW),
      i,
    );
  }
}

function addColumn(faces: FaceBuilder): void {
  const top = TOWER_HEIGHT / 2;
  const bottom = -TOWER_HEIGHT / 2;
  const column = DISC_COUNT; // index 7: never offset
  const corner = (s: number, y: number): Vec3 => {
    const a = (s / COLUMN_SIDES) * Math.PI * 2;
    return [COLUMN_RADIUS * Math.cos(a), y, COLUMN_RADIUS * Math.sin(a)];
  };
  const up: Vec3 = [0, 1, 0];
  const down: Vec3 = [0, -1, 0];
  for (let s = 0; s < COLUMN_SIDES; s++) {
    const s1 = (s + 1) % COLUMN_SIDES;
    const mid = ((s + 0.5) / COLUMN_SIDES) * Math.PI * 2;
    const n: Vec3 = [Math.cos(mid), 0, Math.sin(mid)];
    faces.quad(
      vertex(corner(s, top), n, 0.9, -1),
      vertex(corner(s1, top), n, 0.9, -1),
      vertex(corner(s1, bottom), n, 0.9, -1),
      vertex(corner(s, bottom), n, 0.9, -1),
      column,
    );
    faces.tri(vertex([0, top, 0], up, 1, -1), vertex(corner(s, top), up, 1, -1), vertex(corner(s1, top), up, 1, -1), column);
    faces.tri(vertex([0, bottom, 0], down, 0.5, -1), vertex(corner(s, bottom), down, 0.5, -1), vertex(corner(s1, bottom), down, 0.5, -1), column);
  }
}

function toAttribute(values: number[], size: number): BufferAttribute {
  return new BufferAttribute(new Float32Array(values), size);
}

// ---------------------------------------------------------------------------------------------
// Theme: colors come from the site's CSS variables
// ---------------------------------------------------------------------------------------------

function readColor(name: string, fallback: string): Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const color = new Color();
  try {
    color.setStyle(/^(#|rgb|hsl)/i.test(raw) ? raw : fallback);
  } catch {
    color.setStyle(fallback);
  }
  return color;
}

/** Mixes two colors in sRGB (like CSS `color-mix(in srgb, ...)`), so it matches the SVG fallback. */
function mixSrgb(a: Color, b: Color, t: number): Color {
  const ha = a.getHex(), hb = b.getHex();
  const channel = (shift: number) => Math.round(((ha >> shift) & 255) * (1 - t) + ((hb >> shift) & 255) * t);
  return new Color((channel(16) << 16) | (channel(8) << 8) | channel(0));
}

interface Palette {
  light: boolean;
  /** Color of the faces (before light and baked shade). */
  face: Color;
  /** The accent: what the shimmer and the hover glow tint the faces with. */
  tint: Color;
}

function readPalette(): Palette {
  const light = document.documentElement.getAttribute("data-theme") === "light";
  const accent = readColor("--color-accent", light ? "#0b4f26" : "#f5c542");
  const surface = readColor("--color-surface", light ? "#e0e2e7" : "#0b0b0c");
  const text = readColor("--color-text", light ? "#14151a" : "#e9e9ed");
  const white = new Color(0xffffff);
  return {
    light,
    // Dark theme: dark gray faces. Light theme: pale faces, lighter than the page.
    face: light ? mixSrgb(surface, white, 0.6) : mixSrgb(surface, text, 0.3),
    tint: accent,
  };
}

// ---------------------------------------------------------------------------------------------
// Shaders: patches for the Lambert material (disc offsets, shimmer and hover glow)
// ---------------------------------------------------------------------------------------------

const VERTEX_PARS = /* glsl */ `
  attribute float aDisc;
  attribute float aRim;
  attribute float aGlow;
  uniform float uOffsets[8];
  uniform float uGlow[6];
  uniform float uPhase;
  uniform float uBandWidth;
  uniform float uYMin;
  uniform float uYMax;
  uniform float uShimmer;
  uniform float uGlowStrength;
  varying float vTint;
`;

const VERTEX_MAIN = /* glsl */ `
  // The disc slides along the column.
  transformed.y += uOffsets[int(aDisc + 0.5)];

  // A soft band travelling from the bottom of the tower to the top...
  float bandY = mix(uYMin - uBandWidth, uYMax + uBandWidth, uPhase);
  float bandD = (transformed.y - bandY) / uBandWidth;
  float shimmer = exp(-bandD * bandD * 2.0) * uShimmer;

  // ...and the faces around the hovered opening take the accent color.
  float glow = aRim > -0.5 ? uGlow[int(aRim + 0.5)] * aGlow * uGlowStrength : 0.0;

  vTint = clamp(shimmer + glow, 0.0, 1.0);
`;

const FRAGMENT_PARS = /* glsl */ `
  uniform vec3 uTint;
  varying float vTint;
`;

// Tint the lit color, keeping part of its own light and shade so the faces stay readable.
const FRAGMENT_MAIN = /* glsl */ `
  float lum = dot(outgoingLight, vec3(0.299, 0.587, 0.114));
  outgoingLight = mix(outgoingLight, uTint * (0.45 + 0.9 * lum), vTint);
`;

// ---------------------------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------------------------

const smoothstep = (x: number): number => x * x * (3 - 2 * x);

/** Lets the browser run other tasks (input, painting) before the next heavy step. */
const nextTask = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

export async function mountTower(opts: TowerOptions): Promise<TowerHandle> {
  const { host, interactionRoot, label, onHover, onReady, onLost, signal } = opts;

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  const elevation = (CAMERA_ELEVATION_DEG * Math.PI) / 180;
  camera.position.set(0, CAMERA_DISTANCE * Math.sin(elevation), CAMERA_DISTANCE * Math.cos(elevation));
  camera.lookAt(0, 0, 0);
  camera.fov = (2 * Math.atan(FRAME_HEIGHT / 2 / CAMERA_DISTANCE) * 180) / Math.PI;
  camera.updateMatrixWorld();

  // --- geometry -----------------------------------------------------------------------------
  const faces = new FaceBuilder();
  for (let i = 0; i < DISC_COUNT; i++) addDisc(faces, i);
  addColumn(faces);

  const faceGeometry = new BufferGeometry();
  faceGeometry.setAttribute("position", toAttribute(faces.position, 3));
  faceGeometry.setAttribute("normal", toAttribute(faces.normal, 3));
  faceGeometry.setAttribute("color", toAttribute(faces.color, 3));
  faceGeometry.setAttribute("aDisc", toAttribute(faces.disc, 1));
  faceGeometry.setAttribute("aRim", toAttribute(faces.rim, 1));
  faceGeometry.setAttribute("aGlow", toAttribute(faces.glow, 1));

  // --- materials ----------------------------------------------------------------------------
  const palette = readPalette();

  // Vertical offset of each disc (index 7 = column, always 0) and glow of each opening.
  const offsets: IUniform<Float32Array> = { value: new Float32Array(DISC_COUNT + 1) };
  const glow: IUniform<Float32Array> = { value: new Float32Array(GAP_COUNT) };

  const uniforms: Record<string, IUniform> = {
    uOffsets: offsets,
    uGlow: glow,
    uTint: { value: palette.tint.clone() },
    uPhase: { value: 0 },
    uBandWidth: { value: SHIMMER_WIDTH },
    uYMin: { value: -TOWER_HEIGHT / 2 },
    uYMax: { value: TOWER_HEIGHT / 2 },
    uShimmer: { value: SHIMMER_STRENGTH },
    uGlowStrength: { value: GLOW_STRENGTH },
  };

  // `vertexColors` carries the baked shade (the `color` attribute).
  const faceMaterial = new MeshLambertMaterial({ color: palette.face, vertexColors: true });
  faceMaterial.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${VERTEX_PARS}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\n${VERTEX_MAIN}`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${FRAGMENT_PARS}`)
      .replace("#include <opaque_fragment>", `${FRAGMENT_MAIN}\n#include <opaque_fragment>`);
  };
  faceMaterial.customProgramCacheKey = () => "hero-tower-faces";

  // One directional light from the upper left, a little to the front: the sides of the discs facing it
  // are lit, the ones turned away stay dark, and the notches of the rim catch or lose the light as it turns.
  const ambient = new AmbientLight(0xffffff, 0);
  const sun = new DirectionalLight(0xffffff, 0);
  sun.position.set(-3, 3.5, 2.5);
  scene.add(ambient, sun);

  const tower = new Group();
  const faceMesh = new Mesh(faceGeometry, faceMaterial);
  // Offsets move vertices outside the rest-pose bounds: culling would only cause trouble here.
  faceMesh.frustumCulled = false;
  tower.add(faceMesh);
  scene.add(tower);

  // Invisible hit volumes, one per opening: wider than the opening itself so it is easy to hit.
  // Open-ended: only the wall facing the camera can be hit, so the hit area is the visible opening.
  const volumeGeometry = new CylinderGeometry(1, 1, 1, 16, 1, true);
  const volumeMaterial = new MeshBasicMaterial({ visible: false });
  const volumes: Mesh[] = [];
  for (let k = 0; k < GAP_COUNT; k++) {
    const volume = new Mesh(volumeGeometry, volumeMaterial);
    volume.visible = false; // never drawn; the raycaster still tests it
    volume.scale.x = volume.scale.z = gapRadius(k) * 1.08;
    scene.add(volume);
    volumes.push(volume);
  }

  function applyPalette(next: Palette): void {
    faceMaterial.color.copy(next.face);
    (uniforms.uTint.value as Color).copy(next.tint);
    // Lights (the Math.PI is the physically based light scale). Ambient keeps the shaded sides from
    // going flat black; the sun does the modelling. The pale faces get less of both, so they never clip.
    ambient.intensity = Math.PI * (next.light ? 0.42 : 0.5);
    sun.intensity = Math.PI * (next.light ? 0.85 : 1);
  }
  applyPalette(palette);

  // --- state --------------------------------------------------------------------------------
  const open = new Float32Array(GAP_COUNT); // 0 closed .. 1 fully open, per opening
  let hovered = -1;
  let labelGap = -1;
  let speed = BASE_SPEED;
  let clock = 0;
  let disposed = false;
  let lost = false;
  let armed = false; // the loop only runs once the shaders are compiled

  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const probe = new Vector3();
  const pointer = { x: 0, y: 0, active: false };

  function setHover(next: number): void {
    if (next === hovered) return;
    hovered = next;
    if (next >= 0) labelGap = next;
    onHover(next >= 0 ? next : null);
  }

  /** Raycasts the pointer against the hit volumes and picks the opening under it, if any. */
  function pickOpening(): void {
    const rect = canvas.getBoundingClientRect();
    const inside =
      rect.width > 0 && pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
    if (!pointer.active || !inside) {
      setHover(-1);
      return;
    }
    ndc.set(((pointer.x - rect.left) / rect.width) * 2 - 1, -(((pointer.y - rect.top) / rect.height) * 2 - 1));
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(volumes, false)[0];
    setHover(hit ? volumes.indexOf(hit.object as Mesh) : -1);
  }

  function step(dt: number): void {
    clock += dt;
    if (interactive) pickOpening();

    // Openings ease towards their target; the smoothstep on top gives the ease-in/out.
    const openBlend = 1 - Math.exp(-OPEN_RATE * dt);
    for (let k = 0; k < GAP_COUNT; k++) {
      const target = k === hovered ? 1 : 0;
      open[k] += (target - open[k]) * openBlend;
      if (Math.abs(target - open[k]) < 0.0005) open[k] = target;
    }

    // Rotation: eases to a stop while an opening is hovered, and back up afterwards.
    const targetSpeed = hovered >= 0 ? 0 : BASE_SPEED;
    speed += (targetSpeed - speed) * (1 - Math.exp(-(hovered >= 0 ? STOP_RATE : RESUME_RATE) * dt));
    if (Math.abs(targetSpeed - speed) < 1e-5) speed = targetSpeed;
    tower.rotation.y += speed * dt;

    // Discs above an opening move up, discs below it move down, each by half of the extra height.
    const half = ((OPEN_FACTOR - 1) * GAP_HEIGHT) / 2;
    const o = offsets.value;
    for (let i = 0; i < DISC_COUNT; i++) {
      let offset = 0;
      for (let k = 0; k < GAP_COUNT; k++) offset += (i > k ? 1 : -1) * smoothstep(open[k]) * half;
      o[i] = offset;
    }
    for (let k = 0; k < GAP_COUNT; k++) glow.value[k] = smoothstep(open[k]);

    // Hit volumes follow their opening (and grow with it, so the pointer never "falls out").
    for (let k = 0; k < GAP_COUNT; k++) {
      const bottom = discCenterY(k) + DISC_HEIGHT / 2 + o[k];
      const top = discCenterY(k + 1) - DISC_HEIGHT / 2 + o[k + 1];
      volumes[k].position.y = (top + bottom) / 2;
      volumes[k].scale.y = top - bottom + 2 * HIT_PAD;
      volumes[k].updateMatrixWorld();
    }

    uniforms.uPhase.value = (clock % SHIMMER_SECONDS) / SHIMMER_SECONDS;
    placeLabel();
  }

  /** Anchors the label to the left edge of the tower, at the height of its opening. */
  function placeLabel(): void {
    if (!label || labelGap < 0) return;
    const k = labelGap;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const y = gapCenterY(k) + (offsets.value[k] + offsets.value[k + 1]) / 2;
    probe.set(-gapRadius(k), y, 0).project(camera);
    label.style.setProperty("--lx", `${((probe.x * 0.5 + 0.5) * w).toFixed(1)}px`);
    label.style.setProperty("--ly", `${((-probe.y * 0.5 + 0.5) * h).toFixed(1)}px`);
  }

  // --- render loop --------------------------------------------------------------------------
  let raf = 0;
  let last = 0;
  let running = false;
  let readyReported = false;

  function tick(now: number): void {
    raf = requestAnimationFrame(tick);
    const elapsed = now - last;
    if (elapsed < MIN_FRAME_MS) return;
    last = now;
    step(Math.min(elapsed / 1000, 0.1));
    renderer.render(scene, camera);
    if (!readyReported) {
      readyReported = true;
      requestAnimationFrame(() => !disposed && onReady());
    }
  }

  let onScreen = true;
  let tabVisible = !document.hidden;

  function syncLoop(): void {
    const shouldRun = armed && onScreen && tabVisible && !disposed && !lost;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
      // Leave nothing half-open behind: the next time it is seen, it starts calm.
      open.fill(0);
      setHover(-1);
    }
  }

  const intersection = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    syncLoop();
  });
  intersection.observe(host);

  const onVisibility = () => {
    tabVisible = !document.hidden;
    syncLoop();
  };
  document.addEventListener("visibilitychange", onVisibility);

  // --- size ---------------------------------------------------------------------------------
  function resize(): void {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  // --- theme --------------------------------------------------------------------------------
  const themeObserver = new MutationObserver(() => {
    applyPalette(readPalette());
    if (!running && !disposed && !lost) renderer.render(scene, camera);
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // --- pointer ------------------------------------------------------------------------------
  const noHover = window.matchMedia("(hover: none)");
  let interactive = false;

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    // Only over the hero itself (not over the fixed nav), and not while dragging (selecting text).
    pointer.active = e.buttons === 0 && e.target instanceof Node && interactionRoot.contains(e.target);
  };
  const onPointerOff = () => {
    pointer.active = false;
  };

  function syncInteractive(): void {
    const want = !noHover.matches;
    if (want === interactive) return;
    interactive = want;
    if (want) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerOff);
      window.addEventListener("blur", onPointerOff);
    } else {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerOff);
      window.removeEventListener("blur", onPointerOff);
      pointer.active = false;
      setHover(-1);
    }
  }
  syncInteractive();
  noHover.addEventListener("change", syncInteractive);

  // --- context loss -------------------------------------------------------------------------
  const onContextLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    syncLoop();
    onLost();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  // --- teardown -----------------------------------------------------------------------------
  function dispose(): void {
    if (disposed) return;
    disposed = true;
    running = false;
    cancelAnimationFrame(raf);
    intersection.disconnect();
    resizeObserver.disconnect();
    themeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    noHover.removeEventListener("change", syncInteractive);
    window.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener("pointerleave", onPointerOff);
    window.removeEventListener("blur", onPointerOff);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    faceGeometry.dispose();
    volumeGeometry.dispose();
    faceMaterial.dispose();
    volumeMaterial.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  // --- startup: heavy steps are spread over separate tasks so the page stays responsive ---------
  try {
    await nextTask();
    if (!signal.aborted) await renderer.compileAsync(scene, camera); // parallel shader compile where supported
  } catch (error) {
    dispose();
    throw error; // the caller keeps the static illustration
  }
  if (signal.aborted) {
    dispose();
    return { dispose };
  }
  armed = true;
  syncLoop();
  return { dispose };
}
