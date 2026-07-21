import { apiClient } from "../../../api/client";
import { endpoints } from "../../../api/endpoints";

import type {
  SalesOrder,
  SalesSummary,
} from "../types/sales.types";


export function getSalesOrders() {
  return apiClient.get<SalesOrder[]>(
    endpoints.sales.orders,
  );
}


export function getSalesSummary() {
  return apiClient.get<SalesSummary>(
    "/sales/summary",
  );
}