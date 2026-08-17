import { useState } from "react";

import { useExpenseCategoryMutation } from "../hooks/useExpenses";

import type {
  CreateExpenseCategoryInput,
  ExpenseCategory,
} from "../types/expense.types";

type ExpenseCategoryFormProps = {
  onClose?: () => void;
  category?: ExpenseCategory | null;
};

const initialForm: CreateExpenseCategoryInput = {
  name: "",
  description: "",
  status: "active",
};

export default function ExpenseCategoryForm({
  onClose,
  category,
}: ExpenseCategoryFormProps) {
  const { create, update } = useExpenseCategoryMutation();

  const [form, setForm] = useState<CreateExpenseCategoryInput>(
    category
      ? {
          name: category.name,
          description: category.description,
          status: category.status,
        }
      : initialForm,
  );
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof CreateExpenseCategoryInput>(
    key: K,
    value: CreateExpenseCategoryInput[K],
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
      setError("Category name is required.");
      return;
    }

    if (category) {
      update.mutate(
        { id: category.id, ...form },
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
    <div className="surface p-5 space-y-4 max-w-md">
      <h2 className="text-xl font-bold">
        {category ? "Edit Category" : "Add Expense Category"}
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            className="w-full rounded border p-2"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="e.g. Rent, Utilities, Marketing"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded border p-2"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Category description"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full rounded border p-2"
            value={form.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value as CreateExpenseCategoryInput["status"],
              )
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
            {category ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
