/**
 * Runs `run` once the first paint is out and the browser has nothing better to do (idle time, with a
 * fallback timer where `requestIdleCallback` does not exist). Returns the function that cancels it.
 */
export function afterFirstPaint(run: () => void, timeout = 1000): () => void {
  let cancelled = false;
  let frame = 0;
  let timer = 0;
  let idle = 0;
  const go = () => {
    if (!cancelled) run();
  };
  frame = requestAnimationFrame(() => {
    timer = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(go, { timeout });
      else timer = window.setTimeout(go, 50);
    }, 0);
  });
  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
    window.clearTimeout(timer);
    if (idle) window.cancelIdleCallback(idle);
  };
}
