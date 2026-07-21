import { apiClient } from "../../../api/client";

import type {
  Transaction,
  AccountingSummary,
} from "../types/accounting.types";


export function getTransactions() {
  return apiClient.get<Transaction[]>(
    "/accounting/transactions",
  );
}


export function getAccountingSummary() {
  return apiClient.get<AccountingSummary>(
    "/accounting/summary",
  );
}