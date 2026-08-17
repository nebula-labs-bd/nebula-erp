/**
 * Centralized theme configuration for the Nebula ERP design system.
 *
 * Each theme overrides the semantic `--nebula-*` brand tokens. Tokens that are
 * not listed per theme (status colors, radius, shadows, spacing) are inherited
 * from `src/styles/tokens.css` so the rest of the design system stays intact.
 *
 * Theme values are applied as CSS custom properties at runtime by ThemeProvider,
 * keeping this file as the single source of truth for the available themes.
 */

export type ThemeId =
  | "neon-orange"
  | "forest-graphite"
  | "signal-violet"
  | "inkberry"
  | "prompt-blue"
  | "clay-brown";

/** Semantic design tokens that each theme is allowed to override. */
export interface ThemeTokens {
  "--nebula-primary": string;
  "--nebula-primary-hover": string;
  "--nebula-secondary": string;
  "--nebula-accent": string;
  "--nebula-background": string;
  "--nebula-surface": string;
  "--nebula-surface-muted": string;
  "--nebula-text-primary": string;
  "--nebula-text-secondary": string;
  "--nebula-text-muted": string;
  "--nebula-border": string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  tokens: ThemeTokens;
}

export const themes: Record<ThemeId, Theme> = {
  "neon-orange": {
    id: "neon-orange",
    name: "Neon Orange",
    tokens: {
      "--nebula-primary": "#FF6115",
      "--nebula-primary-hover": "#E5500A",
      "--nebula-secondary": "#FF8A4C",
      "--nebula-accent": "#FFB000",
      "--nebula-background": "#FFFCF4",
      "--nebula-surface": "#FFFFFF",
      "--nebula-surface-muted": "#FBF1E3",
      "--nebula-text-primary": "#2A1702",
      "--nebula-text-secondary": "#6B5340",
      "--nebula-text-muted": "#A78F77",
      "--nebula-border": "#F0E2CB",
    },
  },
  "forest-graphite": {
    id: "forest-graphite",
    name: "Forest Graphite",
    tokens: {
      "--nebula-primary": "#18251D",
      "--nebula-primary-hover": "#0E1812",
      "--nebula-secondary": "#2F4634",
      "--nebula-accent": "#B7FF72",
      "--nebula-background": "#111712",
      "--nebula-surface": "#182119",
      "--nebula-surface-muted": "#1F2B23",
      "--nebula-text-primary": "#E6F0E8",
      "--nebula-text-secondary": "#A9BCAD",
      "--nebula-text-muted": "#6E8173",
      "--nebula-border": "#26342B",
    },
  },
  "signal-violet": {
    id: "signal-violet",
    name: "Signal Violet",
    tokens: {
      "--nebula-primary": "#7A35FF",
      "--nebula-primary-hover": "#6422E0",
      "--nebula-secondary": "#A36BFF",
      "--nebula-accent": "#C9A6FF",
      "--nebula-background": "#F0F2F5",
      "--nebula-surface": "#FFFFFF",
      "--nebula-surface-muted": "#E7EAF0",
      "--nebula-text-primary": "#1A1030",
      "--nebula-text-secondary": "#4A3E63",
      "--nebula-text-muted": "#8A80A0",
      "--nebula-border": "#D9DEE7",
    },
  },
  inkberry: {
    id: "inkberry",
    name: "Inkberry",
    tokens: {
      "--nebula-primary": "#1A0B2E",
      "--nebula-primary-hover": "#120720",
      "--nebula-secondary": "#3A1F57",
      "--nebula-accent": "#FFB7A5",
      "--nebula-background": "#140A22",
      "--nebula-surface": "#1E1230",
      "--nebula-surface-muted": "#281840",
      "--nebula-text-primary": "#F2E9FB",
      "--nebula-text-secondary": "#BBA9D2",
      "--nebula-text-muted": "#7E6E96",
      "--nebula-border": "#34234F",
    },
  },
  "prompt-blue": {
    id: "prompt-blue",
    name: "Prompt Blue",
    tokens: {
      "--nebula-primary": "#0B132B",
      "--nebula-primary-hover": "#060C1C",
      "--nebula-secondary": "#1E3A6E",
      "--nebula-accent": "#39FF88",
      "--nebula-background": "#070B18",
      "--nebula-surface": "#0F1730",
      "--nebula-surface-muted": "#16203F",
      "--nebula-text-primary": "#E7ECF7",
      "--nebula-text-secondary": "#A6B2CB",
      "--nebula-text-muted": "#6B7793",
      "--nebula-border": "#1E2A4A",
    },
  },
  "clay-brown": {
    id: "clay-brown",
    name: "Clay Brown",
    tokens: {
      "--nebula-primary": "#6B352A",
      "--nebula-primary-hover": "#532820",
      "--nebula-secondary": "#8A4A3C",
      "--nebula-accent": "#FFF1A6",
      "--nebula-background": "#FBF3EC",
      "--nebula-surface": "#FFFFFF",
      "--nebula-surface-muted": "#F3E6DC",
      "--nebula-text-primary": "#3A2018",
      "--nebula-text-secondary": "#6B4A3E",
      "--nebula-text-muted": "#9E8275",
      "--nebula-border": "#EAD9CC",
    },
  },
};

/** Ordered list of themes for rendering selectors. */
export const themeList: Theme[] = Object.values(themes);

/** Theme applied on first load when nothing is stored. */
export const defaultThemeId: ThemeId = "neon-orange";

/** localStorage key used to persist the selected theme. */
export const THEME_STORAGE_KEY = "nebula-theme";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && value in themes;
}
