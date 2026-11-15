/**
 * Visual regression capture: full-page screenshots (1440 and 393 px wide, PT / EN / ES, dark and light) plus the
 * layout numbers (hero, each section and page height at 320, 360, 393, 768, 900 and 1440 px).
 *
 *   node scripts/verify/capture.mjs <url> <outDir>
 *
 * Runs with reduced motion on, so the page is fully static (no reveal, no 3D: the tower is its SVG), which is
 * what makes two captures comparable pixel by pixel. Compare two outputs with scripts/verify/compare.mjs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const [url, outDir] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
// --only=es-dark-1440 : just the screenshots whose name contains the text (no height metrics)
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
if (!url || !outDir) throw new Error("usage: node scripts/verify/capture.mjs <url> <outDir>");
mkdirSync(outDir, { recursive: true });

const LANGS = ["pt", "en", "es"];
const THEMES = ["dark", "light"];
const SHOT_WIDTHS = [1440, 393];
const METRIC_WIDTHS = [320, 360, 393, 768, 900, 1440];
const SECTION_IDS = ["inicio", "sobre", "carreira", "projetos", "skills", "contato"];
const viewportHeight = (w) => (w >= 1024 ? 900 : 800);

const browser = await chromium.launch();

async function open(lang, theme, width) {
  const context = await browser.newContext({ viewport: { width, height: viewportHeight(width) }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  // Antivirus tools that inject scripts into local pages would add noise to every measurement.
  await context.route(/kaspersky-labs\.com/, (route) => route.abort());
  await context.addInitScript(([l, t]) => {
    localStorage.setItem("lang", l);
    localStorage.setItem("theme", t);
  }, [lang, theme]);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load" });
  // Every section has its heading (the lazy ones mount after the first paint), and the web font is in.
  await page.waitForFunction((ids) => ids.every((id) => id === "inicio" || document.querySelector(`#${id} h2`)), SECTION_IDS, { timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  return { context, page };
}

const metrics = {};
for (const lang of LANGS) {
  for (const theme of THEMES) {
    for (const width of SHOT_WIDTHS) {
      if (only && !`${lang}-${theme}-${width}`.includes(only)) continue;
      const { context, page } = await open(lang, theme, width);
      await page.screenshot({ path: resolve(outDir, `${lang}-${theme}-${width}.png`), fullPage: true });
      await context.close();
      console.log("shot", lang, theme, width);
    }
  }
  // Heights do not depend on the theme: measured once per language.
  for (const width of only ? [] : METRIC_WIDTHS) {
    const { context, page } = await open(lang, "dark", width);
    metrics[`${lang}-${width}`] = await page.evaluate((ids) => {
      const out = { page: document.documentElement.scrollHeight };
      for (const id of ids) out[id] = +document.getElementById(id).getBoundingClientRect().height.toFixed(2);
      return out;
    }, SECTION_IDS);
    await context.close();
  }
}
if (!only) writeFileSync(resolve(outDir, "metrics.json"), JSON.stringify(metrics, null, 1));
await browser.close();
console.log("done ->", outDir);
