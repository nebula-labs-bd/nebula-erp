import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../services/purchase.service";

import {
  purchaseKeys,
} from "../queries/purchase.keys";

import type {
  CreateSupplierInput,
  Supplier,
  UpdateSupplierInput,
} from "../types/purchase.types";


export function useSuppliers() {
  return useQuery({
    queryKey: purchaseKeys.suppliers(),

    queryFn: async () => {
      const response = await getSuppliers();

      return response.data;
    },
  });
}


export function useSupplierMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: purchaseKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createSupplier,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateSupplier,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}


export type {
  CreateSupplierInput,
  Supplier,
  UpdateSupplierInput,
};
