import { useEffect, useState } from "react";

import { useAccountMutation } from "../hooks/useAccounts";

import type {
  Account,
  AccountStatus,
  AccountType,
  CreateAccountInput,
} from "../types/accounting.types";

type AccountFormProps = {
  accounts: Account[];
  account?: Account;
  onCancel?: () => void;
};

type AccountFormState = {
  code: string;
  name: string;
  type: AccountType;
  parentId: string;
  status: AccountStatus;
};

const ACCOUNT_TYPES: AccountType[] = [
  "asset",
  "liability",
  "equity",
  "income",
  "expense",
];

const initialState: AccountFormState = {
  code: "",
  name: "",
  type: "asset",
  parentId: "",
  status: "active",
};

export default function AccountForm({
  accounts,
  account,
  onCancel,
}: AccountFormProps) {
  const { create, update } = useAccountMutation();

  const [form, setForm] =
    useState<AccountFormState>(initialState);

  const editMode = Boolean(account);

  useEffect(() => {
    if (!account) {
      setForm(initialState);
      return;
    }

    setForm({
      code: account.code,
      name: account.name,
      type: account.type,
      parentId: account.parentId ?? "",
      status: account.status,
    });
  }, [account]);

  function updateField<K extends keyof AccountFormState>(
    key: K,
    value: AccountFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit() {
    const payload: CreateAccountInput = {
      code: form.code,
      name: form.name,
      type: form.type,
      parentId: form.parentId || undefined,
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

  const parentCandidates = accounts.filter(
    (candidate) => candidate.id !== account?.id,
  );

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">
        {editMode ? "Edit Account" : "Add Account"}
      </h2>

      <input
        className="w-full rounded border p-2"
        placeholder="Account Code"
        value={form.code}
        onChange={(e) => updateField("code", e.target.value)}
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Account Name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <select
        className="w-full rounded border p-2"
        value={form.type}
        onChange={(e) =>
          updateField("type", e.target.value as AccountType)
        }
      >
        {ACCOUNT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      <select
        className="w-full rounded border p-2"
        value={form.parentId}
        onChange={(e) => updateField("parentId", e.target.value)}
      >
        <option value="">No Parent (Root)</option>
        {parentCandidates.map((candidate) => (
          <option key={candidate.id} value={candidate.id}>
            {candidate.code} - {candidate.name}
          </option>
        ))}
      </select>

      <select
        className="w-full rounded border p-2"
        value={form.status}
        onChange={(e) =>
          updateField("status", e.target.value as AccountStatus)
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