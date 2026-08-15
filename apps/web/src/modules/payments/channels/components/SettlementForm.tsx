import { useEffect, useState } from "react";

import { useSettlementMutation } from "../hooks/usePaymentAccounts";
import { usePaymentAccounts } from "../hooks/usePaymentAccounts";
import type {
  CreateSettlementInput,
  SettlementStatus,
} from "../types/channel.types";

import type { Account } from "../../../accounting/types/accounting.types";

type SettlementFormProps = {
  bankAccounts: Account[];
  onCancel?: () => void;
};

type SettlementFormState = {
  paymentAccountId: string;
  amount: number;
  settlementDate: string;
  bankAccountId: string;
  status: SettlementStatus;
};

const initialState: SettlementFormState = {
  paymentAccountId: "",
  amount: 0,
  settlementDate: new Date().toISOString().split("T")[0],
  bankAccountId: "",
  status: "pending",
};

export default function SettlementForm({
  bankAccounts,
  onCancel,
}: SettlementFormProps) {
  const { data: paymentAccounts = [] } = usePaymentAccounts();
  const { create } = useSettlementMutation();

  const [form, setForm] = useState<SettlementFormState>(initialState);

  useEffect(() => {
    setForm(initialState);
  }, []);

  function updateField<K extends keyof SettlementFormState>(
    key: K,
    value: SettlementFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit() {
    const payload: CreateSettlementInput = {
      paymentAccountId: form.paymentAccountId,
      amount: form.amount,
      settlementDate: form.settlementDate,
      bankAccountId: form.bankAccountId,
      status: form.status,
    };

    create.mutate(payload);

    setForm(initialState);
    onCancel?.();
  }

  const sourceAccounts = paymentAccounts.filter(
    (a) => a.status === "active" && a.type !== "bank"
  );
  const destinationAccounts = bankAccounts.filter(
    (a) => a.status === "active" && a.type === "asset"
  );

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">
        Create Settlement
      </h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          className="w-full rounded border p-2"
          value={form.paymentAccountId}
          onChange={(e) =>
            updateField("paymentAccountId", e.target.value)
          }
        >
          <option value="">Select Source Payment Account</option>
          {sourceAccounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} ({acc.type}) - {acc.provider || "N/A"}
            </option>
          ))}
        </select>

        <input
          className="w-full rounded border p-2"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => updateField("amount", Number(e.target.value))}
        />

        <input
          className="w-full rounded border p-2"
          type="date"
          value={form.settlementDate}
          onChange={(e) => updateField("settlementDate", e.target.value)}
        />

        <select
          className="w-full rounded border p-2"
          value={form.bankAccountId}
          onChange={(e) => updateField("bankAccountId", e.target.value)}
        >
          <option value="">Select Destination Bank Account</option>
          {destinationAccounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.code} - {acc.name}
            </option>
          ))}
        </select>
      </div>

      <select
        className="w-full rounded border p-2"
        value={form.status}
        onChange={(e) => updateField("status", e.target.value as SettlementStatus)}
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <div className="flex gap-3">
        <button
          className="rounded bg-black px-4 py-2 text-white"
          onClick={submit}
        >
          Create Settlement
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