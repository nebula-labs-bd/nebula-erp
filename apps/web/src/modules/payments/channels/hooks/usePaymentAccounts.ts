import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPaymentAccount,
  createSettlementWithJournal,
  deletePaymentAccount,
  getPaymentAccounts,
  getSettlements,
  updatePaymentAccount,
  updateSettlement,
} from "../services/channel.service";

import type {
  CreatePaymentAccountInput,
  CreateSettlementInput,
  PaymentAccount,
  Settlement,
  UpdatePaymentAccountInput,
  UpdateSettlementInput,
} from "../types/channel.types";

export function usePaymentAccounts() {
  return useQuery({
    queryKey: ["payments", "payment-accounts"],
    queryFn: async () => {
      const response = await getPaymentAccounts();
      return response.data;
    },
  });
}

export function usePaymentAccountMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["payments", "payment-accounts"],
    });

    queryClient.invalidateQueries({
      queryKey: ["payments", "settlements"],
    });

    queryClient.invalidateQueries({
      queryKey: ["payments"],
    });
  };

  const create = useMutation({
    mutationFn: createPaymentAccount,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: (data: UpdatePaymentAccountInput) =>
      updatePaymentAccount(data),
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePaymentAccount(id),
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}

export function useSettlements() {
  return useQuery({
    queryKey: ["payments", "settlements"],
    queryFn: async () => {
      const response = await getSettlements();
      return response.data;
    },
  });
}

export function useSettlementMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["payments", "settlements"],
    });

    queryClient.invalidateQueries({
      queryKey: ["payments", "payment-accounts"],
    });

    queryClient.invalidateQueries({
      queryKey: ["payments"],
    });

    queryClient.invalidateQueries({
      queryKey: ["accounting"],
    });
  };

  const create = useMutation({
    mutationFn: (data: CreateSettlementInput) =>
      createSettlementWithJournal(data),
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: (data: UpdateSettlementInput) =>
      updateSettlement(data),
    onSuccess: refresh,
  });

  return {
    create,
    update,
  };
}

export type {
  CreatePaymentAccountInput,
  CreateSettlementInput,
  PaymentAccount,
  Settlement,
  UpdatePaymentAccountInput,
  UpdateSettlementInput,
};