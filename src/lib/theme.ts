import { useCallback, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const THEME_COLORS: Record<Theme, string> = { light: "#fafaf9", dark: "#0c0a09" };

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

/**
 * Light/dark theme. The portfolio is light by design: index.html applies dark before first paint only when the
 * visitor chose it earlier with the toggle. This hook reads the current theme, toggles it and remembers the choice.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  // The DOM class is the source of truth, so the switch is applied synchronously (needed inside a view transition).
  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable: the choice lasts for this page view */
    }
    setTheme(next);
  }, []);

  return { theme, toggle };
}
