import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createStockMovement,
} from "../services/inventory.service";

import {
  inventoryKeys,
} from "../queries/inventory.keys";


export function useStockMovement() {
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: createStockMovement,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });
}