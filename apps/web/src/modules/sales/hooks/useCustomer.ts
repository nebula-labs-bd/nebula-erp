import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "../services/sales.service";

import {
  salesKeys,
} from "../queries/sales.keys";

import type {
  CreateCustomerInput,
  Customer,
  UpdateCustomerInput,
} from "../types/sales.types";


export function useCustomers() {
  return useQuery({
    queryKey: salesKeys.customers(),

    queryFn: async () => {
      const response = await getCustomers();

      return response.data;
    },
  });
}


export function useCustomerMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: salesKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createCustomer,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateCustomer,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}


export type {
  CreateCustomerInput,
  Customer,
  UpdateCustomerInput,
};
