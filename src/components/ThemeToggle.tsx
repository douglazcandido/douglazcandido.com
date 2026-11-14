import { useEffect, useRef, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useI18n } from "../i18n/context";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const first = useRef(true);
  const { t } = useI18n();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // localStorage may be unavailable (private mode, disabled storage) - theme just won't persist.
    }

    // Fade colors only for the toggle itself, not on first paint.
    if (first.current) {
      first.current = false;
      return;
    }
    root.classList.add("theme-fade");
    const t = setTimeout(() => root.classList.remove("theme-fade"), 500);
    return () => clearTimeout(t);
  }, [theme]);

  const toggle = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t.a11y.toLightTheme : t.a11y.toDarkTheme}
      title={theme === "dark" ? t.a11y.lightTheme : t.a11y.darkTheme}
      className="relative inline-flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors duration-300 before:absolute before:-inset-x-1 before:-inset-y-[18px] hover:text-neutral-100"
    >
      {theme === "dark" ? <FiSun className="h-[15px] w-[15px]" strokeWidth={1.5} /> : <FiMoon className="h-[15px] w-[15px]" strokeWidth={1.5} />}
    </button>
  );
}
