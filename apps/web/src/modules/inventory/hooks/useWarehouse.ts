import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createWarehouse,
  getWarehouses,
} from "../services/inventory.service";

import {
  inventoryKeys,
} from "../queries/inventory.keys";


export function useWarehouses() {
  return useQuery({
    queryKey: [
      ...inventoryKeys.all,
      "warehouses",
    ],
    queryFn: getWarehouses,
  });
}


export function useWarehouseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWarehouse,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });
}