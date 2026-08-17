import { useEffect, useState } from "react";

import { useTaxMutation } from "../hooks/useTaxes";

import type {
  CreateTaxTypeInput,
  TaxStatus,
  TaxType,
} from "../types/tax.types";

type TaxFormProps = {
  tax?: TaxType;
  onCancel?: () => void;
};

type TaxFormState = {
  name: string;
  rate: string;
  description: string;
  status: TaxStatus;
};

const initialState: TaxFormState = {
  name: "",
  rate: "",
  description: "",
  status: "active",
};

export default function TaxForm({ tax, onCancel }: TaxFormProps) {
  const { create, update } = useTaxMutation();

  const [form, setForm] = useState<TaxFormState>(initialState);

  const editMode = Boolean(tax);

  useEffect(() => {
    if (!tax) {
      setForm(initialState);
      return;
    }

    setForm({
      name: tax.name,
      rate: String(tax.rate),
      description: tax.description,
      status: tax.status,
    });
  }, [tax]);

  function updateField<K extends keyof TaxFormState>(
    key: K,
    value: TaxFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit() {
    const payload: CreateTaxTypeInput = {
      name: form.name,
      rate: Number(form.rate) || 0,
      description: form.description,
      status: form.status,
    };

    if (editMode && tax) {
      update.mutate({
        id: tax.id,
        ...payload,
      });
    } else {
      create.mutate(payload);
    }

    setForm(initialState);
    onCancel?.();
  }

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">
        {editMode ? "Edit Tax Rule" : "Add Tax Rule"}
      </h2>

      <input
        className="w-full rounded border p-2"
        placeholder="Tax Name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Tax Rate (%)"
        type="number"
        step="0.01"
        value={form.rate}
        onChange={(e) => updateField("rate", e.target.value)}
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Description"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <select
        className="w-full rounded border p-2"
        value={form.status}
        onChange={(e) =>
          updateField("status", e.target.value as TaxStatus)
        }
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <div className="flex gap-3">
        <button
          className="rounded bg-black px-4 py-2 text-white"
          onClick={submit}
        >
          {editMode ? "Update Tax" : "Create Tax"}
        </button>

        {onCancel && (
          <button
            className="rounded border px-4 py-2"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
