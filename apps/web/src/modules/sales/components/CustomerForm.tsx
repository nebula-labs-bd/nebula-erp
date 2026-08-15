import { useEffect, useState } from "react";

import {
  useCustomerMutation,
} from "../hooks/useCustomer";

import type {
  CreateCustomerInput,
  Customer,
  CustomerStatus,
} from "../types/sales.types";


type CustomerFormProps = {
  customer?: Customer;
  onCancel?: () => void;
};


type CustomerFormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  taxNumber: string;
  status: CustomerStatus;
};


const initialState: CustomerFormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  taxNumber: "",
  status: "active",
};


export default function CustomerForm({
  customer,
  onCancel,
}: CustomerFormProps) {
  const { create, update } = useCustomerMutation();

  const [form, setForm] =
    useState<CustomerFormState>(initialState);

  const editMode = Boolean(customer);

  useEffect(() => {
    if (!customer) {
      setForm(initialState);

      return;
    }

    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      taxNumber: customer.taxNumber ?? "",
      status: customer.status,
    });
  }, [customer]);

  function updateField<K extends keyof CustomerFormState>(
    key: K,
    value: CustomerFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit() {
    const payload: CreateCustomerInput = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      taxNumber: form.taxNumber || undefined,
      status: form.status,
    };

    if (editMode && customer) {
      update.mutate({
        id: customer.id,
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
        {editMode ? "Edit Customer" : "Add Customer"}
      </h2>

      <input
        className="w-full rounded border p-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          updateField("name", e.target.value)
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
            e.target.value as CustomerStatus,
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
          {editMode ? "Update Customer" : "Create Customer"}
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
