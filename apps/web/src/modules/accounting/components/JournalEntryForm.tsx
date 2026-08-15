import { useMemo, useState } from "react";

import { useJournalMutation } from "../hooks/useJournalEntries";

import type {
  Account,
  CreateJournalLineInput,
} from "../types/accounting.types";

type JournalEntryFormProps = {
  accounts: Account[];
};

type DraftLine = {
  accountId: string;
  debit: string;
  credit: string;
};

const emptyLine: DraftLine = {
  accountId: "",
  debit: "0",
  credit: "0",
};

export default function JournalEntryForm({
  accounts,
}: JournalEntryFormProps) {
  const { create } = useJournalMutation();

  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([{ ...emptyLine }]);
  const [error, setError] = useState<string | null>(null);

  const { totalDebit, totalCredit } = useMemo(() => {
    const debit = lines.reduce(
      (sum, line) => sum + (Number(line.debit) || 0),
      0,
    );
    const credit = lines.reduce(
      (sum, line) => sum + (Number(line.credit) || 0),
      0,
    );

    return { totalDebit: debit, totalCredit: credit };
  }, [lines]);

  function updateLine(
    index: number,
    key: keyof DraftLine,
    value: string,
  ) {
    setLines((prev) =>
      prev.map((line, i) =>
        i === index ? { ...line, [key]: value } : line,
      ),
    );
  }

  function addLine() {
    setLines((prev) => [...prev, { ...emptyLine }]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  function submit() {
    setError(null);

    const parsed: CreateJournalLineInput[] = lines
      .map((line) => ({
        accountId: line.accountId,
        debit: Number(line.debit) || 0,
        credit: Number(line.credit) || 0,
      }))
      .filter((line) => line.accountId);

    if (parsed.length === 0) {
      setError("Add at least one line with an account.");
      return;
    }

    if (parsed.some((line) => line.debit === 0 && line.credit === 0)) {
      setError("Each line must have a debit or credit amount.");
      return;
    }

    const debit = parsed.reduce((sum, line) => sum + line.debit, 0);
    const credit = parsed.reduce((sum, line) => sum + line.credit, 0);

    if (Math.abs(debit - credit) > 0.001) {
      setError(
        `Cannot save unbalanced entry. Debit (${debit}) must equal Credit (${credit}).`,
      );
      return;
    }

    create.mutate({
      date,
      reference,
      description,
      lines: parsed,
    });

    setDate("");
    setReference("");
    setDescription("");
    setLines([{ ...emptyLine }]);
  }

  const balanced = Math.abs(totalDebit - totalCredit) < 0.001;

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">Add Journal Entry</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          className="w-full rounded border p-2"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="hidden grid-cols-12 gap-2 px-2 text-sm font-semibold md:grid">
          <span className="col-span-6">Account</span>
          <span className="col-span-2 text-right">Debit</span>
          <span className="col-span-2 text-right">Credit</span>
          <span className="col-span-2" />
        </div>

        {lines.map((line, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center"
          >
            <select
              className="w-full rounded border p-2 md:col-span-6"
              value={line.accountId}
              onChange={(e) =>
                updateLine(index, "accountId", e.target.value)
              }
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </option>
              ))}
            </select>

            <input
              className="w-full rounded border p-2 text-right md:col-span-2"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={line.debit}
              onChange={(e) => updateLine(index, "debit", e.target.value)}
            />

            <input
              className="w-full rounded border p-2 text-right md:col-span-2"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={line.credit}
              onChange={(e) =>
                updateLine(index, "credit", e.target.value)
              }
            />

            <button
              type="button"
              className="rounded border px-3 py-2 text-sm md:col-span-2"
              onClick={() => removeLine(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          className="rounded border px-3 py-2 text-sm"
          onClick={addLine}
        >
          + Add Line
        </button>
      </div>

      <div className="flex items-center justify-between border-t pt-3 text-sm">
        <div>
          <span className="mr-4">Total Debit: ${totalDebit.toFixed(2)}</span>
          <span>Total Credit: ${totalCredit.toFixed(2)}</span>
        </div>

        <span
          className={
            balanced
              ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
              : "rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
          }
        >
          {balanced ? "Balanced" : "Unbalanced"}
        </span>
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
        Create Journal Entry
      </button>
    </div>
  );
}