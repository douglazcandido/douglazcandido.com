import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Choice just won't persist.
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
