import { useMemo, useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  X,
} from "lucide-react";

import { usePOSCart, type POSProductInput } from "../hooks/usePOSCart";

import POSProductSearch from "../components/POSProductSearch";
import POSCart from "../components/POSCart";
import POSCustomerSelect from "../components/POSCustomerSelect";
import POSCheckout from "../components/POSCheckout";
import POSPaymentPanel from "../components/POSPaymentPanel";
import POSReceipt from "../components/POSReceipt";
import POSPrintReceipt from "../components/POSPrintReceipt";
import POSQuickActions from "../components/POSQuickActions";
import POSCustomerHistory from "../components/POSCustomerHistory";
import POSDashboard from "../components/POSDashboard";

import POSDiscountPanel from "../promotions/components/POSDiscountPanel";
import RedeemPointsPanel from "../loyalty/components/RedeemPointsPanel";
import POSReturnForm from "../returns/components/POSReturnForm";

import { createPOSTransaction } from "../services/pos.service";

import { useWarehouses } from "../../inventory/hooks/useWarehouse";
import useCurrentUser from "../../../hooks/useCurrentUser";
import usePermission from "../../../hooks/usePermission";
import { permissions } from "../../../permissions/permissions";

import { useEarnPoints } from "../loyalty/hooks/useLoyalty";
import { currencyToPoints } from "../loyalty/services/loyalty.service";

import { useCurrentShift, useShiftMutation } from "../shift/hooks/useShift";
import POSOpenShift from "../shift/components/POSOpenShift";
import POSShiftPanel from "../shift/components/POSShiftPanel";
import POSCloseShift from "../shift/components/POSCloseShift";

import type { POSCustomer, Cart } from "../types/pos.types";
import type { POSPayment } from "../types/transaction.types";
import type { POSTransactionResult } from "../services/pos.service";
import type { POSReportParams } from "../reports/types/report.types";
import type { DiscountResult } from "../promotions/types/discount.types";

/** Stage of the checkout flow shown in the right-hand column. */
type POSStage = "checkout" | "payment" | "receipt";

