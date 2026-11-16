/**
 * Behavior checks against a running build (any URL: `vite preview`, a static server, the dev server).
 *
 *   node scripts/verify/behavior.mjs <url> [outFile.json]
 *
 * In PT-BR, EN and ES: menu anchors (also clicked right after load, before the lazy sections have arrived), career
 * tabs, "see more", the phone menu, the tower's hover and touch, the Sentinel fan and viewer, theme and language
 * switches, and the layout shift (CLS) over the load and a full scroll. Plus the tower rule: gone at 340 px (and
 * Three.js never requested), there at 360 px. The anchor positions are written to the JSON file so two builds can
 * be compared (they have to land on the same pixel).
 */
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const [url, outFile] = process.argv.slice(2);
if (!url) throw new Error("usage: node scripts/verify/behavior.mjs <url> [outFile.json]");

const LANGS = ["en", "pt", "es"];
const LANG_NAME = { en: "English", pt: "Português (Brasil)", es: "Español" };
const SECTIONS = ["sobre", "carreira", "projetos", "skills", "contato"];

const browser = await chromium.launch();
const results = [];
async function guarded(name, fn) {
  try {
    await fn();
  } catch (e) {
    check(name + " (crashed)", false, String(e.message ?? e).split(/\r?\n/)[0].slice(0, 220));
  }
}
const anchors = {};
let failures = 0;

function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}

const CLS_PROBE = () => {
  window.__cls = 0;
  window.__shifts = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__cls += e.value;
      window.__shifts.push({ value: e.value, at: Math.round(e.startTime), nodes: e.sources.map((s) => s.node?.nodeName + "." + (s.node?.className || "").toString().slice(0, 40)) });
    }
  }).observe({ type: "layout-shift", buffered: true });
};

async function newPage({ width = 1440, height = 900, lang = "en", theme = "dark", mobile = false, reducedMotion = "no-preference" } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: mobile ? 2 : 1,
    reducedMotion,
  });
  await context.route(/kaspersky-labs\.com/, (route) => route.abort());
  await context.addInitScript(
    ([l, t]) => {
      localStorage.setItem("lang", l);
      localStorage.setItem("theme", t);
    },
    [lang, theme],
  );
  await context.addInitScript(CLS_PROBE);
  const page = await context.newPage();
  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return { context, page, requests, errors };
}

const allSectionsIn = (page) =>
  page.waitForFunction((ids) => ids.every((id) => document.querySelector(`#${id} h2`)), SECTIONS, { timeout: 20000 });

/** Waits until the page has stopped scrolling. */
async function settle(page, quiet = 500, max = 8000) {
  let last = await page.evaluate(() => scrollY);
  let since = Date.now();
  const start = Date.now();
  while (Date.now() - since < quiet && Date.now() - start < max) {
    await page.waitForTimeout(80);
    const now = await page.evaluate(() => scrollY);
    if (now !== last) {
      last = now;
      since = Date.now();
    }
  }
  return last;
}

const topOf = (page, id) => page.evaluate((i) => +document.getElementById(i).getBoundingClientRect().top.toFixed(1), id);

