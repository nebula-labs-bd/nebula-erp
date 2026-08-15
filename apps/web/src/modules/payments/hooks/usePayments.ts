import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPayment,
  deletePayment,
  getPayments,
  updatePayment,
} from "../services/payment.service";

import { paymentKeys } from "../queries/payment.keys";

import { accountingKeys } from "../../accounting/queries/accounting.keys";

import type {
  CreatePaymentInput,
  Payment,
  UpdatePaymentInput,
} from "../types/payment.types";

export function usePayments() {
  return useQuery({
    queryKey: paymentKeys.payments(),
    queryFn: async () => {
      const response = await getPayments();
      return response.data;
    },
  });
}

export function usePaymentMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: paymentKeys.all,
    });

    queryClient.invalidateQueries({
      queryKey: accountingKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createPayment,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updatePayment,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deletePayment,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}

export type {
  CreatePaymentInput,
  Payment,
  UpdatePaymentInput,
};