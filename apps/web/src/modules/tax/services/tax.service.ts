import { apiClient } from "../../../api/client";

import type {
  CreateTaxTypeInput,
  TaxSummary,
  TaxTransaction,
  TaxType,
  UpdateTaxTypeInput,
} from "../types/tax.types";

/* ---------------------------------------------------------------- */
/* Tax Types (Tax Rules)                                            */
/* ---------------------------------------------------------------- */

export function getTaxTypes() {
  return apiClient.get<TaxType[]>("/tax/types");
}

export function createTaxType(data: CreateTaxTypeInput) {
  return apiClient.post<TaxType>("/tax/types", data);
}

export function updateTaxType(data: UpdateTaxTypeInput) {
  return apiClient.post<TaxType>(`/tax/types/${data.id}`, data);
}

export function deleteTaxType(id: string) {
  return apiClient.post(`/tax/types/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* Tax Transaction & Summary Foundation                             */
/* ---------------------------------------------------------------- */

export function getTaxTransactions() {
  return apiClient.get<TaxTransaction[]>("/tax/transactions");
}

export function getTaxSummary() {
  return apiClient.get<TaxSummary>("/tax/summary");
}