/* ------------------------------------------------------------------------------------------------ */
for (const lang of LANGS) {
  console.log(`\n=== ${lang.toUpperCase()} ===`);

  /* ---- desktop: anchors after everything is loaded ---- */
  await guarded("block 1", async () => {
    const { context, page, errors } = await newPage({ lang });
    await page.goto(url, { waitUntil: "load" });
    await allSectionsIn(page);
    await page.waitForTimeout(800);
    const tops = {};
    for (const id of SECTIONS) {
      await page.locator(`#site-header a[href="#${id}"]`).first().click();
      const y = await settle(page);
      tops[id] = { scrollY: Math.round(y), top: await topOf(page, id) };
    }
    anchors[`${lang}-loaded`] = tops;
    const bad = SECTIONS.filter((id) => Math.abs(tops[id].top) > 2 && id !== "contato");
    check(`[${lang}] menu anchors land on their section`, bad.length === 0, JSON.stringify(tops));
    check(`[${lang}] no console / page errors (desktop)`, errors.length === 0, errors.join(" | ").slice(0, 200));
    await context.close();
  });

  /* ---- desktop: anchor clicked right after load, before the lazy sections have arrived ---- */
  for (const target of ["projetos", "skills", "contato"]) {
    const { context, page } = await newPage({ lang });
    await page.goto(url, { waitUntil: "commit" });
    const link = page.locator(`#site-header a[href="#${target}"]`).first();
    await link.waitFor({ state: "visible" });
    const loadedAtClick = await page.evaluate(() => !!document.querySelector("#carreira h2"));
    await link.click();
    await allSectionsIn(page);
    await settle(page, 900, 12000);
    const top = await topOf(page, target);
    const y = await page.evaluate(() => Math.round(scrollY));
    anchors[`${lang}-early-${target}`] = { scrollY: y, top, careerAlreadyMounted: loadedAtClick };
    // Contact is shorter than a screen when the page is at the bottom, so it may rest a little below 0.
    const ok = target === "contato" ? top >= -2 && top < 400 : Math.abs(top) <= 2;
    check(`[${lang}] anchor "${target}" clicked right after load ends on its section`, ok, `top ${top}, scrollY ${y}, career already mounted at click: ${loadedAtClick}`);
    await context.close();
  }

  /* ---- desktop: CLS over load and a full scroll; theme, language, tower, fan ---- */
  await guarded("block 2", async () => {
    const { context, page } = await newPage({ lang });
    await page.goto(url, { waitUntil: "load" });
    await allSectionsIn(page);
    await page.waitForTimeout(1200);
    const afterLoad = await page.evaluate(() => window.__cls);
    // full scroll with the wheel, top to bottom
    const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    await page.mouse.move(700, 450);
    for (let y = 0; y < total; y += 600) {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(110);
    }
    await settle(page, 700, 10000);
    const afterScroll = await page.evaluate(() => ({ cls: window.__cls, shifts: window.__shifts }));
    check(`[${lang}] CLS is 0 over the load`, afterLoad === 0, String(afterLoad));
    check(`[${lang}] CLS is 0 over a full scroll`, afterScroll.cls === 0, `${afterScroll.cls} ${afterScroll.cls ? JSON.stringify(afterScroll.shifts) : ""}`);
    await page.evaluate(() => scrollTo(0, 0));
    await settle(page);

    // theme
    // DARK-THEME-DISABLED: the context saves theme "dark" (see newPage); the page must ignore it and have no toggle.
    // With the dark theme re-enabled (src/config/theme.ts) this check is expected to fail: restore the toggle test then.
    const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    const toggles = await page.locator("#site-header button:not([aria-pressed]):not([aria-expanded])").count();
    check(`[${lang}] light theme only: data-theme is light and there is no theme toggle`, theme === "light" && toggles === 0, `data-theme ${theme}, toggles ${toggles}`);

    // language switch (also re-renders the sections that arrived lazily)
    const other = LANGS.find((l) => l !== lang);
    const titleBefore = await page.locator("#carreira h2").innerText();
    await page.locator(`#site-header button[aria-label="${LANG_NAME[other]}"]`).click();
    await page.waitForTimeout(700);
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    const titleAfter = await page.locator("#carreira h2").innerText();
    check(`[${lang}] language switch to ${other} updates <html lang> and the lazy sections`, htmlLang.startsWith(other) && titleBefore !== titleAfter, `${htmlLang}: "${titleBefore}" -> "${titleAfter}"`);
    await context.close();
  });

  /* ---- desktop: Sentinel fan and viewer ---- */
  await guarded("block 3", async () => {
    const { context, page } = await newPage({ lang });
    await page.goto(url, { waitUntil: "load" });
    await allSectionsIn(page);
    await page.locator("#site-header a[href='#projetos']").first().click();
    await settle(page);
    // The Sentinel is not the project open by default: open it from the list (the fan only turns while its project is open).
    const sentinel = await page.evaluate(() => [...document.querySelectorAll('[id^="project-panel-"]')].findIndex((p) => p.querySelector('button[class*="group/thumb"]')));
    await page.locator(`#project-tab-${sentinel}`).click();
    await page.mouse.move(5, 450);
    await page.waitForTimeout(1000);
    const thumbs = page.locator("#projetos button.group\\/thumb");
    const count = await thumbs.count();
    // The fan is rendered twice (list and panel); the visible one is the one at lg+.
    const visible = page.locator("#projetos button.group\\/thumb:visible");
    check(`[${lang}] Sentinel fan has 8 visible thumbnails`, (await visible.count()) === 8, `${count} in DOM, ${await visible.count()} visible`);
    const t0 = await visible.first().evaluate((el) => el.style.translate);
    await page.waitForTimeout(5600);
    const t1 = await visible.first().evaluate((el) => el.style.translate);
    check(`[${lang}] the fan rotates by itself`, t0 !== t1, `${t0} -> ${t1}`);
    await visible.nth(2).evaluate((el) => el.click());
    const dialog = page.getByRole("dialog");
    await dialog.waitFor({ state: "visible", timeout: 8000 });
    const img = dialog.locator("img");
    await page.waitForFunction(() => document.querySelector("[role=dialog] img")?.complete && document.querySelector("[role=dialog] img").naturalWidth > 0);
    const alt0 = await img.getAttribute("alt");
    const shown = await img.evaluate((el) => ({ w: el.clientWidth, h: el.clientHeight, nw: el.naturalWidth, src: el.currentSrc.split("/").pop() }));
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);
    const alt1 = await dialog.locator("img").getAttribute("alt");
    check(`[${lang}] viewer opens, loads the image and moves with the arrow key`, !!alt0 && alt0 !== alt1, `${alt0?.slice(0, 30)} -> ${alt1?.slice(0, 30)}; shown ${JSON.stringify(shown)}`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    check(`[${lang}] viewer closes with Escape`, (await dialog.count()) === 0);
    await context.close();
  });
}

