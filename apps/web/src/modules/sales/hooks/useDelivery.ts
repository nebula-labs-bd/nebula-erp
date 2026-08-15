import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createDelivery,
  createDeliveryWithStockMovements,
  getDeliveries,
} from "../services/sales.service";

import {
  salesKeys,
} from "../queries/sales.keys";

import type {
  CreateDeliveryInput,
  Delivery,
} from "../types/sales.types";


export function useDeliveries() {
  return useQuery({
    queryKey: salesKeys.deliveries(),

    queryFn: async () => {
      const response = await getDeliveries();

      return response.data;
    },
  });
}


export function useDeliveryMutation() {
  const queryClient = useQueryClient();

  /**
   * On success we invalidate the sales queries and the inventory queries
   * (stock movements / ledger) so the downstream inventory flow is reflected
   * in the UI.
   */
  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: salesKeys.all,
    });

    queryClient.invalidateQueries({
      queryKey: ["inventory"],
    });
  };

  const create = useMutation({
    mutationFn: async (data: CreateDeliveryInput) => {
      const response = await createDelivery(data);

      const delivery = response.data;

      // Stock-out movements are created AFTER the delivery record is
      // persisted. Inventory is reduced only through this movement flow —
      // never directly.
      await createDeliveryWithStockMovements(delivery);

      return delivery;
    },
    onSuccess: refresh,
  });

  return {
    create,
  };
}


export type {
  CreateDeliveryInput,
  Delivery,
};
