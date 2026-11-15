import { MoonIcon, SunIcon } from "./icons";
import { LANGS, LANG_META, useI18n } from "../i18n/context";
import { useTheme } from "../hooks/useTheme";

/**
 * Language and theme controls for the full-screen menu on phones (the header no longer has room
 * for them there). One row, each control with a text label and 44px touch targets. Changing either
 * one leaves the menu open: nothing here closes it.
 */
export default function MenuPreferences({ interactive }: { interactive: boolean }) {
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();
  const tab = interactive ? 0 : -1;

  const label = "m-0 mb-1 text-[12px] leading-none tracking-[0.14em] text-neutral-500 uppercase";

  return (
    <div className="mt-8 flex items-end justify-between gap-6 border-t border-divider pt-6 md:hidden">
      <div role="group" aria-labelledby="menu-lang-label">
        <p id="menu-lang-label" className={label}>
          {t.a11y.language}
        </p>
        <div className="flex items-center">
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
                tabIndex={tab}
                onClick={() => setLang(code)}
                className={`relative inline-flex min-h-11 min-w-11 items-center justify-center text-[14px] font-medium tracking-[0.06em] transition-colors duration-300 ${
                  isActive ? "text-neutral-100" : "text-neutral-500"
                }`}
              >
                {LANG_META[code].label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-2 bottom-1.5 h-[2px] origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className={`${label} text-right`}>
          {t.nav.theme}
        </p>
        <button
          type="button"
          onClick={toggle}
          tabIndex={tab}
          aria-label={theme === "dark" ? t.a11y.toLightTheme : t.a11y.toDarkTheme}
          title={theme === "dark" ? t.a11y.lightTheme : t.a11y.darkTheme}
          className="ml-auto flex min-h-11 min-w-11 items-center justify-center text-neutral-400 transition-colors duration-300"
        >
          {theme === "dark" ? <SunIcon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.5} /> : <MoonIcon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
}
