import { queryOptions } from "@tanstack/react-query";

import {
  getAccounts,
  getJournalEntries,
  getGeneralLedger,
  getAccountingSummary,
  getTransactions,
} from "../services/accounting.service";

import { accountingKeys } from "./accounting.keys";

export const accountsQuery = queryOptions({
  queryKey: accountingKeys.accounts(),
  queryFn: getAccounts,
});

export const journalEntriesQuery = queryOptions({
  queryKey: accountingKeys.journalEntries(),
  queryFn: getJournalEntries,
});

export const ledgerQuery = queryOptions({
  queryKey: accountingKeys.ledger(),
  queryFn: () => getGeneralLedger(),
});

export const accountingSummaryQuery = queryOptions({
  queryKey: accountingKeys.summary(),
  queryFn: getAccountingSummary,
});

export const transactionsQuery = queryOptions({
  queryKey: accountingKeys.transactions(),
  queryFn: getTransactions,
});