import { Minus, Plus, Trash2 } from "lucide-react";

import { formatCurrency } from "../../dashboard/utils/format";

import type { Cart, CartItem } from "../types/pos.types";

type POSCartProps = {
  cart: Cart;

  onIncrease: (lineId: string) => void;

  onDecrease: (lineId: string) => void;

  onRemove: (lineId: string) => void;

  onClear: () => void;
};

/**
 * Cart panel for the POS workspace.
 *
 * Renders the current transaction lines with inline quantity controls and
 * per-line remove. Totals are surfaced by the parent (via `cart`) so this
 * component stays presentational. All cart math lives in `usePOSCart`.
 */
export default function POSCart({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
}: POSCartProps) {
  const items: CartItem[] = cart.items;

  return (
    <div className="surface flex h-full flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Cart
          </h2>

          <p className="text-sm text-[var(--nebula-text-muted)]">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-[var(--nebula-border)] px-3 py-1.5 text-sm text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="flex h-full min-h-[160px] items-center justify-center rounded-lg border border-dashed border-[var(--nebula-border)] p-6 text-center text-sm text-[var(--nebula-text-muted)]">
            No items yet. Search and tap a product to begin.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-[var(--nebula-text-primary)]">
                    {item.name}
                  </div>

                  <div className="text-xs text-[var(--nebula-text-muted)]">
                    {item.sku}
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => onRemove(item.id)}
                  className="rounded-md p-1 text-[var(--nebula-text-muted)] transition-colors hover:text-[var(--nebula-danger)]"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center rounded-md border border-[var(--nebula-border)]">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => onDecrease(item.id)}
                    className="px-2 py-1 text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="min-w-[2rem] text-center text-sm font-medium text-[var(--nebula-text-primary)]">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => onIncrease(item.id)}
                    className="px-2 py-1 text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-[var(--nebula-text-primary)]">
                    {formatCurrency(item.subtotal)}
                  </div>

                  <div className="text-xs text-[var(--nebula-text-muted)]">
                    {formatCurrency(item.unitPrice)} ea
                  </div>
                </div>
              </div>

              {(item.discount > 0 || item.tax > 0) && (
                <div className="mt-2 flex justify-between text-xs text-[var(--nebula-text-muted)]">
                  <span>
                    Discount: {formatCurrency(item.discount)}
                  </span>

                  <span>Tax: {formatCurrency(item.tax)}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