/* ---- tower: hover (desktop) ---- */
await guarded("block 4", async () => {
  const { context, page, requests } = await newPage({ lang: "en" });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector('.hero-tower[data-live="true"]', { timeout: 30000 }).catch(() => {});
  const live = await page.locator('.hero-tower[data-live="true"]').count();
  check("[tower] desktop: the 3D scene goes live (canvas drawn)", live === 1 && (await page.locator(".hero-tower__stage > canvas").count()) === 1, `requests for tower chunk: ${requests.filter((r) => /tower3d/.test(r)).length}`);
  const box = await page.locator(".hero-tower__stage").boundingBox();
  let label = "";
  if (box) {
    outer: for (let fy = 0.2; fy <= 0.8; fy += 0.03) {
      for (const fx of [0.5, 0.4, 0.6]) {
        await page.mouse.move(box.x + box.width * fx, box.y + box.height * fy, { steps: 2 });
        await page.waitForTimeout(160);
        label = await page.locator('.hero-tower__label[data-on="true"]').innerText().catch(() => "");
        if (label.trim()) break outer;
      }
    }
  }
  check("[tower] desktop: hovering an opening shows its label", !!label.trim(), label.trim());
  await context.close();
});

/* ---- tower: touch (compact), the 340 / 360 rule ---- */
for (const width of [340, 360, 393]) {
  const { context, page, requests } = await newPage({ width, height: 800, mobile: true, lang: "en" });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(width >= 360 ? 5000 : 3500);
  const present = (await page.locator(".hero-tower").count()) > 0;
  const chunk = requests.filter((r) => /tower3d/.test(r)).length;
  if (width < 350) check(`[tower] ${width}px: no tower and Three.js never requested`, !present && chunk === 0, `present ${present}, requests ${chunk}`);
  else {
    await page.waitForSelector('.hero-tower[data-live="true"]', { timeout: 30000 }).catch(() => {});
    const live = (await page.locator('.hero-tower[data-live="true"]').count()) === 1;
    check(`[tower] ${width}px: tower present and 3D live`, present && live && chunk >= 1, `present ${present}, live ${live}, requests ${chunk}`);
    if (width === 393) {
      const box = await page.locator(".hero-tower__stage").boundingBox();
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height * 0.5);
      await page.waitForTimeout(500);
      const text = await page.locator('.hero-tower__label[data-on="true"]').innerText().catch(() => "");
      check("[tower] 393px: a tap on the tower opens an opening and shows its label", !!text.trim(), text.trim());
    }
  }
  await context.close();
}

