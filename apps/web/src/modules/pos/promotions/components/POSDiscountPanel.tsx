import { useState } from "react";

import { Percent, Tag, X } from "lucide-react";

import { formatCurrency } from "../../../dashboard/utils/format";

import {
  applyDiscounts,
  evaluatePromotions,
} from "../services/DiscountCalculator";

import type { Cart, CartItem } from "../../types/pos.types";

import type {
  DiscountResult,
  POSDiscount,
  POSPromotion,
} from "../types/discount.types";

type POSDiscountPanelProps = {
  cart: Cart;
  promotions?: POSPromotion[];
  onApply: (result: DiscountResult) => void;
};

/**
 * POS Discount & Promotion panel.
 * Allows manual line/invoice discounts and auto-applies configured promotions.
 * Discounts adjust the cart only — no inventory/accounting mutation.
 */
export default function POSDiscountPanel({
  cart,
  promotions = [],
  onApply,
}: POSDiscountPanelProps) {
  const [manual, setManual] = useState<POSDiscount[]>([]);
  const [promoCode, setPromoCode] = useState("");

  const matchedPromos = evaluatePromotions(cart, promotions);
  const allDiscounts = [...matchedPromos, ...manual];

  const result = applyDiscounts(cart, allDiscounts);

  function addLineDiscount(item: CartItem) {
    const value = window.prompt(
      `Discount for ${item.name} (percent or fixed amount):`,
      "10",
    );
    if (value == null) return;
    const isPercent = !value.startsWith("$");
    const num = isPercent ? Number(value) : Number(value.replace("$", ""));
    if (Number.isNaN(num)) return;
    setManual((prev) => [
      ...prev,
      {
        id: `manual-${item.id}-${Date.now()}`,
        type: isPercent ? "percentage" : "fixed",
        value: num,
        scope: "line",
        lineId: item.id,
        label: `Manual ${isPercent ? num + "%" : formatCurrency(num)}`,
      },
    ]);
  }

  function addInvoiceDiscount() {
    const value = window.prompt("Invoice discount (percent or fixed amount):", "5");
    if (value == null) return;
    const isPercent = !value.startsWith("$");
    const num = isPercent ? Number(value) : Number(value.replace("$", ""));
    if (Number.isNaN(num)) return;
    setManual((prev) => [
      ...prev,
      {
        id: `manual-inv-${Date.now()}`,
        type: isPercent ? "percentage" : "fixed",
        value: num,
        scope: "invoice",
        label: `Invoice ${isPercent ? num + "%" : formatCurrency(num)}`,
      },
    ]);
  }

  function removeDiscount(id: string) {
    setManual((prev) => prev.filter((d) => d.id !== id));
  }

  function applyCode() {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    const promo = promotions.find((p) => p.code.toUpperCase() === code);
    if (promo) {
      setManual((prev) => [
        ...prev,
        {
          id: `promo-${promo.code}-${Date.now()}`,
          type: promo.type,
          value: promo.value,
          scope: promo.scope,
          label: promo.label,
        },
      ]);
    }
    setPromoCode("");
  }

  return (
    <div className="surface flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Tag size={18} className="text-[var(--nebula-text-secondary)]" />
        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Discounts & Promotions
        </h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text-primary)] outline-none focus:border-[var(--nebula-primary)]"
        />
        <button
          type="button"
          onClick={applyCode}
          className="rounded-lg border border-[var(--nebula-border)] px-3 py-2 text-xs text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)]"
        >
          Apply
        </button>
      </div>

      {allDiscounts.length > 0 && (
        <div className="space-y-1">
          {allDiscounts.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-md border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-1.5 text-xs"
            >
              <span className="text-[var(--nebula-text-secondary)]">
                {d.label} ({d.scope})
              </span>
              <button
                type="button"
                onClick={() => removeDiscount(d.id)}
                className="text-[var(--nebula-danger)]"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {cart.items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => addLineDiscount(item)}
            className="flex items-center gap-1 rounded-lg border border-[var(--nebula-border)] px-2 py-1 text-xs text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)]"
          >
            <Percent size={12} /> {item.name}
          </button>
        ))}
        <button
          type="button"
          onClick={addInvoiceDiscount}
          className="flex items-center gap-1 rounded-lg border border-dashed border-[var(--nebula-primary)] px-2 py-1 text-xs text-[var(--nebula-primary)]"
        >
          <Percent size={12} /> Invoice %
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--nebula-border)] pt-2 text-sm">
        <span className="text-[var(--nebula-text-secondary)]">Total Discount</span>
        <span className="font-semibold text-[var(--nebula-primary)]">
          {formatCurrency(result.totalDiscount)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onApply(result)}
        className="mt-1 w-full rounded-lg bg-[var(--nebula-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--nebula-primary-hover)]"
      >
        Apply Discounts
      </button>
    </div>
  );
}

