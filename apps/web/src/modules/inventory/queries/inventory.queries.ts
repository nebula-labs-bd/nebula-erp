import {
  queryOptions,
} from "@tanstack/react-query";

import {
  getProducts,
  getInventorySummary,
} from "../services/inventory.service";

import {
  inventoryKeys,
} from "./inventory.keys";


export const productsQuery = queryOptions({
  queryKey: inventoryKeys.products(),
  queryFn: getProducts,
});


export const inventorySummaryQuery = queryOptions({
  queryKey: inventoryKeys.summary(),
  queryFn: getInventorySummary,
});