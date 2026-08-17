import { useState } from "react";

import AssetForm from "../components/AssetForm";
import AssetTable from "../components/AssetTable";
import AssetCategoryForm from "../components/AssetCategoryForm";
import AssetCategoryTable from "../components/AssetCategoryTable";
import DepreciationOverview from "../components/DepreciationOverview";

import {
  useAssets,
  useAssetMutation,
  useAssetCategories,
  useAssetCategoryMutation,
} from "../hooks/useAssets";

import type {
  Asset,
  AssetCategory,
} from "../types/asset.types";

export default function AssetsPage() {
  const { data: assets = [] } = useAssets();
  const { data: categories = [] } = useAssetCategories();

  const { remove: removeAsset } = useAssetMutation();
  const { remove: removeCategory } = useAssetCategoryMutation();

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<AssetCategory | null>(null);

  function handleEditAsset(asset: Asset) {
    setEditingAsset(asset);
  }

  function handleDeleteAsset(id: string) {
    if (window.confirm("Delete this asset?")) {
      removeAsset.mutate(id);
    }
  }

  function handleEditCategory(category: AssetCategory) {
    setEditingCategory(category);
  }

  function handleDeleteCategory(id: string) {
    if (window.confirm("Delete this category?")) {
      removeCategory.mutate(id);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Asset Management</h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Track business-owned items of value — computers, vehicles,
          machinery, furniture and more. Acquisitions capitalise into the
          accounting engine (asset account debited, cash or payable
          credited) and depreciate over their useful life. Assets only ever
          affect accounting — inventory and stock are never touched.
        </p>
      </div>

      {/* Asset Register */}
      <section id="asset-register" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Asset Register</h2>

          <button
            className="rounded bg-black px-4 py-2 text-white"
            onClick={() => {
              setEditingAsset(null);
            }}
          >
            Register Asset
          </button>
        </div>

        <AssetForm
          asset={editingAsset}
          onClose={() => {
            setEditingAsset(null);
          }}
        />

        <AssetTable
          assets={assets}
          categories={categories}
          onEdit={handleEditAsset}
          onDelete={handleDeleteAsset}
        />
      </section>

      {/* Asset Categories */}
      <section id="asset-categories" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Asset Categories</h2>

          <button
            className="rounded bg-black px-4 py-2 text-white"
            onClick={() => {
              setEditingCategory(null);
            }}
          >
            Add Category
          </button>
        </div>

        <AssetCategoryForm
          category={editingCategory}
          onClose={() => {
            setEditingCategory(null);
          }}
        />

        <AssetCategoryTable
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </section>

      {/* Depreciation Overview */}
      <section id="depreciation-overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Depreciation Overview</h2>
        </div>

        <DepreciationOverview assets={assets} />
      </section>
    </div>
  );
}
