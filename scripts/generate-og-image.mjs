/**
 * Generates the social share image (1200x630 PNG, English, light theme).
 *
 *   node scripts/generate-og-image.mjs
 *   node scripts/generate-og-image.mjs --steps=140 --out=some/other.png   (try another tower rotation)
 *
 * - Colors and font names are read from src/index.css (light theme block), so the image follows the site.
 * - The tower is NOT redrawn: the script starts the site (Vite, 1920x1080, light theme, EN, 2x), freezes the
 *   hero's 3D scene at a chosen frame and captures the canvas with a transparent background. The result is
 *   the real hero tower (same silhouette, light and shade, no outlines), and it merges into the page gray
 *   without seams because the edges keep their alpha.
 * - Fonts come from the same Google Fonts stylesheet as the site; the capture waits for them.
 * - Output: public/OUTPUT_NAME. When you redo the image, change OUTPUT_NAME (and og:image / twitter:image in
 *   index.html) so crawlers don't serve a cached one.
 */
import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);

const OUTPUT_NAME = "og-image-en-light-v2.png";
const WIDTH = 1200;
const HEIGHT = 630;
const SAFE_X = WIDTH * 0.05; // 60px
const SAFE_Y = HEIGHT * 0.05; // 31.5px

/**
 * Which frame of the hero to freeze: the number of 100 ms animation steps after the tower starts.
 * The tower turns once every 50 s and the faint accent shimmer sweeps up it every 7 s, so a multiple of
 * 70 steps (7 s) leaves the shimmer at the bottom edge (no tint on the faces); the multiple picks the angle.
 */
const CAPTURE_STEPS = Number(arg("steps") ?? 350);
const out = resolve(arg("out") ?? resolve(root, "public", OUTPUT_NAME));

/* ------------------------------ site tokens ------------------------------ */

const css = readFileSync(resolve(root, "src/index.css"), "utf8");
const lightBlock = css.match(/:root\[data-theme="light"\]\s*\{([^}]*)\}/)?.[1];
if (!lightBlock) throw new Error('Could not find the :root[data-theme="light"] block in src/index.css');

const token = (name) => {
  const v = lightBlock.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!v) throw new Error(`Missing --color-${name} in the light theme`);
  return v;
};
const colors = { bg: token("bg"), text: token("text"), accent: token("accent") };

const fontsUrl = css.match(/@import url\('(https:\/\/fonts\.googleapis\.com[^']+)'\)/)?.[1];
const fontFamily = css.match(/--font-display:\s*([^;]+);/)?.[1]?.trim();
if (!fontsUrl || !fontFamily) throw new Error("Could not read the font settings from src/index.css");

/* ------------------------- the hero tower (capture) ------------------------ */

/**
 * Runs before the site's scripts. Replaces requestAnimationFrame and performance.now with a clock that only
 * moves when `window.__advance(ms)` is called, so the 3D scene can be stepped to an exact frame and then held.
 */
const FREEZE_CLOCK = () => {
  let now = 1000;
  let queue = [];
  performance.now = () => now;
  window.requestAnimationFrame = (cb) => queue.push(cb);
  window.cancelAnimationFrame = () => {};
  window.__advance = (ms) => {
    now += ms;
    const run = queue;
    queue = [];
    for (const cb of run) cb(now);
  };
};

