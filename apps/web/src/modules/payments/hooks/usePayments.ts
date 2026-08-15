import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPayment,
  createPaymentAllocation,
  deletePayment,
  deletePaymentAllocation,
  getPaymentAllocations,
  getPayments,
  updatePayment,
} from "../services/payment.service";

import { paymentKeys } from "../queries/payment.keys";

import { accountingKeys } from "../../accounting/queries/accounting.keys";

import type {
  CreatePaymentAllocationInput,
  CreatePaymentInput,
  Payment,
  PaymentAllocation,
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

export function usePaymentAllocations(paymentId: string) {
  return useQuery({
    queryKey: paymentKeys.allocations(paymentId),
    queryFn: async () => {
      const response = await getPaymentAllocations(paymentId);
      return response.data;
    },
    enabled: !!paymentId,
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

export function usePaymentAllocationMutation() {
  const queryClient = useQueryClient();

  const refresh = (paymentId: string) => {
    queryClient.invalidateQueries({
      queryKey: paymentKeys.allocations(paymentId),
    });

    queryClient.invalidateQueries({
      queryKey: paymentKeys.all,
    });

    queryClient.invalidateQueries({
      queryKey: accountingKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: (data: CreatePaymentAllocationInput) =>
      createPaymentAllocation(data),
    onSuccess: (_result, variables) => refresh(variables.paymentId),
  });

  const remove = useMutation({
    mutationFn: ({
      paymentId,
      allocationId,
    }: {
      paymentId: string;
      allocationId: string;
    }) => deletePaymentAllocation(paymentId, allocationId),
    onSuccess: (_result, variables) => refresh(variables.paymentId),
  });

  return {
    create,
    remove,
  };
}

export type {
  CreatePaymentAllocationInput,
  CreatePaymentInput,
  Payment,
  PaymentAllocation,
  UpdatePaymentInput,
};