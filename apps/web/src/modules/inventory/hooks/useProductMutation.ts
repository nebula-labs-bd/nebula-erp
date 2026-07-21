import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/inventory.service";

import {
  inventoryKeys,
} from "../queries/inventory.keys";


export function useProductMutation() {
  const queryClient = useQueryClient();


  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: inventoryKeys.all,
    });
  };


  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: refresh,
  });


  const update = useMutation({
    mutationFn: updateProduct,
    onSuccess: refresh,
  });


  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: refresh,
  });


  return {
    create,
    update,
    remove,
  };
}