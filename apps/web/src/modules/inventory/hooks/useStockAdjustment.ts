import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createStockAdjustment,
  createStockMovement,
  getStockAdjustments,
} from "../services/inventory.service";

import {
  inventoryKeys,
} from "../queries/inventory.keys";

import type {
  CreateStockAdjustmentInput,
} from "../types/inventory.types";


export function useStockAdjustments() {
  return useQuery({
    queryKey: [
      ...inventoryKeys.all,
      "stock-adjustments",
    ],

    queryFn:
      async () => {
        const response =
          await getStockAdjustments();

        return response.data;
      },
  });
}


export function useCreateStockAdjustment() {
  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn:
      async (input: CreateStockAdjustmentInput) => {

        const adjustment =
          await createStockAdjustment(
            input,
          );


        const movementType =
          input.type === "increase"
            ? "stock-in"
            : "stock-out";


        await createStockMovement({
          productId: input.productId,

          warehouseId: input.warehouseId,

          type: movementType,

          quantity: input.quantity,

          unitId: input.unitId,

          baseQuantity: input.baseQuantity,

          referenceType: "adjustment",

          referenceId: adjustment.data.id,

          transactionDate:
            new Date().toISOString(),

          note:
            input.note ||
            `${input.type} adjustment: ${input.reason}`,
        });


        return adjustment.data;
      },


    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });
}
