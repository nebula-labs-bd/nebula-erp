import { useState } from "react";

import { usePOSCart, type POSProductInput } from "../hooks/usePOSCart";

import POSProductSearch from "../components/POSProductSearch";
import POSCart from "../components/POSCart";
import POSCustomerSelect from "../components/POSCustomerSelect";
import POSCheckout from "../components/POSCheckout";

import type { POSCustomer } from "../types/pos.types";

/**
 * POS workspace.
 *
 * Professional cashier layout:
 *   ┌──────────────┬──────────────┐
 *   │ Product      │ Cart         │
 *   │ Search       │              │
 *   │ (left)       │ (right)      │
 *   ├──────────────┴──────────────┤
 *   │ Customer  +  Checkout       │  (bottom)
 *   └─────────────────────────────┘
 *
 * Cart state is owned by `usePOSCart` (frontend-only). Products and customers
 * are sourced from the Inventory and Sales modules respectively — POS never
 * duplicates that logic.
 */
export default function POSPage() {
  const {
    cart,
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
  } = usePOSCart();

  const [customer, setCustomer] = useState<POSCustomer | null>(null);

  function handleAdd(product: POSProductInput) {
    addProduct(product);
  }

  function handleIncrease(lineId: string) {
    const item = cart.items.find((line) => line.id === lineId);

    if (item) {
      updateQuantity(lineId, item.quantity + 1);
    }
  }

  function handleDecrease(lineId: string) {
    const item = cart.items.find((line) => line.id === lineId);

    if (item) {
      updateQuantity(lineId, Math.max(0, item.quantity - 1));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--nebula-text-primary)]">
          Point of Sale
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Tap products to build a sale. Complete the transaction in the Sales
          module — your single source of truth for orders.
        </p>
      </div>

      {/* Main workspace: search (left) + cart (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="h-[60vh] min-h-[420px]">
            <POSProductSearch onSelectProduct={handleAdd} />
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="h-[60vh] min-h-[420px]">
            <POSCart
              cart={cart}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={removeProduct}
              onClear={clearCart}
            />
          </div>
        </section>
      </div>

      {/* Bottom: customer select + checkout summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <POSCustomerSelect
            value={customer}
            onChange={setCustomer}
          />
        </section>

        <section className="lg:col-span-2">
          <POSCheckout
            cart={cart}
            customer={customer}
          />
        </section>
      </div>
    </div>
  );
}
