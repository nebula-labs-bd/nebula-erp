import { useEffect, useState } from "react";

import { usePaymentAccountMutation } from "../hooks/usePaymentAccounts";

import type {
  CreatePaymentAccountInput,
  PaymentAccount,
  PaymentAccountStatus,
  PaymentAccountType,
} from "../types/channel.types";

type PaymentAccountFormProps = {
  account?: PaymentAccount;
  onCancel?: () => void;
};

type PaymentAccountFormState = {
  name: string;
  type: PaymentAccountType;
  provider: string;
  accountNumber: string;
  status: PaymentAccountStatus;
};

const ACCOUNT_TYPES: PaymentAccountType[] = [
  "cash",
  "bank",
  "mobile_wallet",
  "marketplace",
  "gateway",
];

const initialState: PaymentAccountFormState = {
  name: "",
  type: "cash",
  provider: "",
  accountNumber: "",
  status: "active",
};

export default function PaymentAccountForm({
  account,
  onCancel,
}: PaymentAccountFormProps) {
  const { create, update } = usePaymentAccountMutation();

  const [form, setForm] = useState<PaymentAccountFormState>(initialState);

  const editMode = Boolean(account);

  useEffect(() => {
    if (!account) {
      setForm(initialState);
      return;
    }

    setForm({
      name: account.name,
      type: account.type,
      provider: account.provider ?? "",
      accountNumber: account.accountNumber ?? "",
      status: account.status,
    });
  }, [account]);

  function updateField<K extends keyof PaymentAccountFormState>(
    key: K,
    value: PaymentAccountFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit() {
    const payload: CreatePaymentAccountInput = {
      name: form.name,
      type: form.type,
      provider: form.provider || undefined,
      accountNumber: form.accountNumber || undefined,
      status: form.status,
    };

    if (editMode && account) {
      update.mutate({
        id: account.id,
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
        {editMode ? "Edit Payment Account" : "Add Payment Account"}
      </h2>

      <input
        className="w-full rounded border p-2"
        placeholder="Account Name (e.g., bKash Merchant, Daraz Marketplace)"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <select
        className="w-full rounded border p-2"
        value={form.type}
        onChange={(e) =>
          updateField("type", e.target.value as PaymentAccountType)
        }
      >
        {ACCOUNT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type
              .split("_")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </option>
        ))}
      </select>

      <input
        className="w-full rounded border p-2"
        placeholder="Provider (e.g., bKash, Nagad, Daraz, Bikroy)"
        value={form.provider}
        onChange={(e) => updateField("provider", e.target.value)}
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Account Number / Merchant ID (optional)"
        value={form.accountNumber}
        onChange={(e) => updateField("accountNumber", e.target.value)}
      />

      <select
        className="w-full rounded border p-2"
        value={form.status}
        onChange={(e) =>
          updateField("status", e.target.value as PaymentAccountStatus)
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
          {editMode ? "Update Account" : "Create Account"}
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