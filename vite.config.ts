import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin, type PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * Production only: puts the stylesheet inside index.html (<style>, in the place of the <link>) and drops the
 * .css file from the output. The CSS is ~11 KB compressed, so a separate request costs more (a round trip that
 * blocks the first paint) than the bytes it adds to the HTML. Same rules, same order, nothing duplicated.
 */
function inlineCss(): Plugin {
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
          const css = String(asset.source).replace(/<\/style/gi, '<\\/style')
          delete bundle[file]
          return `<style>${css}</style>`
        })
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
  plugins: [react(), tailwindcss(), inlineCss(), ...analyze],
  build: {
    // The Sentinel thumbnails are a few KB each: inlined as base64 they would swell the Projects chunk with bytes
    // that are only needed once the fan is on screen, and lose their lazy loading. They stay separate files.
    assetsInlineLimit: (file) => (file.endsWith('.webp') ? false : undefined),
  },
})
