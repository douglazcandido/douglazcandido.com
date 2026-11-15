/**
 * Captures the Sentinel fan (thumbnails) and the full-screen viewer at 1x and 2x pixel density, at 1440x900,
 * for before/after comparison (compare.mjs) and prints which image file the browser picked and what it downloaded.
 *
 *   node scripts/verify/viewer.mjs <url> <outDir>
 */
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const [url, outDir] = process.argv.slice(2);
if (!url || !outDir) throw new Error("usage: node scripts/verify/viewer.mjs <url> <outDir>");
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

for (const [name, width, height, dpr] of [["1440-dpr1", 1440, 900, 1], ["1440-dpr2", 1440, 900, 2], ["1920-dpr1", 1920, 1080, 1], ["393-dpr3", 393, 852, 3]]) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: "reduce", isMobile: width < 500, hasTouch: width < 500 });
  await context.route(/kaspersky-labs\.com/, (r) => r.abort());
  await context.addInitScript(() => { localStorage.setItem("lang", "en"); localStorage.setItem("theme", "dark"); });
  const page = await context.newPage();
  const images = [];
  page.on("response", (r) => /\.(png|webp|avif)(\?|$)/.test(r.url()) && images.push(`${r.url().split("/").pop()} ${(+r.headers()["content-length"] / 1024 || 0).toFixed(0)}KB`));
  await page.goto(url, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("#projetos h2"));
  await page.evaluate(() => document.getElementById("projetos").scrollIntoView());
  await page.waitForTimeout(600);
  const sentinel = await page.evaluate(() => [...document.querySelectorAll('[id^="project-panel-"]')].findIndex((p) => p.querySelector('button[class*="group/thumb"]')));
  if (width >= 1024) {
    await page.locator(`#project-tab-${sentinel}`).click();
    await page.mouse.move(5, 450);
    await page.waitForTimeout(1200);
    const fan = page.locator("#projetos button[class*='group/thumb']:visible").first().locator("xpath=ancestor::div[contains(@class,'--step')][1]");
    await fan.screenshot({ path: resolve(outDir, `fan-${name}.png`) });
  } else {
    await page.locator(`#project-tab-${sentinel}`).click();
    await page.waitForTimeout(1200);
  }
  const thumbsLoaded = images.length;
  const thumbs = await page.locator("#projetos button[class*='group/thumb']").count();
  if (width >= 1024) {
    await page.locator("#projetos button[class*='group/thumb']:visible").nth(2).evaluate((el) => el.click());
    await page.waitForFunction(() => { const i = document.querySelector("[role=dialog] img"); return i?.complete && i.naturalWidth > 0; });
    await page.waitForTimeout(1200);
    const shown = await page.evaluate(() => { const i = document.querySelector("[role=dialog] img"); const r = i.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), file: i.currentSrc.split("/").pop(), natural: i.naturalWidth }; });
    await page.screenshot({ path: resolve(outDir, `viewer-${name}.png`) });
    console.log(name.padEnd(10), "viewer shows", JSON.stringify(shown));
  }
  console.log(name.padEnd(10), `thumbnail files fetched (${thumbsLoaded}):`, images.slice(0, thumbsLoaded).join(", ") || "none", `| thumbs in DOM: ${thumbs}`);
  console.log(name.padEnd(10), "all image requests:", images.length, "total", images.reduce((s, x) => s + parseInt(x.split(" ").pop()), 0), "KB");
  await context.close();
}
await browser.close();
