import { useState } from "react";

import {
  useExpenseMutation,
  useExpenseCategories,
} from "../hooks/useExpenses";
import { useContacts } from "../../contacts/hooks/useContacts";

import type {
  CreateExpenseInput,
  Expense,
  ExpenseCategory,
  ExpenseStatus,
  PaymentStatus,
} from "../types/expense.types";

type ExpenseFormProps = {
  onClose?: () => void;
  expense?: Expense | null;
};

const initialForm: CreateExpenseInput = {
  categoryId: "",
  contactId: undefined,
  title: "",
  description: "",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  paymentStatus: "unpaid",
  status: "draft",
};

export default function ExpenseForm({
  onClose,
  expense,
}: ExpenseFormProps) {
  const { create, update } = useExpenseMutation();
  const { data: categories = [] } = useExpenseCategories();
  const { data: contacts = [] } = useContacts();

  const [form, setForm] = useState<CreateExpenseInput>(
    expense
      ? {
          categoryId: expense.categoryId,
          contactId: expense.contactId,
          title: expense.title,
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          paymentStatus: expense.paymentStatus,
          status: expense.status,
        }
      : initialForm,
  );
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof CreateExpenseInput>(
    key: K,
    value: CreateExpenseInput[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Category is required.");
      return;
    }

    if (!form.amount || form.amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (expense) {
      update.mutate(
        { id: expense.id, ...form },
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
        {expense ? "Edit Expense" : "Record Expense"}
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title *
            </label>
            <input
              className="w-full rounded border p-2"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Expense title"
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
              {categories.map((category: ExpenseCategory) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Amount *
            </label>
            <input
              className="w-full rounded border p-2"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) =>
                updateField("amount", Number(e.target.value))
              }
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              className="w-full rounded border p-2"
              type="date"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
            />
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
            <label className="block text-sm font-medium mb-1">
              Payment Status
            </label>
            <select
              className="w-full rounded border p-2"
              value={form.paymentStatus}
              onChange={(e) =>
                updateField(
                  "paymentStatus",
                  e.target.value as PaymentStatus,
                )
              }
            >
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full rounded border p-2"
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value as ExpenseStatus)
              }
            >
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
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
            placeholder="Expense description"
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
            {expense ? "Save Changes" : "Record Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}

