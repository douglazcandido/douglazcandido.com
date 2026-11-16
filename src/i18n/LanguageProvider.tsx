import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { I18nContext, LANGS, LANG_META, type Lang } from "./context";
import { pt } from "./pt";
import { en } from "./en";
import { es } from "./es";

const dictionaries = { pt, en, es };
const STORAGE_KEY = "lang";

/** Languages the site is translated into, matched against the start of a browser language tag ("pt-BR", "es-ES", "en-US"...). */
const BROWSER_LANG = /^(pt|es|en)(?:[-_]|$)/i;

/**
 * Initial language, in this order: (1) a choice saved earlier; (2) the first of the browser's preferred languages
 * (navigator.languages) that is Portuguese, Spanish or English; (3) English: also for any other language, and for
 * crawlers or browsers that report none.
 */
function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGS as readonly string[]).includes(stored)) return stored as Lang;
  } catch {
    // localStorage unavailable (private mode, blocked storage) - fall through to the browser language.
  }
  const preferred = typeof navigator !== "undefined" ? navigator.languages : undefined;
  for (const tag of preferred ?? []) {
    const match = BROWSER_LANG.exec(tag);
    if (match) return match[1].toLowerCase() as Lang;
  }
  return "en";
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const langRef = useRef(lang);
  langRef.current = lang;

  const setLang = useCallback((next: Lang) => {
    if (next === langRef.current) return;

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Choice just won't persist.
    }

    // Cross-fade the whole page (see ::view-transition rules in index.css) so the
    // text swap isn't an abrupt cut. Browsers without the API just switch instantly.
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduceMotion) {
      doc.startViewTransition(() => flushSync(() => setLangState(next)));
    } else {
      setLangState(next);
    }
  }, []);

  const t = dictionaries[lang];

  // Keep the document in sync with the language: <html lang>, the title and the meta description. The title is the
  // same full one in every section (it only changes with the language); the og: and twitter: tags stay static in
  // English in index.html, since link-preview crawlers do not run JavaScript.
  useEffect(() => {
    document.documentElement.lang = LANG_META[lang].htmlLang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
