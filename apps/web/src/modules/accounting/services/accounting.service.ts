import { apiClient } from "../../../api/client";

import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
  JournalEntry,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  LedgerEntry,
  AccountingSummary,
  Transaction,
} from "../types/accounting.types";

/* ---------------------------------------------------------------- */
/* Chart of Accounts                                                */
/* ---------------------------------------------------------------- */

export function getAccounts() {
  return apiClient.get<Account[]>("/accounting/accounts");
}

export function createAccount(data: CreateAccountInput) {
  return apiClient.post<Account>("/accounting/accounts", data);
}

export function updateAccount(data: UpdateAccountInput) {
  return apiClient.post<Account>(`/accounting/accounts/${data.id}`, data);
}

export function deleteAccount(id: string) {
  return apiClient.post(`/accounting/accounts/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* Journal Entries                                                  */
/* ---------------------------------------------------------------- */

export function getJournalEntries() {
  return apiClient.get<JournalEntry[]>("/accounting/journal-entries");
}

export function createJournalEntry(data: CreateJournalEntryInput) {
  return apiClient.post<JournalEntry>("/accounting/journal-entries", data);
}

export function updateJournalEntry(data: UpdateJournalEntryInput) {
  return apiClient.post<JournalEntry>(`/accounting/journal-entries/${data.id}`, data);
}

export function postJournalEntry(id: string) {
  return apiClient.post<JournalEntry>(`/accounting/journal-entries/${id}/post`, {});
}

export function deleteJournalEntry(id: string) {
  return apiClient.post(`/accounting/journal-entries/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* General Ledger                                                   */
/* ---------------------------------------------------------------- */

export function getGeneralLedger(accountId?: string) {
  const endpoint = accountId
    ? `/accounting/ledger?accountId=${accountId}`
    : "/accounting/ledger";
  return apiClient.get<LedgerEntry[]>(endpoint);
}

/* ---------------------------------------------------------------- */
/* Summary & Transactions (existing)                                */
/* ---------------------------------------------------------------- */

export function getAccountingSummary() {
  return apiClient.get<AccountingSummary>("/accounting/summary");
}

export function getTransactions() {
  return apiClient.get<Transaction[]>("/accounting/transactions");
}