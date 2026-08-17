import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTaxType,
  deleteTaxType,
  getTaxSummary,
  getTaxTransactions,
  getTaxTypes,
  updateTaxType,
} from "../services/tax.service";

import { taxKeys } from "../queries/tax.keys";
import { accountingKeys } from "../../accounting/queries/accounting.keys";

import type {
  CreateTaxTypeInput,
  TaxSummary,
  TaxTransaction,
  TaxType,
  UpdateTaxTypeInput,
} from "../types/tax.types";

export function useTaxTypes() {
  return useQuery({
    queryKey: taxKeys.types(),
    queryFn: async () => {
      const response = await getTaxTypes();
      return response.data;
    },
  });
}

export function useTaxMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: taxKeys.all,
    });

    // Tax affects accounting only — keep ledgers in sync.
    queryClient.invalidateQueries({
      queryKey: accountingKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createTaxType,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateTaxType,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteTaxType,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}

/* ---------------------------------------------------------------- */
/* Tax Transaction & Summary Foundation                             */
/* ---------------------------------------------------------------- */

export function useTaxTransactions() {
  return useQuery({
    queryKey: taxKeys.transactions(),
    queryFn: async () => {
      const response = await getTaxTransactions();
      return response.data;
    },
  });
}

export function useTaxSummary() {
  return useQuery({
    queryKey: taxKeys.summary(),
    queryFn: async () => {
      const response = await getTaxSummary();
      return response.data;
    },
  });
}

export type {
  CreateTaxTypeInput,
  TaxSummary,
  TaxTransaction,
  TaxType,
  UpdateTaxTypeInput,
};
