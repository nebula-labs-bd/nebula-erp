import { useState } from "react";

import { useContactMutation } from "../hooks/useContacts";

import type {
  CreateContactInput,
  ContactStatus,
  ContactRole,
} from "../types/contact.types";

const initialForm: CreateContactInput = {
  type: "individual",
  name: "",
  companyName: "",
  phone: "",
  email: "",
  address: "",
  taxNumber: "",
  roles: [],
  status: "active",
};

type ContactFormProps = {
  onClose?: () => void;
};

export default function ContactForm({ onClose }: ContactFormProps) {
  const { create } = useContactMutation();

  const [form, setForm] = useState<CreateContactInput>(initialForm);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof CreateContactInput>(
    key: K,
    value: CreateContactInput[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function toggleRole(role: ContactRole) {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (form.roles.length === 0) {
      setError("At least one role (Customer/Supplier) is required.");
      return;
    }

    create.mutate(form, {
      onSuccess: () => {
        setForm(initialForm);
        onClose?.();
      },
    });
  }

  return (
    <div className="surface p-5 space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Add Contact</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            className="w-full rounded border p-2"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Contact name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            className="w-full rounded border p-2"
            value={form.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder="Company name"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              className="w-full rounded border p-2"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Phone"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full rounded border p-2"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            className="w-full rounded border p-2"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Address"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tax Number</label>
          <input
            className="w-full rounded border p-2"
            value={form.taxNumber}
            onChange={(e) => updateField("taxNumber", e.target.value)}
            placeholder="Tax number"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="font-medium">Roles *</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.roles.includes("customer")}
                onChange={() => toggleRole("customer")}
              />
              <span>Customer</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.roles.includes("vendor")}
                onChange={() => toggleRole("vendor")}
              />
              <span>Vendor</span>
            </label>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full rounded border p-2"
            value={form.status}
            onChange={(e) =>
              updateField("status", e.target.value as ContactStatus)
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
            Create Contact
          </button>
        </div>
      </form>
    </div>
  );
}