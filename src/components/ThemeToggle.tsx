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
      className="inline-flex h-8 w-8 items-center justify-center text-neutral-300 transition-colors hover:text-accent"
    >
      {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
    </button>
  );
}
