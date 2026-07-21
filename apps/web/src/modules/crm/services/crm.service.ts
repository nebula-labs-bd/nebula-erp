import { apiClient } from "../../../api/client";

import type {
  Customer,
  CRMOverview,
} from "../types/crm.types";


export function getCustomers() {
  return apiClient.get<Customer[]>(
    "/crm/customers",
  );
}


export function getCRMOverview() {
  return apiClient.get<CRMOverview>(
    "/crm/overview",
  );
}