"use client";

import { usePreferences } from "./preferences-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = usePreferences();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-base text-[var(--text)] shadow-[var(--shadow-sm)] transition hover:bg-[var(--card-muted)]"
    >
      <span aria-hidden="true">{isDark ? "☾" : "☀"}</span>
    </button>
  );
}

export function LanguageToggle() {
  const { language, toggleLanguage } = usePreferences();

  return (
    <button
      type="button"
      aria-label={language === "zh" ? "Switch to English" : "切换到中文"}
      onClick={toggleLanguage}
      className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-semibold text-[var(--text)] shadow-[var(--shadow-sm)] transition hover:bg-[var(--card-muted)]"
    >
      {language === "zh" ? "EN" : "中"}
    </button>
  );
}
