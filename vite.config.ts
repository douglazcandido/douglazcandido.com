import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin, type PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DARK_THEME_ENABLED } from './src/config/theme.ts'

/**
 * Fills in the theme parts of index.html from the single switch in src/config/theme.ts (DARK_THEME_ENABLED), so the
 * <head> cannot disagree with the app:
 *  - <!--theme-head--> becomes the color-scheme and theme-color metas (light only, or light + dark variants);
 *  - __DARK_THEME_ENABLED__ (in the inline script that runs before the first paint) becomes true or false.
 * Runs in dev and in the build.
 */
function themeHead(): Plugin {
  const head = DARK_THEME_ENABLED
    ? [
        '<meta name="color-scheme" content="light dark" />',
        '<meta name="theme-color" content="#d6d9de" media="(prefers-color-scheme: light)" />',
        '<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />',
      ]
    : ['<meta name="color-scheme" content="light" />', '<meta name="theme-color" content="#d6d9de" />']
  return {
    name: 'theme-head',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const out = html.replaceAll('<!--theme-head-->', head.join('\n    ')).replaceAll('__DARK_THEME_ENABLED__', String(DARK_THEME_ENABLED))
        // A token left behind would break the inline script (a ReferenceError before the first paint): fail loudly.
        if (/__DARK_THEME_ENABLED__|<!--theme-head-->/.test(out)) throw new Error('[theme-head] a theme placeholder was not replaced.')
        return out
      },
    },
  }
}

/**
 * public/404.html is a plain static page, so it cannot know the hashed name Vite gives the font in /assets/. After
 * the bundle is written, this swaps the __FONT_URL__ placeholder for the real file (the one the site already ships:
 * nothing is downloaded or duplicated). Fails the build if the font or the placeholder goes missing.
 */
function notFoundFont(): Plugin {
  return {
    name: 'not-found-font',
    apply: 'build',
    writeBundle(options, bundle) {
      const page = resolve(options.dir ?? 'dist', '404.html')
      if (!existsSync(page)) return
      const font = Object.keys(bundle).find((name) => /^assets\/bricolage-grotesque-.*\.woff2$/.test(name))
      const html = readFileSync(page, 'utf8')
      if (!font || !html.includes('__FONT_URL__')) {
        this.error('[not-found-font] 404.html needs the __FONT_URL__ placeholder and the site font in the bundle.')
      }
      writeFileSync(page, html.replace('__FONT_URL__', `/${font}`))
    },
  }
}

/**
 * Production only: puts the stylesheet inside index.html (<style>, in the place of the <link>) and drops the
 * .css file from the output. The CSS is ~11 KB compressed, so a separate request costs more (a round trip that
 * blocks the first paint) than the bytes it adds to the HTML. Same rules, same order, nothing duplicated.
 *
 * It also guarantees that no JS chunk keeps pointing at the removed file (see the guard in generateBundle).
 */
function inlineCss(): Plugin {
  const removed = new Set<string>()
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return html
        return html.replace(/<link\b[^>]*\brel="stylesheet"[^>]*>/g, (tag) => {
          const href = /\bhref="([^"]+)"/.exec(tag)?.[1]
          const file = href && Object.keys(bundle).find((name) => href.endsWith(`/${name}`))
          const asset = file ? bundle[file] : undefined
          if (!file || !asset || asset.type !== 'asset' || !file.endsWith('.css')) return tag
          const css = String(asset.source)
            // With cssCodeSplit: false Vite leaves a placeholder comment (/*$vite$:1*/) at the end of the stylesheet.
            .replace(/\/\*\$vite\$:\d+\*\//g, '')
            .replace(/<\/style/gi, '<\\/style')
          removed.add(file)
          delete bundle[file]
          return `<style>${css}</style>`
        })
      },
    },
    // Guard, last step of the bundle (after Vite fills in the dynamic-import preload lists, __vite__mapDeps): once
    // the file is gone from dist, no chunk may still list it as a dependency. If one does, the browser gets a 404 and
    // Vite's preload helper rejects the import ("Unable to preload CSS"). The lists are positional indexes in
    // minified code, so rewriting them is brittle: fail the build loudly instead of shipping a broken chunk.
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        for (const file of removed) {
          const dangling = Object.values(bundle).filter((o) => o.type === 'chunk' && o.code.includes(file))
          if (dangling.length) {
            this.error(
              `[inline-css] ${file} was removed from the output but is still referenced by ${dangling.map((o) => o.fileName).join(', ')}. ` +
                'Keep build.cssCodeSplit = false so the stylesheet is not a dependency of any dynamic import.',
            )
          }
        }
      },
    },
  }
}

// Bundle analysis only on demand (`ANALYZE=1 npm run build`): it writes reports outside dist/,
// so nothing of it ever reaches the production output.
const analyze: PluginOption[] = process.env.ANALYZE
  ? [
      visualizer({ filename: process.env.ANALYZE_OUT ?? 'stats/stats.json', template: 'raw-data', gzipSize: true, brotliSize: true }),
      visualizer({ filename: (process.env.ANALYZE_OUT ?? 'stats/stats.json').replace(/\.json$/, '.html'), template: 'treemap', gzipSize: true, brotliSize: true }),
    ]
  : []

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), themeHead(), inlineCss(), notFoundFont(), ...analyze],
  build: {
    // A single stylesheet (it is inlined into index.html anyway). With per-chunk CSS splitting, the shared entry
    // chunk carries the CSS, and every dynamic import that depends on it lists that .css file in its
    // preload map; since the file is deleted from the output, the preload helper rejects with a 404.
    cssCodeSplit: false,
    // The Sentinel thumbnails are a few KB each: inlined as base64 they would swell the Projects chunk with bytes
    // that are only needed once the fan is on screen, and lose their lazy loading. They stay separate files.
    assetsInlineLimit: (file) => (file.endsWith('.webp') ? false : undefined),
  },
})
