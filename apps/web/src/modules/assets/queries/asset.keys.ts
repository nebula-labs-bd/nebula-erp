export const assetKeys = {
  all: ["assets"] as const,

  assets: () => [...assetKeys.all, "list"] as const,
  asset: (id: string) => [...assetKeys.assets(), id] as const,

  categories: () => [...assetKeys.all, "categories"] as const,
  category: (id: string) => [...assetKeys.categories(), id] as const,

  depreciation: () => [...assetKeys.all, "depreciation"] as const,
};
