import { useState } from "react";

import { usePOSCart, type POSProductInput } from "../hooks/usePOSCart";

import POSProductSearch from "../components/POSProductSearch";
import POSCart from "../components/POSCart";
import POSCustomerSelect from "../components/POSCustomerSelect";
import POSCheckout from "../components/POSCheckout";
import POSPaymentPanel from "../components/POSPaymentPanel";
import POSReceipt from "../components/POSReceipt";
import POSPrintReceipt from "../components/POSPrintReceipt";

import { createPOSTransaction } from "../services/pos.service";

import { useWarehouses } from "../../inventory/hooks/useWarehouse";
import useCurrentUser from "../../../hooks/useCurrentUser";

import { useCurrentShift, useShiftMutation } from "../shift/hooks/useShift";
import POSOpenShift from "../shift/components/POSOpenShift";
import POSShiftPanel from "../shift/components/POSShiftPanel";
import POSCloseShift from "../shift/components/POSCloseShift";

import type { POSCustomer } from "../types/pos.types";
import type { POSPayment } from "../types/transaction.types";
import type { POSTransactionResult } from "../services/pos.service";

/** Stage of the checkout flow shown in the right-hand column. */
type POSStage = "checkout" | "payment" | "receipt";

/**
 * POS workspace.
 *
 * Professional cashier layout:
 *   ┌──────────────┬──────────────┐
 *   │ Product      │ Cart         │
 *   │ Search       │ (right)      │
 *   ├──────────────┴──────────────┤
 *   │ Customer + Warehouse + Checkout │  (bottom)
 *   └─────────────────────────────┘
 *
 * The checkout now drives a *real* sale:
 *
 *   Cart → Warehouse → Checkout → Payment → Confirm →
 *     Sales + Payments (→ Accounting) → Delivery → Stock Movement → Inventory
 *
 * Cart state is owned by `usePOSCart` (frontend-only). Products, customers and
 * warehouses are sourced from the Inventory and Sales modules respectively —
 * POS never duplicates that logic. The sale + payment + delivery + stock are
 * created through the existing Sales/Payment/Inventory services (sources of
 * truth); POS only orchestrates them.
 */
export default function POSPage() {
  const {
    cart,
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
  } = usePOSCart();

  const { data: warehouses = [] } = useWarehouses();

  const { data: me } = useCurrentUser();

  const { data: shiftData, isLoading: shiftLoading } = useCurrentShift();

  const { addMovement } = useShiftMutation();

  const shift = shiftData?.shift ?? null;

  const [customer, setCustomer] = useState<POSCustomer | null>(null);
  const [warehouseId, setWarehouseId] = useState<string>("");

  const [stage, setStage] = useState<POSStage>("checkout");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<POSTransactionResult | null>(null);

  const [closing, setClosing] = useState(false);

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

  function handleCompleteSale() {
    setError(null);
    setStage("payment");
  }

  async function handleConfirmPayment(payments: POSPayment[]) {
    setProcessing(true);
    setError(null);

    try {
      const created = await createPOSTransaction(
        cart,
        customer,
        payments,
        warehouseId,
        shift?.id,
      );

      // Record the cash sale against the open shift so expected cash stays in
      // sync. Best-effort: a failure here must never void the completed sale.
      if (shift) {
        try {
          await addMovement.mutateAsync({
            shiftId: shift.id,
            input: {
              type: "sale",
              amount: created.transaction.total,
              description: `POS sale ${created.salesOrder.orderNumber}`,
            },
          });
        } catch {
          // Non-fatal for the sale itself; the shift can be reconciled from
          // the POS sale record on close.
        }
      }

      setResult(created);
      setStage("receipt");
      clearCart();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create sale.",
      );
    } finally {
      setProcessing(false);
    }
  }

  function handleCancelPayment() {
    setError(null);
    setStage("checkout");
  }

  function handleNewSale() {
    setResult(null);
    setError(null);
    setStage("checkout");
  }

  // Before a shift is open, the cashier must open the register.
  if (!shiftLoading && !shift) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nebula-text-primary)]">
            Point of Sale
          </h1>

          <p className="mt-2 text-[var(--nebula-text-secondary)]">
            Open the cash register to begin selling.
          </p>
        </div>

        <POSOpenShift
          cashierName={me?.data?.name ?? ""}
          onOpened={() => {
            // `useCurrentShift` refetches via its invalidation on open.
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--nebula-text-primary)]">
          Point of Sale
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Tap products to build a sale, collect payment, and post the
          transaction to Sales and Accounting.
        </p>
      </div>

      {/* Active shift banner */}
      {shift && (
        <POSShiftPanel
          shift={shift}
          movements={shiftData?.movements ?? []}
          onCloseShift={() => setClosing(true)}
        />
      )}

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

      {/* Bottom: customer select + checkout / payment / receipt */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <POSCustomerSelect
            value={customer}
            onChange={(next) => {
              setCustomer(next);
              setError(null);
            }}
          />
        </section>

        <section className="lg:col-span-2">
          <div className="h-[420px]">
            {stage === "checkout" && (
              <POSCheckout
                cart={cart}
                customer={customer}
                warehouseId={warehouseId}
                warehouses={warehouses}
                onWarehouseChange={(next) => {
                  setWarehouseId(next);
                  setError(null);
                }}
                onCompleteSale={handleCompleteSale}
              />
            )}

            {stage === "payment" && (
              <POSPaymentPanel
                cart={cart}
                customer={customer}
                onConfirm={handleConfirmPayment}
                onCancel={handleCancelPayment}
                processing={processing}
                error={error}
              />
            )}

            {stage === "receipt" && result && (
              <div className="flex h-[420px] flex-col gap-4 overflow-y-auto">
                <POSReceipt
                  result={result}
                  cart={cart}
                  customer={customer}
                  shift={shift}
                  cashierName={me?.data?.name}
                  receiptNumber={result.salesOrder.orderNumber}
                  onClose={handleNewSale}
                />

                {/* Thermal / 80mm print step — replaces the page-wide
                    window.print() with a dedicated thermal receipt in a
                    hidden iframe. Mounts and auto-triggers the print dialog. */}
                <POSPrintReceipt
                  result={result}
                  cart={cart}
                  customer={customer}
                  shift={shift}
                  cashierName={me?.data?.name}
                  receiptNumber={result.salesOrder.orderNumber}
                  onClose={handleNewSale}
                />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Close-shift reconciliation overlay */}
      {closing && shift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md">
            <POSCloseShift
              shift={shift}
              movements={shiftData?.movements ?? []}
              onClosed={() => {
                setClosing(false);
                handleNewSale();
              }}
              onCancel={() => setClosing(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
