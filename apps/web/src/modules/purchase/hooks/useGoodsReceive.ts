import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createGoodsReceive,
  createGoodsReceiveWithStockMovements,
  getGoodsReceives,
} from "../services/purchase.service";

import {
  purchaseKeys,
} from "../queries/purchase.keys";

import type {
  CreateGoodsReceiveInput,
  GoodsReceive,
} from "../types/purchase.types";


export function useGoodsReceives() {
  return useQuery({
    queryKey: purchaseKeys.goodsReceives(),

    queryFn: async () => {
      const response = await getGoodsReceives();

      return response.data;
    },
  });
}


export function useGoodsReceiveMutation() {
  const queryClient = useQueryClient();

  /**
   * On success we invalidate the purchase queries and the
   * inventory queries (stock movements / ledger) so the
   * downstream inventory flow is reflected in the UI.
   */
  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: purchaseKeys.all,
    });

    queryClient.invalidateQueries({
      queryKey: ["inventory"],
    });
  };

  const create = useMutation({
    mutationFn: async (data: CreateGoodsReceiveInput) => {
      const response = await createGoodsReceive(data);

      const goodsReceive = response.data;

      // Stock-in movements are created AFTER the goods receive
      // record is persisted. Inventory is updated only through
      // this movement flow — never directly.
      await createGoodsReceiveWithStockMovements(
        goodsReceive,
      );

      return goodsReceive;
    },
    onSuccess: refresh,
  });

  return {
    create,
  };
}


export type {
  CreateGoodsReceiveInput,
  GoodsReceive,
};
