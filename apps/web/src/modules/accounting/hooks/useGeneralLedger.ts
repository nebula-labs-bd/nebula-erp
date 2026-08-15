import { useQuery } from "@tanstack/react-query";

import { getGeneralLedger } from "../services/accounting.service";

import { accountingKeys } from "../queries/accounting.keys";

import type { LedgerEntry } from "../types/accounting.types";

export function useGeneralLedger(accountId?: string) {
  return useQuery({
    queryKey: accountId
      ? accountingKeys.ledgerByAccount(accountId)
      : accountingKeys.ledger(),
    queryFn: async () => {
      const response = await getGeneralLedger(accountId);
      return response.data;
    },
  });
}

export type { LedgerEntry };