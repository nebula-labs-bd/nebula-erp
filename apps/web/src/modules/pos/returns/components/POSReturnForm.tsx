import { useMemo, useState } from "react";

import { Search, RotateCcw, Loader2 } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import { useFindInvoice, useCreateReturn } from "../hooks/useReturns";

import type { POSReturnItem } from "../types/return.types";

type POSReturnFormProps = {
  warehouseId: string;
  customerId: string;
  shiftId?: string;
  onReturned?: () => void;
};

/**
 * POS Return Form.
 * Flow: Find Invoice → Select Items → Return Quantity → Create Return.
 * POS never mutates stock/inventory/accounting directly.
 */
export default function POSReturnForm({
  warehouseId,
  customerId,
  shiftId,
  onReturned,
}: POSReturnFormProps) {
  const [orderNumber, setOrderNumber] = useState("");
  const [reason, setReason] = useState("");

  const findQuery = useFindInvoice(orderNumber);
  const createReturn = useCreateReturn();

  const invoice = findQuery.data ?? null;
  const items = useMemo(() => invoice?.items ?? [], [invoice]);

  const [selected, setSelected] = useState<Record<string, number>>({});

  function toggleItem(itemId: string, maxQty: number) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[itemId]) delete next[itemId];
      else next[itemId] = maxQty;
      return next;
    });
  }

  function setQty(itemId: string, qty: number, maxQty: number) {
    const clamped = Math.max(0, Math.min(qty, maxQty));
    setSelected((prev) => ({ ...prev, [itemId]: clamped }));
  }

  const returnItems: POSReturnItem[] = useMemo(() => {
    if (!invoice) return [];
    return items
      .filter((item) => (selected[item.id] ?? 0) > 0)
      .map((item) => ({
        salesOrderItemId: item.id,
        productId: item.productId,
        quantity: selected[item.id],
        price: item.sellingPrice,
        discount: item.discount,
        tax: item.tax,
        subtotal:
          item.sellingPrice * selected[item.id] - item.discount + item.tax,
        productName: item.productId,
      }));
  }, [invoice, items, selected]);

  const total = useMemo(
    () => returnItems.reduce((s, i) => s + i.subtotal, 0),
    [returnItems],
  );

  const canSubmit = !!invoice && returnItems.length > 0 && !createReturn.isPending;

  async function handleSubmit() {
    if (!invoice || returnItems.length === 0) return;
    await createReturn.mutateAsync({
      salesOrderId: invoice.id,
      salesOrderNumber: invoice.orderNumber,
      customerId,
      warehouseId,
      items: returnItems,
      reason: reason.trim() || "Customer return",
      shiftId,
    });
    setOrderNumber("");
    setReason("");
    setSelected({});
    onReturned?.();
  }

  return (
    <div className="surface flex h-full flex-col p-4">
      <div className="mb-3 flex items-center gap-2">
        <RotateCcw size={18} className="text-[var(--nebula-text-secondary)]" />
        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Return / Refund
        </h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Invoice number (e.g. POS-...)"
          value={orderNumber}
          onChange={(e) => {
            setOrderNumber(e.target.value);
            setSelected({});
          }}
          className="flex-1 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
        />
        <button
          type="button"
          disabled={orderNumber.trim().length === 0}
          onClick={() => findQuery.refetch()}
          className="flex items-center gap-1 rounded-lg border border-[var(--nebula-border)] px-3 py-2 text-sm text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)] disabled:opacity-50"
        >
          <Search size={14} /> Find
        </button>
      </div>

      {findQuery.isFetching && (
        <p className="mt-2 flex items-center gap-1 text-xs text-[var(--nebula-text-muted)]">
          <Loader2 size={12} className="animate-spin" /> Looking up invoice…
        </p>
      )}

      {findQuery.data === null && orderNumber.trim().length > 0 && !findQuery.isFetching && (
        <p className="mt-2 text-xs text-[var(--nebula-danger)]">
          Invoice not found.
        </p>
      )}

      {invoice && (
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const maxQty = item.quantity;
            const qty = selected[item.id] ?? 0;
            const active = qty > 0;
            return (
              <div
                key={item.id}
                className={`rounded-lg border p-3 ${
                  active
                    ? "border-[var(--nebula-primary)] bg-[var(--nebula-surface)]"
                    : "border-[var(--nebula-border)] bg-[var(--nebula-surface)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--nebula-text-primary)]">
                    {item.productId}
                  </span>
                  <label className="flex items-center gap-2 text-xs text-[var(--nebula-text-muted)]">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleItem(item.id, maxQty)}
                    />
                    Return
                  </label>
                </div>
                <p className="text-xs text-[var(--nebula-text-muted)]">
                  Sold: {maxQty} × {formatCurrency(item.sellingPrice)}
                </p>
                {active && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-[var(--nebula-text-secondary)]">Qty:</span>
                    <input
                      type="number"
                      min={1}
                      max={maxQty}
                      value={qty}
                      onChange={(e) => setQty(item.id, Number(e.target.value), maxQty)}
                      className="w-20 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-2 py-1 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-3">
            <label className="mb-1 block text-xs font-medium text-[var(--nebula-text-secondary)]">Reason</label>
            <input
              type="text"
              placeholder="Reason for return"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
            />
          </div>
        </div>
      )}

      {canSubmit && (
        <div className="mt-3 border-t border-[var(--nebula-border)] pt-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[var(--nebula-text-secondary)]">Refund Total</span>
            <span className="font-semibold text-[var(--nebula-primary)]">
              {formatCurrency(total)}
            </span>
          </div>
          <button
            type="button"
            disabled={createReturn.isPending}
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--nebula-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createReturn.isPending ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
            {createReturn.isPending ? "Processing…" : "Create Return"}
          </button>
          {createReturn.isSuccess && (
            <p className="mt-2 rounded-md border border-green-300 bg-green-50 p-2 text-xs text-green-700">
              Return processed. Stock restored & refund issued.
            </p>
          )}
          {createReturn.isError && (
            <p className="mt-2 rounded-md border border-red-300 bg-red-50 p-2 text-xs text-red-700">
              Failed to process return.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
