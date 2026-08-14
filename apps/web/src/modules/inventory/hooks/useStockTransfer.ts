import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createStockMovement,
  createStockTransfer,
  getStockTransfers,
} from "../services/inventory.service";

import {
  inventoryKeys,
} from "../queries/inventory.keys";

import type {
  CreateStockTransferInput,
} from "../types/inventory.types";


export function useStockTransfers() {
  return useQuery({
    queryKey: [
      ...inventoryKeys.all,
      "stock-transfers",
    ],

    queryFn:
      async () => {
        const response =
          await getStockTransfers();

        return response.data;
      },
  });
}


export function useCreateStockTransfer() {
  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn:
      async (input: CreateStockTransferInput) => {

        const transfer =
          await createStockTransfer(
            input,
          );


        // Stock Movement OUT
        // from source warehouse

        await createStockMovement({
          productId: input.productId,

          warehouseId:
            input.fromWarehouseId,

          type: "stock-out",

          quantity: input.quantity,

          unitId: input.unitId,

          baseQuantity:
            input.baseQuantity,

          referenceType: "transfer",

          referenceId:
            transfer.data.id,

          transactionDate:
            new Date().toISOString(),

          note:
            input.note ||
            "Warehouse transfer (stock-out)",
        });


        // Stock Movement IN
        // to destination warehouse

        await createStockMovement({
          productId: input.productId,

          warehouseId:
            input.toWarehouseId,

          type: "stock-in",

          quantity: input.quantity,

          unitId: input.unitId,

          baseQuantity:
            input.baseQuantity,

          referenceType: "transfer",

          referenceId:
            transfer.data.id,

          transactionDate:
            new Date().toISOString(),

          note:
            input.note ||
            "Warehouse transfer (stock-in)",
        });


        return transfer.data;
      },


    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });
}
