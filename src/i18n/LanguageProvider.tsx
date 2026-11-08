import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { I18nContext, LANGS, LANG_META, type Lang } from "./context";
import { pt } from "./pt";
import { en } from "./en";
import { es } from "./es";

const dictionaries = { pt, en, es };
const STORAGE_KEY = "lang";

/** Portuguese is the default; only an explicit earlier choice overrides it. */
function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGS as readonly string[]).includes(stored)) return stored as Lang;
  } catch {
    // localStorage unavailable (private mode, blocked storage) - fall back to the default.
  }
  return "pt";
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

  // Keep the document in sync: <html lang>, tab title and meta description.
  useEffect(() => {
    document.documentElement.lang = LANG_META[lang].htmlLang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
