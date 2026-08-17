import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  defaultThemeId,
  isThemeId,
  THEME_STORAGE_KEY,
  themes,
  type Theme,
  type ThemeId,
} from "./themes";

export interface ThemeContextValue {
  /** The currently active theme. */
  theme: Theme;
  /** The id of the currently active theme. */
  themeId: ThemeId;
  /** All available themes, for building selectors. */
  themes: Theme[];
  /** Switch to a different theme and persist the choice. */
  setTheme: (id: ThemeId) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredThemeId(): ThemeId {
  if (typeof window === "undefined") {
    return defaultThemeId;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  return isThemeId(stored) ? stored : defaultThemeId;
}

/**
 * Apply a theme's tokens to the document root as CSS custom properties and tag
 * the element with a `data-theme` attribute for any theme-scoped selectors.
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  root.setAttribute("data-theme", theme.id);

  for (const [token, value] of Object.entries(theme.tokens)) {
    root.style.setProperty(token, value);
  }
}

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(readStoredThemeId);

  useLayoutEffect(() => {
    applyTheme(themes[themeId]);
  }, [themeId]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    window.localStorage.setItem(THEME_STORAGE_KEY, id);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[themeId],
      themeId,
      themes: Object.values(themes),
      setTheme,
    }),
    [themeId, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