async function captureTower(browser) {
  const server = await createServer({ root, logLevel: "error", server: { port: 0, host: "127.0.0.1" } });
  await server.listen();
  const url = server.resolvedUrls.local[0];
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "no-preference",
    locale: "en-US",
  });
  try {
    await context.addInitScript(() => {
      localStorage.setItem("theme", "light");
      localStorage.setItem("lang", "en");
    });
    await context.addInitScript(FREEZE_CLOCK);
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load" });

    // The scene mounts once the page is idle; keep stepping the frozen clock until it reports ready.
    const live = page.locator('.hero-tower[data-live="true"]');
    for (let i = 0; i < 400 && !(await live.count()); i++) {
      await page.evaluate(() => window.__advance(100));
      await page.waitForTimeout(50);
    }
    if (!(await live.count())) throw new Error("The 3D tower never started (is WebGL available?).");

    // Step to the chosen frame.
    await page.evaluate((steps) => {
      for (let i = 0; i < steps; i++) window.__advance(100);
    }, CAPTURE_STEPS);

    // Show only the canvas, on a transparent page, then let the CSS cross-fade finish.
    await page.addStyleTag({
      content: `* { visibility: hidden !important; background: transparent !important; }
                canvas { visibility: visible !important; }`,
    });
    await page.evaluate(() => window.__advance(100));
    await page.waitForTimeout(1500);

    const canvas = page.locator(".hero-tower__stage > canvas");
    return await canvas.screenshot({ omitBackground: true, animations: "allow" });
  } finally {
    await context.close();
    await server.close();
  }
}

/** Crops the transparent margin off the capture, returning a PNG data URI and its size in pixels. */
async function cropToTower(browser, png) {
  const page = await browser.newPage();
  try {
    await page.setContent("<body></body>");
    return await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
      let x0 = width, y0 = height, x1 = -1, y1 = -1;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (data[(y * width + x) * 4 + 3] > 4) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
      if (x1 < 0) throw new Error("The captured canvas is empty.");
      const pad = 2; // keep the faint antialiasing pixels at the edges
      x0 = Math.max(0, x0 - pad);
      y0 = Math.max(0, y0 - pad);
      x1 = Math.min(width - 1, x1 + pad);
      y1 = Math.min(height - 1, y1 + pad);
      const w = x1 - x0 + 1;
      const h = y1 - y0 + 1;
      const o = document.createElement("canvas");
      o.width = w;
      o.height = h;
      o.getContext("2d").drawImage(c, x0, y0, w, h, 0, 0, w, h);
      return { uri: o.toDataURL("image/png"), w, h };
    }, png.toString("base64"));
  } finally {
    await page.close();
  }
}

/* -------------------------------- template ------------------------------- */

function template(tower) {
  // The tower is as tall as the safe area allows and sits against the right safe margin, away from the text.
  const maxH = HEIGHT - 2 * SAFE_Y;
  const maxW = 345;
  const scale = Math.min(maxH / tower.h, maxW / tower.w);
  const w = tower.w * scale;
  const h = tower.h * scale;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsUrl}">
<style>
  :root { --bg: ${colors.bg}; --text: ${colors.text}; --accent: ${colors.accent}; }
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
  .tower {
    position: absolute;
    right: ${SAFE_X}px;
    top: ${(HEIGHT - h) / 2}px;
    width: ${w.toFixed(2)}px;
    height: ${h.toFixed(2)}px;
  }
</style>
</head>
<body>
  <div class="copy">
    <div class="eyebrow">douglazcandido.com</div>
    <h1 class="name"><span>Douglas</span><span class="accent">Candido</span></h1>
    <div class="role">Data and software engineer</div>
    <div class="bar"></div>
  </div>
  <img class="tower" alt="" src="${tower.uri}">
</body>
</html>`;
}

/* -------------------------------- capture -------------------------------- */

const browser = await chromium.launch();
try {
  const tower = await cropToTower(browser, await captureTower(browser));
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  await page.setContent(template(tower), { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await document.fonts.load('600 100px "Bricolage Grotesque"');
    await document.fonts.load('400 40px "Bricolage Grotesque"');
    await document.querySelector(".tower").decode();
  });
  const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").length);
  if (loaded === 0) throw new Error("Web fonts did not load (offline?). Refusing to write a fallback-font image.");
  await page.screenshot({ path: out, type: "png" });
} finally {
  await browser.close();
}

console.log(`${out}  ${(statSync(out).size / 1024).toFixed(1)} KB`);
