/**
 * Builds the web variants of the Sentinel screenshots.
 *
 *   node scripts/optimize-sentinel.mjs
 *
 * Source: assets-src/sentinel/*.png (the 1920x1200 originals, kept out of the build).
 * Output: src/assets/projects/sentinel/<name>-<width>.webp, which src/data/projectMedia.ts picks up through
 * `import.meta.glob`; Vite hashes them and the site serves them with srcset:
 *
 *   176, 264   thumbnails of the fan (88x55 CSS px, at 1x/2x and 3x): lossy WebP
 *   960        the viewer on small screens: lossy WebP
 *   1920       the viewer at full size (1x desktop, retina, large phones): lossless WebP. The screenshots are flat
 *              UI, so lossless is smaller than the PNG and keeps every pixel (lossy at that size is 2-3x larger).
 *
 * It rewrites the whole output folder, so the folder always matches the sources. Needs `sharp` (devDependency).
 */
import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = resolve(root, "assets-src/sentinel");
const outDir = resolve(root, "src/assets/projects/sentinel");

/** width -> encoder options */
const VARIANTS = {
  176: { quality: 82, effort: 6, smartSubsample: true },
  264: { quality: 82, effort: 6, smartSubsample: true },
  960: { quality: 85, effort: 6, smartSubsample: true },
  1920: { lossless: true, effort: 6 },
};

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const totals = Object.fromEntries(Object.keys(VARIANTS).map((w) => [w, 0]));
let originals = 0;
for (const file of readdirSync(srcDir).filter((f) => f.endsWith(".png")).sort()) {
  const name = file.replace(/\.png$/, "");
  originals += statSync(resolve(srcDir, file)).size;
  for (const [width, options] of Object.entries(VARIANTS)) {
    const out = resolve(outDir, `${name}-${width}.webp`);
    await sharp(resolve(srcDir, file)).resize({ width: +width, withoutEnlargement: true }).webp(options).toFile(out);
    totals[width] += statSync(out).size;
  }
  console.log("done", name);
}
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
console.log(`\noriginal PNGs: ${kb(originals)}`);
for (const [w, n] of Object.entries(totals)) console.log(`${String(w).padStart(5)} px: ${kb(n)} (8 images)`);
