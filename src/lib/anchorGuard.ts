/**
 * Keeps an in-page link on target while the sections below the first screen are still arriving.
 *
 * The placeholders hold each section's measured height, so a link taken before a section has loaded already
 * lands in the right place. If a section turns out a few pixels different from its placeholder (a font that
 * wraps another way, a window resized in between), this puts the page back on the section the visitor asked
 * for, once the scroll has settled. It lets go the moment the visitor scrolls on their own.
 */
// Id of the section the page is heading for (not the element: a section swaps its placeholder for a new element).
let target: string | null = null;
let releaseTimer = 0;
let lastScroll = 0;

const RELEASE_MS = 8000;
const QUIET_MS = 160;

function follow(id: string | null): void {
  target = id;
  window.clearTimeout(releaseTimer);
  if (id) releaseTimer = window.setTimeout(() => (target = null), RELEASE_MS);
}

const idOf = (hash: string): string | null => {
  const id = hash.length > 1 ? decodeURIComponent(hash.slice(1)) : "";
  return id && document.getElementById(id) ? id : null;
};

/** Starts watching links and the address hash. Returns the stop function. */
export function guardAnchors(): () => void {
  follow(idOf(location.hash));

  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
    follow(link ? idOf(link.getAttribute("href") ?? "") : null);
  };
  const onScroll = () => {
    lastScroll = performance.now();
  };
  // The visitor takes over: wheel, touch and keys are theirs. (Scroll events alone are not: the page's own
  // smooth scrolling produces them too.)
  const release = () => follow(null);

  document.addEventListener("click", onClick);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", release, { passive: true });
  window.addEventListener("touchstart", release, { passive: true });
  window.addEventListener("keydown", release);
  return () => {
    document.removeEventListener("click", onClick);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("wheel", release);
    window.removeEventListener("touchstart", release);
    window.removeEventListener("keydown", release);
    window.clearTimeout(releaseTimer);
  };
}

/** Called after a section has mounted: if the page was heading for an anchor, settle on it. */
export function settleOnAnchor(): void {
  const id = target;
  if (!id) return;
  let tries = 0;
  const check = () => {
    if (target !== id) return;
    if (performance.now() - lastScroll < QUIET_MS && tries++ < 20) {
      window.setTimeout(check, QUIET_MS);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const delta = el.getBoundingClientRect().top;
    if (Math.abs(delta) > 1) window.scrollTo({ top: window.scrollY + delta, behavior: "instant" });
  };
  window.setTimeout(check, QUIET_MS);
}
