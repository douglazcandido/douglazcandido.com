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

## Share image

The social preview (`public/og-image-en-light.png`, 1200x630) is generated from the light theme tokens in `src/index.css` and the hero tower spec:

```bash
node scripts/generate-og-image.mjs
```

It needs Playwright's Chromium (`npx playwright install chromium`) and network access for the web font. When you redo the image, save it under a new file name and update `og:image` / `twitter:image` in `index.html`, so crawlers don't serve a cached copy.

## Project structure

```
src/
  sections/    page sections (Hero, About, Career, Projects...)
  components/  reusable components
  i18n/        copy in pt, en and es
  data/        project data and images
```

The site's copy lives in `src/i18n/`. When you change a text, update all three languages.
