import { LANGS, LANG_META, useI18n } from "../i18n/context";

/** EN / ES / PT selector; the active language is lit, the others recede. */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div role="group" aria-label={t.a11y.language} className="flex items-center gap-3.5 text-[13px] font-medium tracking-[0.06em]">
      {LANGS.map((code) => {
        const isActive = lang === code;
        return (
          <button
            key={code}
            type="button"
            lang={LANG_META[code].htmlLang}
            title={LANG_META[code].name}
            aria-label={LANG_META[code].name}
            aria-pressed={isActive}
            onClick={() => setLang(code)}
            className={`relative py-1 transition-colors duration-300 before:absolute before:-inset-x-1.5 before:-inset-y-5 ${
              isActive ? "text-neutral-100" : "text-neutral-500 hover:text-neutral-200"
            }`}
          >
            {LANG_META[code].label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 -bottom-1 h-[2px] origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                isActive ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
