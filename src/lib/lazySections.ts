import type { ComponentType } from "react";
import { afterFirstPaint } from "./idle";

/**
 * The sections below the first screen (career, projects, stack, contact) are separate chunks. They are not
 * fetched when they scroll into view but right after the first paint, in idle time, so by the time anyone
 * scrolls or taps a menu link they are already there (see LazySection for what holds their place meanwhile).
 */
export type LazyKey = "career" | "projects" | "skills" | "contact";

/** A lazy section gets the id of its anchor (the placeholder it replaces carried it too). */
export type SectionComponent = ComponentType<{ id?: string }>;

type Loader = () => Promise<{ default: SectionComponent }>;

const loaders: Record<LazyKey, Loader> = {
  career: () => import("../sections/Career"),
  projects: () => import("../sections/ProjectsList"),
  skills: () => import("../sections/Skills"),
  contact: () => import("../sections/Contact"),
};
const ORDER: readonly LazyKey[] = ["career", "projects", "skills", "contact"];

const ready = new Map<LazyKey, SectionComponent>();
const listeners = new Set<() => void>();
let started = false;
/** Set on the first sign of the visitor moving on the page: from then on there is no waiting for idle time. */
let hurried = false;
const INPUTS = ["pointerdown", "wheel", "keydown", "touchstart", "scroll"] as const;

export const loadedSection = (key: LazyKey): SectionComponent | undefined => ready.get(key);

/**
 * A section replaces its placeholder as another DOM element with the same id. Whoever holds on to the element
 * (the active-section tracking) re-reads it when this version changes, which LazySection bumps once the new
 * element is in the page.
 */
let version = 0;
const versionListeners = new Set<() => void>();
export const sectionsVersion = (): number => version;
export function subscribeSections(listener: () => void): () => void {
  versionListeners.add(listener);
  return () => versionListeners.delete(listener);
}
export function announceSectionMounted(): void {
  version++;
  for (const listener of versionListeners) listener();
}

export function onSectionLoaded(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** A short pause between two mounts, so a section never lands in the same task as the one before it. */
function breathe(): Promise<void> {
  return new Promise((resolve) => {
    if (hurried) requestAnimationFrame(() => resolve());
    else if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => resolve(), { timeout: 300 });
    else setTimeout(resolve, 30);
  });
}

/** Loads one section; a failed download (flaky connection) is retried a few times with a growing pause. */
async function load(key: LazyKey): Promise<SectionComponent | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return (await loaders[key]()).default;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
    }
  }
  return null;
}

export function startLazySections(): void {
  if (started) return;
  started = true;

  const hurry = () => {
    hurried = true;
    for (const type of INPUTS) window.removeEventListener(type, hurry);
  };
  for (const type of INPUTS) window.addEventListener(type, hurry, { passive: true });

  afterFirstPaint(async () => {
    // Downloads start together; the sections are mounted one at a time, in page order.
    const pending = ORDER.map(load);
    for (let i = 0; i < ORDER.length; i++) {
      const component = await pending[i];
      if (component) {
        ready.set(ORDER[i], component);
        for (const listener of listeners) listener();
      }
      if (i < ORDER.length - 1) await breathe();
    }
    for (const type of INPUTS) window.removeEventListener(type, hurry);
  });
}
