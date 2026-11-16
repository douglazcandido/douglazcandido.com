/**
 * DARK-THEME-DISABLED: the dark theme is switched off, temporarily. This is the ONE place to bring it back:
 * set the constant to `true` and rebuild.
 *
 * While it is `false`:
 *  - the theme toggle is not rendered (header and phone menu);
 *  - the saved theme and the OS preference (prefers-color-scheme) are ignored, and a saved "dark" is removed;
 *  - <html> always carries data-theme="light" (also set by the inline script of index.html, see vite.config.ts);
 *  - the 3D tower and its SVG fallback always use the light colors.
 *
 * The dark CSS rules (the :root defaults in src/index.css) and the toggle code stay in the project, inert.
 * vite.config.ts imports this file too, to fill in the <head> of index.html.
 */
export const DARK_THEME_ENABLED = false
