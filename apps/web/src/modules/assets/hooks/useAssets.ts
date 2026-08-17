import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAssetCategory,
  createAssetWithJournal,
  deleteAsset,
  deleteAssetCategory,
  getAssetCategories,
  getAssets,
  updateAsset,
  updateAssetCategory,
} from "../services/asset.service";

import { assetKeys } from "../queries/asset.keys";

import { accountingKeys } from "../../accounting/queries/accounting.keys";

import type {
  Asset,
  AssetCategory,
  CreateAssetCategoryInput,
  CreateAssetInput,
  UpdateAssetCategoryInput,
  UpdateAssetInput,
} from "../types/asset.types";

export function useAssets() {
  return useQuery({
    queryKey: assetKeys.assets(),
    queryFn: async () => {
      const response = await getAssets();
      return response.data;
    },
  });
}

export function useAssetMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: assetKeys.all,
    });

    queryClient.invalidateQueries({
      queryKey: accountingKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createAssetWithJournal,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateAsset,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteAsset,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}

export function useAssetCategories() {
  return useQuery({
    queryKey: assetKeys.categories(),
    queryFn: async () => {
      const response = await getAssetCategories();
      return response.data;
    },
  });
}

export function useAssetCategoryMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: assetKeys.all,
    });

    queryClient.invalidateQueries({
      queryKey: accountingKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createAssetCategory,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateAssetCategory,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteAssetCategory,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}

export type {
  Asset,
  AssetCategory,
  CreateAssetCategoryInput,
  CreateAssetInput,
  UpdateAssetCategoryInput,
  UpdateAssetInput,
};
