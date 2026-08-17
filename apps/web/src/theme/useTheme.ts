import { useContext } from "react";

import { ThemeContext, type ThemeContextValue } from "./ThemeProvider";

/**
 * Access the active theme and theme controls.
 *
 * Must be used within a {@link ThemeProvider}.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return ctx;
}