/* ---- phone: menu, career tabs, "see more", CLS ---- */
for (const lang of LANGS) {
  const { context, page, errors } = await newPage({ width: 393, height: 852, mobile: true, lang });
  await page.goto(url, { waitUntil: "load" });
  await allSectionsIn(page);
  await page.waitForTimeout(1000);
  const afterLoad = await page.evaluate(() => window.__cls);
  check(`[${lang}] phone: CLS is 0 over the load`, afterLoad === 0, String(afterLoad));

  const menu = page.locator('button[aria-controls="menu-overlay"]');
  await menu.click();
  await page.waitForTimeout(900);
  const open = await page.evaluate(() => !document.getElementById("menu-overlay").hasAttribute("inert") && document.querySelector('button[aria-controls="menu-overlay"]').getAttribute("aria-expanded") === "true");
  check(`[${lang}] phone: the full-screen menu opens`, open);
  // DARK-THEME-DISABLED: no theme control in the menu; the language buttons stay (44 px touch targets).
  const prefs = await page.evaluate(() => [...document.querySelectorAll("#menu-overlay button")].map((b) => ({ pressed: b.hasAttribute("aria-pressed"), w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) })));
  check(`[${lang}] phone: the menu has only the 3 language buttons (44 px) and no theme control`, prefs.length === 3 && prefs.every((p) => p.pressed && p.w >= 44 && p.h >= 44), JSON.stringify(prefs));
  await page.locator("#menu-overlay a[href='#carreira']").click();
  await settle(page, 700, 10000);
  const closed = await page.evaluate(() => document.querySelector('button[aria-controls="menu-overlay"]').getAttribute("aria-expanded") === "false");
  const top = await topOf(page, "carreira");
  anchors[`${lang}-phone-carreira`] = { top };
  check(`[${lang}] phone: a menu link closes the menu and lands on the section`, closed && Math.abs(top) <= 2, `closed ${closed}, top ${top}`);

  const tabs = page.getByRole("tab");
  check(`[${lang}] phone: career has 3 tabs`, (await tabs.count()) === 3);
  await tabs.nth(1).click();
  const selected = await tabs.nth(1).getAttribute("aria-selected");
  const panelHidden = await page.evaluate(() => [...document.querySelectorAll("[role=tabpanel]")].map((p) => p.hidden));
  check(`[${lang}] phone: career tabs switch panel`, selected === "true" && panelHidden.filter((h) => !h).length === 1 && panelHidden[1] === false, JSON.stringify(panelHidden));
  await tabs.nth(0).click();
  const more = page.locator("[role=tabpanel]:not([hidden]) button[aria-expanded]").first();
  const exp0 = await more.getAttribute("aria-expanded");
  await more.click();
  await page.waitForTimeout(300);
  const exp1 = await more.getAttribute("aria-expanded");
  check(`[${lang}] phone: "see more" expands the topics`, exp0 === "false" && exp1 === "true", `${exp0} -> ${exp1}`);

  // full scroll on the phone: CLS stays 0
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y < total; y += 500) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(90);
  }
  await settle(page, 600, 8000);
  const cls = await page.evaluate(() => ({ v: window.__cls, s: window.__shifts }));
  check(`[${lang}] phone: CLS is 0 over a full scroll`, cls.v === 0, `${cls.v} ${cls.v ? JSON.stringify(cls.s) : ""}`);
  check(`[${lang}] no console / page errors (phone)`, errors.length === 0, errors.join(" | ").slice(0, 200));
  await context.close();
}

await browser.close();
if (outFile) writeFileSync(outFile, JSON.stringify({ anchors, results }, null, 1));
console.log(`\n${results.length - failures}/${results.length} checks passed`);
process.exit(failures ? 1 : 0);
