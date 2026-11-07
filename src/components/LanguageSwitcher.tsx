import { LANGS, LANG_META, useI18n } from "../i18n/context";

/** PT / EN / ES selector; the active language is highlighted. */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div role="group" aria-label={t.a11y.language} className="flex items-center gap-0.5 font-mono text-xs tracking-[0.1em]">
      {LANGS.map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1 text-neutral-700">
              /
            </span>
          )}
          <button
            type="button"
            lang={LANG_META[code].htmlLang}
            title={LANG_META[code].name}
            aria-label={LANG_META[code].name}
            aria-pressed={lang === code}
            onClick={() => setLang(code)}
            className={`py-1 transition-colors ${
              lang === code ? "text-accent" : "text-neutral-400 hover:text-neutral-100"
            }`}
          >
            {LANG_META[code].label}
          </button>
        </span>
      ))}
    </div>
  );
}
