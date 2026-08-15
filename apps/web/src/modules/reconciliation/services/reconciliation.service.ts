import { apiClient } from "../../../api/client";

import type {
  BankTransaction,
  CreateBankTransactionInput,
  CreateMatchInput,
  ReconciliationMatch,
} from "../types/reconciliation.types";

/* ---------------------------------------------------------------- */
/* Bank Transactions                                                */
/* ---------------------------------------------------------------- */

export function getBankTransactions() {
  return apiClient.get<BankTransaction[]>(
    "/reconciliation/bank-transactions",
  );
}

export function createBankTransaction(data: CreateBankTransactionInput) {
  return apiClient.post<BankTransaction>(
    "/reconciliation/bank-transactions",
    data,
  );
}

/* ---------------------------------------------------------------- */
/* Reconciliation Matches                                           */
/* ---------------------------------------------------------------- */

export function getMatches() {
  return apiClient.get<ReconciliationMatch[]>("/reconciliation/matches");
}

export function createMatch(data: CreateMatchInput) {
  return apiClient.post<ReconciliationMatch>(
    "/reconciliation/matches",
    data,
  );
}

export function approveMatch(
  id: string,
  status: "approved" | "rejected" = "approved",
) {
  return apiClient.post<ReconciliationMatch>(
    `/reconciliation/matches/${id}/approve`,
    { status },
  );
}
