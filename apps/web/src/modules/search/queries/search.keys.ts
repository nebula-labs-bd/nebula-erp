/**
 * Query keys for the global search module.
 *
 * Mirrors the structure of `reportKeys`, `activityKeys` and the other
 * module key factories: a stable `all` root plus a factory for the
 * search-results query scoped by the (trimmed) query string so cached
 * results are keyed per search term.
 */
export const searchKeys = {
  all: ["search"] as const,

  results: (query: string) =>
    [...searchKeys.all, "results", query] as const,
};
