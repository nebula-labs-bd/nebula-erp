import { useState } from "react";

import { useReconciliationMutations } from "../hooks/useReconciliation";

import type { Account } from "../../accounting/types/accounting.types";

import type {
  BankTransactionType,
  CreateBankTransactionInput,
} from "../types/reconciliation.types";

type BankImportFormProps = {
  accounts: Account[];
};

const initialForm: CreateBankTransactionInput = {
  accountId: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  reference: "",
  amount: 0,
  type: "credit",
};

export default function BankImportForm({
  accounts,
}: BankImportFormProps) {
  const { createTransaction } = useReconciliationMutations();

  const [form, setForm] =
    useState<CreateBankTransactionInput>(initialForm);
  const [error, setError] = useState<string | null>(null);

  /* Banks accounts are asset accounts in the chart of accounts.    */
  const bankAccounts = accounts.filter(
    (account) => account.type === "asset",
  );

  function updateField<K extends keyof CreateBankTransactionInput>(
    key: K,
    value: CreateBankTransactionInput[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit() {
    setError(null);

    if (!form.accountId) {
      setError("Bank account is required.");
      return;
    }

    if (!form.amount || form.amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!form.date) {
      setError("Date is required.");
      return;
    }

    createTransaction.mutate(form);
    setForm(initialForm);
  }

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">Import Bank Transaction</h2>

      <p className="text-sm text-[var(--nebula-text-secondary)]">
        Manually record a bank statement line. A CSV / statement parser can be
        added later — this form prepares the canonical bank transaction shape.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          className="w-full rounded border p-2"
          value={form.accountId}
          onChange={(e) =>
            updateField("accountId", e.target.value)
          }
        >
          <option value="">Select Bank Account</option>
          {bankAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.code} - {account.name}
            </option>
          ))}
        </select>

        <input
          className="w-full rounded border p-2"
          type="date"
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            updateField("description", e.target.value)
          }
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Reference"
          value={form.reference ?? ""}
          onChange={(e) =>
            updateField("reference", e.target.value)
          }
        />

        <input
          className="w-full rounded border p-2"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            updateField("amount", Number(e.target.value))
          }
        />

        <select
          className="w-full rounded border p-2"
          value={form.type}
          onChange={(e) =>
            updateField(
              "type",
              e.target.value as BankTransactionType,
            )
          }
        >
          <option value="credit">Credit (inflow)</option>
          <option value="debit">Debit (outflow)</option>
        </select>
      </div>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        className="rounded bg-black px-4 py-2 text-white"
        onClick={submit}
      >
        Add Bank Transaction
      </button>
    </div>
  );
}
