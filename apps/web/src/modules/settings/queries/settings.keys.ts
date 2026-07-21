export const settingsKeys = {
  all: ["settings"] as const,

  system: () => [
    ...settingsKeys.all,
    "system",
  ] as const,

  overview: () => [
    ...settingsKeys.all,
    "overview",
  ] as const,
};