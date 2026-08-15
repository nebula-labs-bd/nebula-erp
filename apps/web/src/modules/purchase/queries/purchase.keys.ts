export const purchaseKeys = {
  all: ["purchase"] as const,

  suppliers: () => [
    ...purchaseKeys.all,
    "suppliers",
  ] as const,

  orders: () => [
    ...purchaseKeys.all,
    "orders",
  ] as const,

  goodsReceives: () => [
    ...purchaseKeys.all,
    "goods-receives",
  ] as const,
};
