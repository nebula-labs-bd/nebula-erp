import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPurchaseOrder,
  getPurchaseOrders,
  updatePurchaseOrder,
} from "../services/purchase.service";

import {
  purchaseKeys,
} from "../queries/purchase.keys";

import type {
  CreatePurchaseOrderInput,
  PurchaseOrder,
} from "../types/purchase.types";


export function usePurchaseOrders() {
  return useQuery({
    queryKey: purchaseKeys.orders(),

    queryFn: async () => {
      const response = await getPurchaseOrders();

      return response.data;
    },
  });
}


export function usePurchaseOrderMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: purchaseKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updatePurchaseOrder,
    onSuccess: refresh,
  });

  return {
    create,
    update,
  };
}


export type {
  CreatePurchaseOrderInput,
  PurchaseOrder,
};
