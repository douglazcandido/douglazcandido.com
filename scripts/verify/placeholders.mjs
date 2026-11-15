/**
 * How close is each lazy-section placeholder to the real section? For several widths and the three languages it
 * loads the page twice: once with the lazy chunks blocked (the placeholders stay), once normally (the sections
 * mount), and prints the height of each wrapper in both states.
 *
 *   node scripts/verify/placeholders.mjs <url>
 *
 * Exits 1 when any placeholder is more than 2 px away from the real section.
 */
import { chromium } from "playwright";

const url = process.argv[2];
if (!url) throw new Error("usage: node scripts/verify/placeholders.mjs <url>");

const WIDTHS = [320, 360, 375, 390, 393, 402, 412, 414, 430, 480, 600, 768, 820, 900, 1024, 1180, 1280, 1440, 1536, 1920, 2200];
const IDS = ["carreira", "projetos", "skills", "contato"];
const browser = await chromium.launch();

async function heights(lang, width, block) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  await context.addInitScript((l) => localStorage.setItem("lang", l), lang);
  const page = await context.newPage();
  if (block) await page.route(/\/assets\/(Career|ProjectsList|Skills|Contact)-.*\.js/, (route) => route.abort());
  await page.goto(url, { waitUntil: "load" });
  if (block) await page.waitForTimeout(2500);
  else await page.waitForFunction((ids) => ids.every((id) => document.querySelector(`#${id} h2`)), IDS, { timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const out = await page.evaluate((ids) => ids.map((id) => document.getElementById(id).getBoundingClientRect().height), IDS);
  await context.close();
  return out;
}

let worst = 0;
let over = 0;
console.log("lang width   " + IDS.map((i) => i.padEnd(16)).join(""));
for (const lang of ["en", "pt", "es"]) {
  for (const width of WIDTHS) {
    const ph = await heights(lang, width, true);
    const real = await heights(lang, width, false);
    const diffs = ph.map((h, i) => h - real[i]);
    worst = Math.max(worst, ...diffs.map(Math.abs));
    over += diffs.filter((d) => Math.abs(d) > 2).length;
    console.log(`${lang}   ${String(width).padEnd(6)} ` + diffs.map((d, i) => `${ph[i].toFixed(0)}/${real[i].toFixed(0)} (${d >= 0 ? "+" : ""}${d.toFixed(1)})`.padEnd(16)).join(""));
  }
}
await browser.close();
console.log(`\nworst difference ${worst.toFixed(1)} px; ${over} placeholder(s) off by more than 2 px`);
process.exit(over ? 1 : 0);
