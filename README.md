# douglazcandido.com

My personal portfolio: about me, career, projects, tech stack and contact, in Portuguese, English and Spanish.

## Tech stack

- React 19 and TypeScript
- Vite
- Tailwind CSS v4
- Lenis (smooth scrolling)

## Getting started

```bash
npm install
npm run dev
```

The site opens at `http://localhost:5173`.

## Scripts

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Starts the development server        |
| `npm run build`   | Type-checks and builds into `dist/`  |
| `npm run preview` | Serves the production build locally  |
| `npm run lint`    | Runs the linter                      |
| `npm run cf:dev`  | Serves `dist/` locally the way Cloudflare does (`wrangler dev`) |
| `npm run cf:deploy` | `wrangler deploy`; meant for Workers Builds only, not for running by hand |

## Deployment

The site is published as static files on Cloudflare Workers Static Assets, built by Workers Builds from the `main` branch (`npm run build`, output in `dist/`, Node 22 from `.node-version`). There is no Worker script.

- `wrangler.jsonc` names the project, points the assets at `./dist` and turns on `404-page`: the site has no path routes (only `#anchors`), so an unknown address gets a real 404 with `dist/404.html` instead of the home page.
- `public/_headers` is copied to `dist/` by the build: one-year `immutable` cache for the hashed files in `/assets/`, and security headers on everything. HTML and the other files keep the default (revalidated on every visit).
- `public/404.html` is a tiny standalone page (PT, EN or ES, from the language saved by the app). The build points it at the site's own font file.

To try it locally, run `npm run build` and then `npm run cf:dev` (it serves `dist/` on `http://localhost:8787`, no deploy, no login).

## Theme

The dark theme is temporarily disabled: the site is light only, the toggle is hidden and a saved or OS-level dark preference is ignored.
To bring it back, set `DARK_THEME_ENABLED = true` in `src/config/theme.ts` (the one switch, also used to build `index.html`) and rebuild.
Search for `DARK-THEME-DISABLED` to see every place that reacts to it.

## Share image

The social preview (`public/og-image-en-light-v2.png`, 1200x630) is generated from the light theme tokens in `src/index.css` and a capture of the real hero tower (the script starts the site, freezes the 3D scene and screenshots it):

```bash
node scripts/generate-og-image.mjs
```

It needs Playwright's Chromium (`npx playwright install chromium`); the font is read from `src/assets/fonts`, so no network access is needed. When you redo the image, save it under a new file name and update `og:image` / `twitter:image` in `index.html`, so crawlers don't serve a cached copy.

## Fonts

Bricolage Grotesque is self-hosted: one variable WOFF2 (`opsz` and `wght` axes, latin subset, which covers PT, EN and ES) in `src/assets/fonts`, declared in `src/index.css`, with its license (SIL OFL 1.1) and notes next to it. The site makes no request to Google Fonts or any other third party. Vite hashes the file into `/assets/`, and `index.html` preloads it.

## Performance notes

- **CSS** is inlined into `index.html` at build time (`inlineCss` in `vite.config.ts`): no render-blocking request.
- **Code splitting:** the first screen (nav, hero, about) is the main chunk. Career, Projects, Stack and Contact are separate chunks (`src/lib/lazySections.ts`), fetched right after the first paint in idle time, not when they scroll into view. Until a chunk is in, `LazySection` keeps its place with an empty block as tall as the real section (language and width aware). Lenis, the screenshot viewer and Three.js are loaded the same way, on their own.
- **Placeholder heights** come from `src/lib/sectionHeights.generated.ts`, measured on the real page. Run `npm run build && node scripts/measure-sections.mjs` again whenever the copy or the layout of those four sections changes.
- **Sentinel screenshots:** the 1920x1200 PNG originals live in `assets-src/sentinel/` (not part of the build). `node scripts/optimize-sentinel.mjs` writes the WebP variants the site uses to `src/assets/projects/sentinel/` (needs `sharp`, a dev dependency).
- **Bundle analysis:** `ANALYZE=1 npm run build` writes `stats/stats.json` and `stats/stats.html` (not part of `dist/`).
- **Checks** (Playwright, against any running build): `scripts/verify/` has the visual capture and comparison, the behavior checks, the placeholder accuracy check and a blocking-time measurement. Each file starts with a comment on how to run it.

## Project structure

```
src/
  sections/    page sections (Hero, About, Career, Projects...)
  components/  reusable components
  i18n/        copy in pt, en and es
  data/        project data and images
```

The site's copy lives in `src/i18n/`. When you change a text, update all three languages.
