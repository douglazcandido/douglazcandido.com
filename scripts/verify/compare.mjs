/**
 * Compares two capture folders (see capture.mjs): pixel difference per screenshot and the height numbers.
 *
 *   node scripts/verify/compare.mjs <beforeDir> <afterDir> [--tolerance=0.1]
 *
 * Needs `pixelmatch` and `pngjs` (not project dependencies: install them next to the script's run, e.g. in a
 * scratch folder, and run with NODE_PATH pointing there). Prints, per image: size, the share of differing
 * pixels and the bounding box of the differences. Exits 1 when a height differs by more than 1 px.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(resolve(process.env.NODE_PATH ?? ".", "x.js"));
const pixelmatch = (await import(pathToFileURL(require.resolve("pixelmatch")).href)).default;
const { PNG } = require("pngjs");

const [before, after] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const tolerance = Number(process.argv.find((a) => a.startsWith("--tolerance="))?.slice(12) ?? 0.1);

let failed = false;
console.log(`pixelmatch threshold ${tolerance}`);
for (const f of readdirSync(before).filter((f) => f.endsWith(".png")).sort()) {
  if (!existsSync(resolve(after, f))) {
    console.log(f, "MISSING in after");
    failed = true;
    continue;
  }
  const a = PNG.sync.read(readFileSync(resolve(before, f)));
  const b = PNG.sync.read(readFileSync(resolve(after, f)));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(f.padEnd(22), `SIZE DIFFERS ${a.width}x${a.height} -> ${b.width}x${b.height}`);
    failed = true;
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: tolerance });
  let minY = Infinity, maxY = -1, minX = Infinity, maxX = -1;
  if (n) {
    for (let y = 0; y < a.height; y++) for (let x = 0; x < a.width; x++) {
      const i = (y * a.width + x) * 4;
      // pixelmatch paints differing pixels (255,0,0); unchanged ones are faded grey
      if (diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0) {
        if (y < minY) minY = y; if (y > maxY) maxY = y; if (x < minX) minX = x; if (x > maxX) maxX = x;
      }
    }
  }
  console.log(f.padEnd(22), `${a.width}x${a.height}`.padEnd(11), `${n} px differ (${((n / (a.width * a.height)) * 100).toFixed(4)}%)`, n ? `box x ${minX}-${maxX}, y ${minY}-${maxY}` : "");
}

if (!existsSync(resolve(before, "metrics.json"))) process.exit(failed ? 1 : 0);
const mb = JSON.parse(readFileSync(resolve(before, "metrics.json"), "utf8"));
const ma = JSON.parse(readFileSync(resolve(after, "metrics.json"), "utf8"));
let worst = 0;
for (const key of Object.keys(mb)) {
  for (const k of Object.keys(mb[key])) {
    const d = Math.abs(mb[key][k] - ma[key][k]);
    worst = Math.max(worst, d);
    if (d > 1) {
      console.log("HEIGHT", key, k, mb[key][k], "->", ma[key][k]);
      failed = true;
    }
  }
}
console.log(`heights: ${Object.keys(mb).length} (lang x width) sets compared, worst difference ${worst.toFixed(2)} px`);
process.exit(failed ? 1 : 0);
