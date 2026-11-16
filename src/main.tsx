import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LanguageProvider from './i18n/LanguageProvider.tsx'
import { enforceTheme } from './lib/theme.ts'

// DARK-THEME-DISABLED: pins the light theme (and drops a saved "dark"); a no-op once the dark theme is re-enabled.
enforceTheme()

// Stale deploy guard: a cached (old) HTML/entry points to chunk files that a newer deploy has already removed, so a
// dynamic import fails ("vite:preloadError"). Reloading once fetches the fresh HTML and its chunks. The timestamp in
// sessionStorage stops a reload loop: if it fails again within the window (or storage is unavailable, so we cannot
// remember the attempt), we only log the error and leave the page alone.
const RELOAD_KEY = 'preload-error-reload-at'
const RELOAD_WINDOW_MS = 60_000

window.addEventListener('vite:preloadError', (event) => {
  console.error('Failed to load a page chunk:', (event as Event & { payload?: unknown }).payload)
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0
    if (Date.now() - last < RELOAD_WINDOW_MS) return
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
    window.location.reload()
  } catch {
    // sessionStorage blocked: no way to prevent a loop, so do not reload.
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