/** Top-level view toggle: sales workspace or dashboard. */
type POSView = "sale" | "dashboard";

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
    replaceCart,
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

  const [activeView, setActiveView] = useState<POSView>("sale");

  const { can } = usePermission();

  // Permission-aware affordances (Cashier vs Manager boundaries).
  // Managers (and admins) can view reports and issue refunds; cashiers
  // sell and view their own shift/sales only.
  const canViewReports = can(permissions.REPORTS_VIEW);
  const canManageReturns = can(permissions.REPORTS_VIEW);

  const today = new Date().toISOString().split("T")[0];
  const reportParams: POSReportParams = {
    date: today,
    shiftId: shift?.id,
  };

  const earnPoints = useEarnPoints(customer?.id ?? null);

  // Manually applied discount (currency) + loyalty discount (currency) that
  // fold into the checkout display + receipt. Display-only at POS; the real
  // discount is taken on the cart by reusing the promotions calculator.
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);

  // Overlay state for quick actions.
  const [showDiscount, setShowDiscount] = useState(false);
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  const [showReceipts, setShowReceipts] = useState(false);

  // Loyalty points earned on the just-completed sale (for the receipt).
  const [pointsEarned, setPointsEarned] = useState(0);

  // Cart view with the manual + loyalty discounts folded in (display only).
  // The promotions calculator owns discount math; here we just present the
  // cart the cashier is building plus any applied discounts for the checkout
  // summary and the discount panel.
  const cartView: Cart = useMemo(
    () => ({
      ...cart,
      discount: cart.discount + appliedDiscount + loyaltyDiscount,
      total: Math.max(
        0,
        cart.subtotal - cart.discount - appliedDiscount - loyaltyDiscount + cart.tax,
      ),
    }),
    [cart, appliedDiscount, loyaltyDiscount],
  );

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
        cartView,
        customer,
        payments,
        warehouseId,
        shift?.id,
      );

      // Award loyalty points for the completed sale (reuses the loyalty module;
      // POS never owns the points ledger). Best-effort + receipt-only display.
      if (customer && earnPoints) {
        const earned = currencyToPoints(created.transaction.total);

        try {
          await earnPoints.mutateAsync(earned);
          setPointsEarned(earned);
        } catch {
          setPointsEarned(earned);
        }
      }

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
    setAppliedDiscount(0);
    setLoyaltyDiscount(0);
    setPointsEarned(0);
    setStage("checkout");
  }

  // Reuse the promotions calculator to fold a discount result onto the cart.
  function handleApplyDiscount(result: DiscountResult) {
    // The calculator returns a fully-recomputed set of lines; push them back
    // into the cart hook so every downstream component sees consistent totals.
    // POS does not duplicate cart math — it delegates to the existing
    // calculator and the cart hook's `calculateTotals`.
    replaceCart(result.cart.items);
    setAppliedDiscount(result.totalDiscount);
    setShowDiscount(false);
  }

  function handleRedeemLoyalty(discountValue: number, _points: number) {
    setLoyaltyDiscount(discountValue);
    setShowLoyalty(false);
  }

  function handleReturned() {
    setShowReturns(false);
    handleNewSale();
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

      {/* View toggle: Sale / Dashboard */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveView("sale")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeView === "sale"
              ? "bg-[var(--nebula-primary)] text-white"
              : "border border-[var(--nebula-border)] text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)]"
          }`}
        >
          <ShoppingCart size={14} /> Sale
        </button>
        <button
          type="button"
          onClick={() => setActiveView("dashboard")}
          disabled={!canViewReports}
          title={
            canViewReports
              ? undefined
              : "Reports are restricted to managers."
          }
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeView === "dashboard"
              ? "bg-[var(--nebula-primary)] text-white"
              : "border border-[var(--nebula-border)] text-[var(--nebula-text-secondary)] hover:bg-[var(--nebula-surface-muted)]"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <LayoutDashboard size={14} /> Dashboard
        </button>
      </div>

      {/* Active shift banner */}
      {shift && (
        <POSShiftPanel
          shift={shift}
          movements={shiftData?.movements ?? []}
          onCloseShift={() => setClosing(true)}
        />
      )}

      {/* ─── DASHBOARD VIEW ─── */}
      {activeView === "dashboard" &&
        (canViewReports ? (
          <POSDashboard
            params={reportParams}
            shift={shift}
            cashBalance={shift?.expectedCash}
          />
        ) : (
          <div className="surface flex items-center justify-center p-8 text-sm text-[var(--nebula-text-secondary)]">
            Reports are restricted to managers.
          </div>
        ))}

      {/* ─── SALE WORKSPACE ─── */}
      {activeView === "sale" && (
        <div className="space-y-6">
          {shiftLoading ? (
            <div className="surface flex items-center justify-center p-8 text-sm text-[var(--nebula-text-secondary)]">
              Checking register status…
            </div>
          ) : shift ? (
            <>
          {/* Quick actions rail — opens existing POS sub-features. */}
          <POSQuickActions
            customer={customer}
            onReturnSale={() => setShowReturns(true)}
            onCustomerHistory={() => setShowHistory(true)}
            onApplyDiscount={() => setShowDiscount(true)}
            onRedeemLoyalty={() => setShowLoyalty(true)}
            onRecentReceipts={() => setShowReceipts(true)}
            canManageReturns={canManageReturns}
          />

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
                    cart={cartView}
                    customer={customer}
                    warehouseId={warehouseId}
                    warehouses={warehouses}
                    onWarehouseChange={(next) => {
                      setWarehouseId(next);
                      setError(null);
                    }}
                    onCompleteSale={handleCompleteSale}
                    appliedDiscount={appliedDiscount}
                    loyaltyDiscount={loyaltyDiscount}
                    onApplyDiscount={() => setShowDiscount(true)}
                    onRedeemLoyalty={() => setShowLoyalty(true)}
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
                      cart={cartView}
                      customer={customer}
                      shift={shift}
                      cashierName={me?.data?.name}
                      receiptNumber={result.salesOrder.orderNumber}
                      pointsEarned={pointsEarned}
                      loyaltyDiscount={loyaltyDiscount}
                      onClose={handleNewSale}
                    />

                    {/* Thermal / 80mm print step — replaces the page-wide
                        window.print() with a dedicated thermal receipt in a
                        hidden iframe. Mounts and auto-triggers the print dialog. */}
                    <POSPrintReceipt
                      result={result}
                      cart={cartView}
                      customer={customer}
                      shift={shift}
                      cashierName={me?.data?.name}
                      receiptNumber={result.salesOrder.orderNumber}
                      pointsEarned={pointsEarned}
                      loyaltyDiscount={loyaltyDiscount}
                      onClose={handleNewSale}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
          </>
          ) : (
            <div className="surface flex flex-col items-center justify-center gap-4 p-8">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-[var(--nebula-text-primary)]">
                  Register not open
                </h2>

                <p className="mt-1 text-sm text-[var(--nebula-text-secondary)]">
                  Open the cash register to begin selling.
                </p>
              </div>

              <POSOpenShift cashierName={me?.data?.name ?? ""} />
            </div>
          )}
        </div>
      )}

      {/* ─── Quick-action overlays (reuse existing POS sub-features) ─── */}
      <POSOverlay
        open={showDiscount}
        title="Discounts & Promotions"
        onClose={() => setShowDiscount(false)}
      >
        <POSDiscountPanel cart={cartView} onApply={handleApplyDiscount} />
      </POSOverlay>

      <POSOverlay
        open={showLoyalty}
        title="Redeem Loyalty Points"
        onClose={() => setShowLoyalty(false)}
      >
        <RedeemPointsPanel
          customerId={customer?.id ?? null}
          customerName={customer?.name ?? ""}
          onRedeemed={handleRedeemLoyalty}
        />
      </POSOverlay>

      <POSOverlay
        open={showHistory}
        title="Customer History"
        onClose={() => setShowHistory(false)}
      >
        <POSCustomerHistory
          customerId={customer?.id ?? null}
          customerName={customer?.name ?? ""}
        />
      </POSOverlay>

      <POSOverlay
        open={showReturns}
        title="Return Sale"
        onClose={() => setShowReturns(false)}
      >
        <POSReturnForm
          warehouseId={warehouseId}
          customerId={customer?.id ?? ""}
          shiftId={shift?.id}
          onReturned={handleReturned}
        />
      </POSOverlay>

      <POSOverlay
        open={showReceipts}
        title="Last Receipt"
        onClose={() => setShowReceipts(false)}
      >
        {result ? (
          <POSReceipt
            result={result}
            cart={cartView}
            customer={customer}
            shift={shift}
            cashierName={me?.data?.name}
            receiptNumber={result.salesOrder.orderNumber}
            pointsEarned={pointsEarned}
            loyaltyDiscount={loyaltyDiscount}
            onClose={() => setShowReceipts(false)}
          />
        ) : (
          <p className="p-4 text-sm text-[var(--nebula-text-muted)]">
            No receipt for the current session yet.
          </p>
        )}
      </POSOverlay>

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

/**
 * Lightweight, polished modal overlay used by the POS quick actions.
 *
 * Purely presentational — it renders its children in a centered, scrollable
 * card above a dimmed backdrop. No business logic; the panels it hosts own
 * their own behaviour and call `onClose` when the user dismisses them.
 */
function POSOverlay({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="surface flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[var(--nebula-border)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--nebula-border)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)] hover:text-[var(--nebula-text-primary)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
