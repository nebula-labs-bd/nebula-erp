import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createSalesOrder,
  getSalesOrders,
  updateSalesOrder,
} from "../services/sales.service";

import {
  salesKeys,
} from "../queries/sales.keys";

import type {
  CreateSalesOrderInput,
  SalesOrder,
} from "../types/sales.types";


export function useSalesOrders() {
  return useQuery({
    queryKey: salesKeys.orders(),

    queryFn: async () => {
      const response = await getSalesOrders();

      return response.data;
    },
  });
}


export function useSalesOrderMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: salesKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createSalesOrder,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateSalesOrder,
    onSuccess: refresh,
  });

  return {
    create,
    update,
  };
}


export type {
  CreateSalesOrderInput,
  SalesOrder,
};
