import { useMemo, useState } from "react";

import {
  usePaymentAllocationMutation,
  usePaymentAllocations,
} from "../hooks/usePayments";

import { allocatePaymentFIFO } from "../services/payment-allocation.service";

import type {
  AllocationDocumentType,
  OutstandingDocument,
  Payment,
} from "../types/payment.types";

type PaymentAllocationFormProps = {
  payments: Payment[];
  outstandingDocuments: OutstandingDocument[];
};

type AllocationDraft = {
  documentId: string;
  documentType: AllocationDocumentType;
  documentNumber: string;
  documentDate: string;
  documentTotal: number;
  amount: number;
};

export default function PaymentAllocationForm({
  payments,
  outstandingDocuments,
}: PaymentAllocationFormProps) {
  const { create, remove } = usePaymentAllocationMutation();

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const [drafts, setDrafts] = useState<Record<string, AllocationDraft>>({});
  const [error, setError] = useState<string | null>(null);

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId);

  const availableDocuments = useMemo(
    () =>
      outstandingDocuments.filter(
        (doc) =>
          selectedPayment &&
          (selectedPayment.type === "receivable"
            ? doc.documentType === "sales_invoice"
            : doc.documentType === "purchase_invoice"),
      ),
    [outstandingDocuments, selectedPayment],
  );

  const { data: allocations = [] } = usePaymentAllocations(
    selectedPaymentId,
  );

  const allocatedTotal = Object.values(drafts).reduce(
    (sum, d) => sum + (d.amount || 0),
    0,
  );

  const remainingPayment =
    (selectedPayment?.amount ?? 0) - allocatedTotal;

  function handleSelectPayment(paymentId: string) {
    setSelectedPaymentId(paymentId);
    setDrafts({});
    setError(null);
  }

  function toggleDocument(doc: OutstandingDocument) {
    setError(null);

    setDrafts((prev) => {
      const next = { ...prev };

      if (next[doc.documentId]) {
        delete next[doc.documentId];
      } else {
        const suggested = Math.min(
          doc.due,
          selectedPayment?.amount ?? 0,
        );

        next[doc.documentId] = {
          documentId: doc.documentId,
          documentType: doc.documentType,
          documentNumber: doc.documentNumber,
          documentDate: doc.date,
          documentTotal: doc.total,
          amount: suggested,
        };
      }

      return next;
    });
  }

  function updateAmount(documentId: string, amount: number) {
    setError(null);

    setDrafts((prev) => {
      if (!prev[documentId]) return prev;

      return {
        ...prev,
        [documentId]: {
          ...prev[documentId],
          amount,
        },
      };
    });
  }

  function applyFifo() {
    setError(null);

    if (!selectedPayment) return;

    const fifo = allocatePaymentFIFO(
      selectedPayment.amount,
      availableDocuments,
    );

    const next: Record<string, AllocationDraft> = {};

    for (const result of fifo) {
      const doc = availableDocuments.find(
        (d) => d.documentId === result.documentId,
      );

      if (!doc) continue;

      next[doc.documentId] = {
        documentId: doc.documentId,
        documentType: doc.documentType,
        documentNumber: doc.documentNumber,
        documentDate: doc.date,
        documentTotal: doc.total,
        amount: result.allocatedAmount,
      };
    }

    setDrafts(next);
  }

  function submit() {
    setError(null);

    if (!selectedPayment) {
      setError("Select a payment first.");
      return;
    }

    const entries = Object.values(drafts);

    if (entries.length === 0) {
      setError("Select at least one invoice to allocate.");
      return;
    }

    if (allocatedTotal > selectedPayment.amount) {
      setError("Allocation total cannot exceed the payment amount.");
      return;
    }

    for (const entry of entries) {
      const doc = availableDocuments.find(
        (d) => d.documentId === entry.documentId,
      );

      if (entry.amount <= 0) {
        setError("Allocation amount must be greater than 0.");
        return;
      }

      if (doc && entry.amount > doc.due) {
        setError(
          `Allocation for ${entry.documentNumber} cannot exceed its due amount.`,
        );
        return;
      }
    }

    entries.forEach((entry) => {
      create.mutate({
        paymentId: selectedPayment.id,
        documentId: entry.documentId,
        documentType: entry.documentType,
        documentNumber: entry.documentNumber,
        documentDate: entry.documentDate,
        documentTotal: entry.documentTotal,
        allocatedAmount: entry.amount,
      });
    });

    setDrafts({});
  }

  return (
    <div className="surface p-5 space-y-4">
      <h2 className="text-xl font-bold">Allocate Payment</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          className="w-full rounded border p-2"
          value={selectedPaymentId}
          onChange={(e) => handleSelectPayment(e.target.value)}
        >
          <option value="">Select Payment</option>
          {payments.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.type === "payable" ? "Pay" : "Receipt"}{" "}
              ${payment.amount.toFixed(2)} · {payment.date} ·{" "}
              {payment.reference || "—"}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            className="rounded border px-3 py-2 text-sm"
            onClick={applyFifo}
            disabled={!selectedPayment}
          >
            Auto (FIFO)
          </button>

          <span className="text-sm text-[var(--nebula-text-secondary)]">
            Remaining: ${remainingPayment.toFixed(2)}
          </span>
        </div>
      </div>

      {selectedPayment && (
        <div className="surface overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Invoice</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-right">Paid</th>
                <th className="p-3 text-right">Due</th>
                <th className="p-3 text-right">Allocate</th>
              </tr>
            </thead>
            <tbody>
              {availableDocuments.map((doc) => {
                const draft = drafts[doc.documentId];

                return (
                  <tr key={doc.documentId} className="border-b">
                    <td className="p-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!draft}
                          onChange={() => toggleDocument(doc)}
                        />
                        {doc.documentNumber}
                      </label>
                    </td>
                    <td className="p-3">{doc.date}</td>
                    <td className="p-3 text-right">
                      ${doc.total.toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      ${doc.paid.toFixed(2)}
                    </td>
                    <td className="p-3 text-right">${doc.due.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <input
                        className="w-28 rounded border p-1 text-right"
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={!draft}
                        value={draft?.amount ?? 0}
                        onChange={(e) =>
                          updateAmount(
                            doc.documentId,
                            Number(e.target.value),
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}

              {availableDocuments.length === 0 && (
                <tr>
                  <td
                    className="p-3 text-center text-sm text-[var(--nebula-text-secondary)]"
                    colSpan={6}
                  >
                    No outstanding invoices for this payment type.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Allocated: ${allocatedTotal.toFixed(2)}
        </span>

        <button
          className="rounded bg-black px-4 py-2 text-white"
          onClick={submit}
          disabled={!selectedPayment}
        >
          Save Allocation
        </button>
      </div>

      {selectedPayment && allocations.length > 0 && (
        <div className="space-y-2 border-t pt-3">
          <h3 className="text-sm font-semibold">Existing Allocations</h3>

          <ul className="space-y-1 text-sm">
            {allocations.map((allocation) => (
              <li
                key={allocation.id}
                className="flex items-center justify-between"
              >
                <span>
                  {allocation.documentNumber} — $
                  {allocation.allocatedAmount.toFixed(2)}
                </span>
                <button
                  className="text-xs text-red-600"
                  onClick={() =>
                    remove.mutate({
                      paymentId: selectedPayment.id,
                      allocationId: allocation.id,
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}