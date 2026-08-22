/**
 * Application configuration for Nebula ERP.
 * This file serves as the single source of truth for app metadata.
 * Future backend integration should only require updating this file or fetching from API.
 */
export const appConfig = {
  name: "Nebula ERP",
  tagline: "Enterprise Platform",
  edition: "Enterprise Edition",
  version: "1.0.0",
  build: "2026.08",
} as const;

export type AppConfig = typeof appConfig;