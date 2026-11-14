/**
 * Generates the social share image (1200x630 PNG, English, light theme).
 *
 *   node scripts/generate-og-image.mjs
 *
 * - Colors and font names are read from src/index.css (light theme block), so the image follows the site.
 * - The tower is drawn from src/components/hero-tower/towerSpec.ts, the same spec as the hero illustration
 *   (needs Node >= 22.18 / 24 to import the .ts file directly).
 * - Fonts come from the same Google Fonts stylesheet as the site; the capture waits for them.
 * - Output: public/og-image-en-light.png. Change OUTPUT_NAME when you redo the image, so crawlers don't serve a cached one.
 */
import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_NAME = "og-image-en-light.png";
const WIDTH = 1200;
const HEIGHT = 630;
const SAFE_X = WIDTH * 0.05; // 60px
const SAFE_Y = HEIGHT * 0.05; // 31.5px

/* ------------------------------ site tokens ------------------------------ */

const css = readFileSync(resolve(root, "src/index.css"), "utf8");
const lightBlock = css.match(/:root\[data-theme="light"\]\s*\{([^}]*)\}/)?.[1];
if (!lightBlock) throw new Error('Could not find the :root[data-theme="light"] block in src/index.css');

const token = (name) => {
  const v = lightBlock.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!v) throw new Error(`Missing --color-${name} in the light theme`);
  return v;
};
const colors = { bg: token("bg"), surface: token("surface"), text: token("text"), accent: token("accent") };

const fontsUrl = css.match(/@import url\('(https:\/\/fonts\.googleapis\.com[^']+)'\)/)?.[1];
const fontFamily = css.match(/--font-display:\s*([^;]+);/)?.[1]?.trim();
if (!fontsUrl || !fontFamily) throw new Error("Could not read the font settings from src/index.css");

/* ------------------------------- the tower ------------------------------- */

const spec = await import(pathToFileURL(resolve(root, "src/components/hero-tower/towerSpec.ts")).href);
const { CAMERA_ELEVATION_DEG, COLUMN_RADIUS, DISC_COUNT, DISC_HEIGHT, FRAME_HEIGHT, HOLE_RADIUS, TOWER_HEIGHT, discCenterY, discRadius, rimProfile } = spec;

// Same projection as TowerIllustration.tsx, in a viewBox that is as tall as the safe area.
const VIEW_H = 1000;
const SCALE = VIEW_H / FRAME_HEIGHT;
const SIN_E = Math.sin((CAMERA_ELEVATION_DEG * Math.PI) / 180);
const COS_E = Math.cos((CAMERA_ELEVATION_DEG * Math.PI) / 180);
const VIEW_W = 2 * spec.RADIUS_TOP * SCALE + 20;
const CX = VIEW_W / 2;
const f = (n) => n.toFixed(1);
const sy = (y) => VIEW_H / 2 - y * COS_E * SCALE;
const at = (a, rr, y) => `${f(CX + rr * SCALE * Math.cos(a))} ${f(y + rr * SCALE * SIN_E * Math.sin(a))}`;

function ellipse(cy, rx, ry) {
  return `M${f(CX - rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(CX + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 0 ${f(CX - rx)} ${f(cy)}Z`;
}

function disc(i) {
  const radius = discRadius(i);
  const yTop = sy(discCenterY(i) + DISC_HEIGHT / 2);
  const yBottom = sy(discCenterY(i) - DISC_HEIGHT / 2);
  const profile = rimProfile(radius);
  const root = radius - spec.TOOTH_DEPTH;
  const front = [[0, root], ...profile.filter(([a]) => Math.sin(a) > 0), [Math.PI, root]];
  const side = `M${front.map(([a, rr]) => at(a, rr, yTop)).join("L")}L${front
    .map(([a, rr]) => at(a, rr, yBottom))
    .reverse()
    .join("L")}Z`;
  const rim = `M${profile.map(([a, rr]) => at(a, rr, yTop)).join("L")}Z`;
  const hole = ellipse(yTop, HOLE_RADIUS * SCALE, HOLE_RADIUS * SCALE * SIN_E);
  return { side, top: rim, hole };
}

const columnX = COLUMN_RADIUS * SCALE;
const columnTop = sy(TOWER_HEIGHT / 2);
const columnBottom = sy(-TOWER_HEIGHT / 2);

let discs = "";
for (let i = 0; i < DISC_COUNT; i++) {
  const d = disc(i);
  discs += `<path d="${d.side}" fill="${colors.bg}"/>`;
  discs += `<path d="${d.top}" fill="${colors.surface}"/>`;
  discs += `<path d="${d.hole}" fill="${colors.bg}"/>`;
}

const towerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(VIEW_W)} ${VIEW_H}" class="tower"
  fill="none" stroke="${colors.accent}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round">
  <rect x="${f(CX - columnX)}" y="${f(columnTop)}" width="${f(columnX * 2)}" height="${f(columnBottom - columnTop)}" fill="${colors.bg}"/>
  ${discs}
</svg>`;

/* -------------------------------- template ------------------------------- */

const towerH = HEIGHT - 2 * SAFE_Y;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsUrl}">
<style>
  :root { --bg: ${colors.bg}; --surface: ${colors.surface}; --text: ${colors.text}; --accent: ${colors.accent}; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
  body {
    position: relative;
    background: var(--bg);
    color: var(--text);
    font-family: ${fontFamily};
    -webkit-font-smoothing: antialiased;
  }
  .copy {
    position: absolute;
    left: ${SAFE_X + 36}px;
    top: ${SAFE_Y}px;
    bottom: ${SAFE_Y}px;
    width: 660px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .eyebrow { font-size: 26px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--accent); }
  .name { margin-top: 26px; font-size: 152px; line-height: 0.96; font-weight: 600; letter-spacing: -0.045em; }
  .name span { display: block; }
  .name .accent { color: var(--accent); }
  .role { margin-top: 34px; font-size: 42px; line-height: 1.2; font-weight: 400; color: var(--text); }
  .bar { margin-top: 36px; width: 120px; height: 6px; background: var(--accent); }
  .tower { position: absolute; top: ${SAFE_Y}px; right: ${SAFE_X}px; height: ${towerH}px; width: auto; }
</style>
</head>
<body>
  <div class="copy">
    <div class="eyebrow">douglazcandido.com</div>
    <h1 class="name"><span>Douglas</span><span class="accent">Candido</span></h1>
    <div class="role">Data and software engineer</div>
    <div class="bar"></div>
  </div>
  ${towerSvg}
</body>
</html>`;

/* -------------------------------- capture -------------------------------- */

const out = resolve(root, "public", OUTPUT_NAME);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await document.fonts.load('600 100px "Bricolage Grotesque"');
    await document.fonts.load('400 40px "Bricolage Grotesque"');
  });
  const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").length);
  if (loaded === 0) throw new Error("Web fonts did not load (offline?). Refusing to write a fallback-font image.");
  await page.screenshot({ path: out, type: "png" });
} finally {
  await browser.close();
}

console.log(`${out}  ${(statSync(out).size / 1024).toFixed(1)} KB`);
