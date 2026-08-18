/**
 * Query keys for the Notifications module.
 */
export const notificationKeys = {
  all: ["notifications"] as const,

  list: () => [...notificationKeys.all, "list"] as const,
};
