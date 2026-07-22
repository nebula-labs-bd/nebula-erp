export const unitKeys = {
  all: ["units"] as const,

  lists: () =>
    [...unitKeys.all, "list"] as const,

  detail: (id: string) =>
    [...unitKeys.all, "detail", id] as const,
};