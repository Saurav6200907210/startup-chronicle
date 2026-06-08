import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative inline-flex h-7 w-14 items-center rounded-full border border-border-subtle bg-surface-800 transition-colors hover:border-silver/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-silver/60"
    >
      <span
        className="absolute left-0.5 top-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-silver text-surface-900 shadow-md transition-transform duration-300 ease-out"
        style={{ transform: isDark ? "translateX(0)" : "translateX(28px)" }}
      >
        {isDark ? <Moon className="size-3.5" strokeWidth={2.5} /> : <Sun className="size-3.5" strokeWidth={2.5} />}
      </span>
    </button>
  );
}
