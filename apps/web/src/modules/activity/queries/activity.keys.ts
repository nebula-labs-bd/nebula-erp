/**
 * Query keys for the Activity Center module.
 *
 * Mirrors the structure of the other module key factories: a stable `all`
 * root plus a factory for the activity feed query so it can be invalidated
 * or updated as a unit.
 */
export const activityKeys = {
  all: ["activity"] as const,

  feed: () => [...activityKeys.all, "feed"] as const,
};
