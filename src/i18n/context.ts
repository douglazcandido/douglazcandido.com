import { createContext, useContext } from "react";
import type { Dict } from "./pt";

export const LANGS = ["pt", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];

/** BCP 47 tags for <html lang>, plus each language's own name for tooltips. */
export const LANG_META: Record<Lang, { htmlLang: string; label: string; name: string }> = {
  pt: { htmlLang: "pt-BR", label: "PT", name: "Português (Brasil)" },
  en: { htmlLang: "en", label: "EN", name: "English" },
  es: { htmlLang: "es", label: "ES", name: "Español" },
};

export interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

export const I18nContext = createContext<I18nValue | null>(null);

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <LanguageProvider>");
  return value;
}
