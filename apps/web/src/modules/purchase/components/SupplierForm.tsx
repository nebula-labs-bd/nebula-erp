import { useEffect, useState } from "react";

import {
  useSupplierMutation,
} from "../hooks/useSupplier";

import type {
  CreateSupplierInput,
  Supplier,
  SupplierStatus,
} from "../types/purchase.types";


type SupplierFormProps = {
  supplier?: Supplier;
  onCancel?: () => void;
};


type SupplierFormState = {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  taxNumber: string;
  status: SupplierStatus;
};


const initialState: SupplierFormState = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  taxNumber: "",
  status: "active",
};


export default function SupplierForm({
  supplier,
  onCancel,
}: SupplierFormProps) {
  const { create, update } = useSupplierMutation();

  const [form, setForm] =
    useState<SupplierFormState>(initialState);

  const editMode = Boolean(supplier);

  useEffect(() => {
    if (!supplier) {
      setForm(initialState);

      return;
    }

    setForm({
      companyName: supplier.companyName,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      taxNumber: supplier.taxNumber ?? "",
      status: supplier.status,
    });
  }, [supplier]);

  function updateField<K extends keyof SupplierFormState>(
    key: K,
    value: SupplierFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit() {
    const payload: CreateSupplierInput = {
      companyName: form.companyName,
      contactPerson: form.contactPerson,
      phone: form.phone,
      email: form.email,
      address: form.address,
      taxNumber: form.taxNumber || undefined,
      status: form.status,
    };

    if (editMode && supplier) {
      update.mutate({
        id: supplier.id,
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
        {editMode ? "Edit Supplier" : "Add Supplier"}
      </h2>

      <input
        className="w-full rounded border p-2"
        placeholder="Company Name"
        value={form.companyName}
        onChange={(e) =>
          updateField("companyName", e.target.value)
        }
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Contact Person"
        value={form.contactPerson}
        onChange={(e) =>
          updateField("contactPerson", e.target.value)
        }
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
      />

      <input
        className="w-full rounded border p-2"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
      />

      <textarea
        className="w-full rounded border p-2"
        placeholder="Address"
        value={form.address}
        onChange={(e) =>
          updateField("address", e.target.value)
        }
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Tax Number"
        value={form.taxNumber}
        onChange={(e) =>
          updateField("taxNumber", e.target.value)
        }
      />

      <select
        className="w-full rounded border p-2"
        value={form.status}
        onChange={(e) =>
          updateField(
            "status",
            e.target.value as SupplierStatus,
          )
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
          {editMode ? "Update Supplier" : "Create Supplier"}
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
