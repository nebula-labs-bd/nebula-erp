import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  approveMatch,
  createBankTransaction,
  createMatch,
  getBankTransactions,
  getMatches,
} from "../services/reconciliation.service";

import { reconciliationKeys } from "../queries/reconciliation.keys";

import type {
  BankTransaction,
  CreateBankTransactionInput,
  CreateMatchInput,
  ReconciliationMatch,
} from "../types/reconciliation.types";

export function useBankTransactions() {
  return useQuery({
    queryKey: reconciliationKeys.bankTransactions(),
    queryFn: async () => {
      const response = await getBankTransactions();

      return response.data;
    },
  });
}

export function useMatches() {
  return useQuery({
    queryKey: reconciliationKeys.matches(),
    queryFn: async () => {
      const response = await getMatches();

      return response.data;
    },
  });
}

export function useReconciliationMutations() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: reconciliationKeys.all,
    });

    /* Reconciliation affects accounting only — keep ledgers fresh.  */
    queryClient.invalidateQueries({
      queryKey: ["accounting"],
    });
  };

  const createTransaction = useMutation({
    mutationFn: (data: CreateBankTransactionInput) =>
      createBankTransaction(data),
    onSuccess: refresh,
  });

  const createReconciliationMatch = useMutation({
    mutationFn: (data: CreateMatchInput) => createMatch(data),
    onSuccess: refresh,
  });

  const approveReconciliationMatch = useMutation({
    mutationFn: (id: string) => approveMatch(id, "approved"),
    onSuccess: refresh,
  });

  const rejectReconciliationMatch = useMutation({
    mutationFn: (id: string) => approveMatch(id, "rejected"),
    onSuccess: refresh,
  });

  return {
    createTransaction,
    createReconciliationMatch,
    approveReconciliationMatch,
    rejectReconciliationMatch,
  };
}

export type {
  BankTransaction,
  CreateBankTransactionInput,
  CreateMatchInput,
  ReconciliationMatch,
};
