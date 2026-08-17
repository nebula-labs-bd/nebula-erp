import { useState } from "react";

import {
  useAssetMutation,
  useAssetCategories,
} from "../hooks/useAssets";
import { useContacts } from "../../contacts/hooks/useContacts";

import type {
  Asset,
  AssetCategory,
  AssetStatus,
  AssetPaymentStatus,
  CreateAssetInput,
  DepreciationMethod,
} from "../types/asset.types";

type AssetFormProps = {
  onClose?: () => void;
  asset?: Asset | null;
};

const initialForm: CreateAssetInput = {
  categoryId: "",
  name: "",
  description: "",
  purchaseDate: new Date().toISOString().split("T")[0],
  purchaseValue: 0,
  salvageValue: 0,
  usefulLife: 1,
  depreciationMethod: "straight_line",
  paymentStatus: "payable",
  status: "active",
  contactId: undefined,
};

export default function AssetForm({
  onClose,
  asset,
}: AssetFormProps) {
  const { create, update } = useAssetMutation();
  const { data: categories = [] } = useAssetCategories();
  const { data: contacts = [] } = useContacts();

  const [form, setForm] = useState<CreateAssetInput>(
    asset
      ? {
          categoryId: asset.categoryId,
          name: asset.name,
          description: asset.description,
          purchaseDate: asset.purchaseDate,
          purchaseValue: asset.purchaseValue,
          salvageValue: asset.salvageValue,
          usefulLife: asset.usefulLife,
          depreciationMethod: asset.depreciationMethod,
          paymentStatus: asset.paymentStatus,
          status: asset.status,
          contactId: asset.contactId,
        }
      : initialForm,
  );
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof CreateAssetInput>(
    key: K,
    value: CreateAssetInput[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Category is required.");
      return;
    }

    if (!form.purchaseValue || form.purchaseValue <= 0) {
      setError("Purchase value must be greater than 0.");
      return;
    }

    if (!form.usefulLife || form.usefulLife <= 0) {
      setError("Useful life must be greater than 0.");
      return;
    }

    if (asset) {
      update.mutate(
        { id: asset.id, ...form },
        {
          onSuccess: () => onClose?.(),
        },
      );
    } else {
      create.mutate(form, {
        onSuccess: () => {
          setForm(initialForm);
          onClose?.();
        },
      });
    }
  }

  return (
    <div className="surface p-5 space-y-4 max-w-xl">
      <h2 className="text-xl font-bold">
        {asset ? "Edit Asset" : "Register Asset"}
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name *
            </label>
            <input
              className="w-full rounded border p-2"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Dell OptiPlex 7090"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Category *
            </label>
            <select
              className="w-full rounded border p-2"
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((category: AssetCategory) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Purchase Date
            </label>
            <input
              className="w-full rounded border p-2"
              type="date"
              value={form.purchaseDate}
              onChange={(e) => updateField("purchaseDate", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Purchase Value *
            </label>
            <input
              className="w-full rounded border p-2"
              type="number"
              step="0.01"
              value={form.purchaseValue}
              onChange={(e) =>
                updateField("purchaseValue", Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Depreciation Method
            </label>
            <select
              className="w-full rounded border p-2"
              value={form.depreciationMethod}
              onChange={(e) =>
                updateField(
                  "depreciationMethod",
                  e.target.value as DepreciationMethod,
                )
              }
            >
              <option value="straight_line">Straight Line</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Payment
            </label>
            <select
              className="w-full rounded border p-2"
              value={form.paymentStatus}
              onChange={(e) =>
                updateField(
                  "paymentStatus",
                  e.target.value as AssetPaymentStatus,
                )
              }
            >
              <option value="payable">On Credit (Payable)</option>
              <option value="paid">Paid (Cash)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contact (optional)
            </label>
            <select
              className="w-full rounded border p-2"
              value={form.contactId ?? ""}
              onChange={(e) =>
                updateField(
                  "contactId",
                  e.target.value ? e.target.value : undefined,
                )
              }
            >
              <option value="">None</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full rounded border p-2"
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value as AssetStatus)
              }
            >
              <option value="active">Active</option>
              <option value="disposed">Disposed</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded border p-2"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Asset description"
            rows={3}
          />
        </div>

        {error && (
          <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            className="rounded border px-4 py-2 flex-1"
            onClick={() => onClose?.()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white flex-1"
          >
            {asset ? "Save Changes" : "Register Asset"}
          </button>
        </div>
      </form>
    </div>
  );
}

