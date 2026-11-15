/**
 * Main-thread blocking during load, measured the way Lighthouse's TBT does but on a longer window: long tasks
 * (over 50 ms) after the first contentful paint, with the CPU slowed down.
 *
 *   node scripts/verify/tbt.mjs <url> [--cpu=4] [--runs=5] [--mobile] [--window=10000]
 *
 * Lighthouse stops counting when the page looks interactive, which can be before the 3D tower starts up, so
 * this reports everything in the first `window` ms: TBT, the number of long tasks and the longest one, as the
 * median of the runs, plus the durations of the tasks of the median run. Entries named "tower:*" in the
 * performance timeline (if the build has them) are printed too.
 */
import { chromium } from "playwright";

const url = process.argv.slice(2).find((a) => !a.startsWith("--"));
const arg = (n, d) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? d;
const cpu = +arg("cpu", 4);
const runs = +arg("runs", 5);
const windowMs = +arg("window", 10000);
const mobile = process.argv.includes("--mobile");
if (!url) throw new Error("usage: node scripts/verify/tbt.mjs <url>");

const browser = await chromium.launch();
const median = (a) => [...a].sort((x, y) => x - y)[a.length >> 1];
const all = [];
for (let i = 0; i < runs; i++) {
  const context = await browser.newContext({ viewport: mobile ? { width: 393, height: 852 } : { width: 1440, height: 900 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  await context.route(/kaspersky-labs\.com/, (r) => r.abort());
  await context.addInitScript(() => {
    window.__long = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push([e.startTime, e.duration]); }).observe({ type: "longtask", buffered: true });
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(windowMs);
  const r = await page.evaluate(() => ({
    long: window.__long,
    fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0,
    marks: performance.getEntriesByType("mark").filter((m) => m.name.startsWith("tower:")).map((m) => [m.name, Math.round(m.startTime)]),
    live: document.querySelector('.hero-tower[data-live="true"]') !== null,
  }));
  const tasks = r.long.filter(([s]) => s >= r.fcp);
  const tbt = tasks.reduce((s, [, d]) => s + Math.max(0, d - 50), 0);
  all.push({ tbt, count: tasks.length, max: Math.max(0, ...tasks.map(([, d]) => d)), tasks: tasks.map(([s, d]) => `${Math.round(s)}ms:${Math.round(d)}`), marks: r.marks, live: r.live });
  await context.close();
}
const med = all.slice().sort((a, b) => a.tbt - b.tbt)[all.length >> 1];
console.log(`${url}  cpu x${cpu}${mobile ? " mobile" : ""}  ${runs} runs`);
console.log(`  TBT median ${median(all.map((a) => a.tbt)).toFixed(0)} ms (runs: ${all.map((a) => a.tbt.toFixed(0)).join(", ")})`);
console.log(`  long tasks median ${median(all.map((a) => a.count))}, longest median ${median(all.map((a) => a.max)).toFixed(0)} ms, tower live in ${all.filter((a) => a.live).length}/${runs} runs`);
console.log(`  median run tasks: ${med.tasks.join("  ")}`);
if (med.marks.length) console.log(`  marks: ${med.marks.map((m) => m.join("=")).join("  ")}`);
await browser.close();
