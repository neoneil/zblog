"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "zh" | "en";
export type ThemeMode = "light" | "dark";
export type LocalizedCopy = Record<Language, string>;

type PreferencesContextValue = {
  language: Language;
  theme: ThemeMode;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: (copy: LocalizedCopy) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const LANGUAGE_STORAGE_KEY = "site-language";
const THEME_STORAGE_KEY = "site-theme";

function getBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "zh";
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    setLanguageState(storedLanguage === "en" || storedLanguage === "zh" ? storedLanguage : getBrowserLanguage());
    setTheme(storedTheme === "dark" || storedTheme === "light" ? storedTheme : getSystemTheme());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = language;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      language,
      theme,
      setLanguage: setLanguageState,
      toggleLanguage: () => setLanguageState((current) => (current === "zh" ? "en" : "zh")),
      toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
      t: (copy) => copy[language],
    }),
    [language, theme],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }
  return value;
}

export function LocalizedText({ copy }: { copy: LocalizedCopy }) {
  const { t } = usePreferences();
  return <>{t(copy)}</>;
}
