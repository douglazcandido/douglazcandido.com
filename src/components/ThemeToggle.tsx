import { MoonIcon, SunIcon } from "./icons";
import { useTheme } from "../hooks/useTheme";
import { useI18n } from "../i18n/context";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t.a11y.toLightTheme : t.a11y.toDarkTheme}
      title={theme === "dark" ? t.a11y.lightTheme : t.a11y.darkTheme}
      className="relative inline-flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors duration-300 before:absolute before:-inset-x-1 before:-inset-y-[18px] hover:text-neutral-100"
    >
      {theme === "dark" ? <SunIcon className="h-[15px] w-[15px]" strokeWidth={1.5} /> : <MoonIcon className="h-[15px] w-[15px]" strokeWidth={1.5} />}
    </button>
  );
}
