import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "../services/accounting.service";

import { accountingKeys } from "../queries/accounting.keys";

import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "../types/accounting.types";

export function useAccounts() {
  return useQuery({
    queryKey: accountingKeys.accounts(),
    queryFn: async () => {
      const response = await getAccounts();
      return response.data;
    },
  });
}

export function useAccountMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: accountingKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createAccount,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateAccount,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteAccount,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}

export type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
};