import { useState } from "react";

import { usePaymentMutation } from "../hooks/usePayments";

import type {
  Supplier,
} from "../../purchase/types/purchase.types";

import type {
  Customer,
} from "../../sales/types/sales.types";

import type {
  CreatePaymentInput,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from "../types/payment.types";

type PaymentFormProps = {
  suppliers?: Supplier[];
  customers?: Customer[];
};

const initialForm: CreatePaymentInput = {
  type: "payable",
  partyId: "",
  amount: 0,
  method: "bank",
  date: new Date().toISOString().split("T")[0],
  reference: "",
  note: "",
  status: "completed",
};

export default function PaymentForm({
  suppliers = [],
  customers = [],
}: PaymentFormProps) {
  const { create } = usePaymentMutation();

  const [form, setForm] = useState<CreatePaymentInput>(initialForm);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof CreatePaymentInput>(
    key: K,
    value: CreatePaymentInput[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit() {
    setError(null);

    if (!form.partyId) {
      setError("Party (supplier/customer) is required.");
      return;
    }

    if (!form.amount || form.amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!form.method) {
      setError("Payment method is required.");
      return;
    }

    create.mutate(form);

    setForm(initialForm);
  }

  const parties = form.type === "payable" ? suppliers : customers;
  const partyLabel = form.type === "payable" ? "Supplier" : "Customer";

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">Add Payment</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          className="w-full rounded border p-2"
          value={form.type}
          onChange={(e) =>
            updateField("type", e.target.value as PaymentType)
          }
        >
          <option value="payable">Supplier Payment (Payable)</option>
          <option value="receivable">Customer Payment (Receivable)</option>
        </select>

        <select
          className="w-full rounded border p-2"
          value={form.method}
          onChange={(e) =>
            updateField("method", e.target.value as PaymentMethod)
          }
        >
          <option value="cash">Cash</option>
          <option value="bank">Bank Transfer</option>
          <option value="card">Card</option>
          <option value="mobile">Mobile Money</option>
        </select>

        <input
          className="w-full rounded border p-2"
          type="date"
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => updateField("amount", Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {partyLabel}
        </label>

        <select
          className="w-full rounded border p-2"
          value={form.partyId}
          onChange={(e) => updateField("partyId", e.target.value)}
        >
          <option value="">Select {partyLabel}</option>
          {parties.map((party) => (
            <option key={party.id} value={party.id}>
              {form.type === "payable"
                ? (party as Supplier).companyName
                : (party as Customer).name}
            </option>
          ))}
        </select>
      </div>

      <input
        className="w-full rounded border p-2"
        placeholder="Reference"
        value={form.reference}
        onChange={(e) => updateField("reference", e.target.value)}
      />

      <textarea
        className="w-full rounded border p-2"
        placeholder="Note"
        value={form.note}
        onChange={(e) => updateField("note", e.target.value)}
      />

      <select
        className="w-full rounded border p-2"
        value={form.status}
        onChange={(e) =>
          updateField("status", e.target.value as PaymentStatus)
        }
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        className="rounded bg-black px-4 py-2 text-white"
        onClick={submit}
      >
        Create Payment
      </button>
    </div>
  );
}