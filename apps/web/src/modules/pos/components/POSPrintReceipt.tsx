import { useEffect, useRef } from "react";
import { Printer } from "lucide-react";

import { formatCurrency } from "../../dashboard/utils/format";

import type { Cart, POSCustomer } from "../types/pos.types";
import type { POSTransactionResult } from "../services/pos.service";
import type { POSShift } from "../shift/types/shift.types";

interface ReceiptData {
  businessName: string;
  businessAddress: string;
  receipt: string;
  salesOrder: { orderNumber: string };
  date: string;
  time: string;
  cashierName?: string;
  shift?: POSShift | null;
  customer: POSCustomer | null;
  pointsEarned?: number;
  loyaltyDiscount?: number;
  cart: Cart;
  result: POSTransactionResult;
  payments: POSTransactionResult["payments"];
}

function buildReceiptHtml(data: ReceiptData): string {
  const {
    businessName,
    businessAddress,
    receipt,
    salesOrder,
    date,
    time,
    cashierName,
    shift,
    customer,
    pointsEarned,
    loyaltyDiscount = 0,
    cart,
    result,
    payments,
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Receipt ${receipt}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.4; width: 284px; padding: 10px; }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .small { font-size: 10px; }
    .line { border-top: 1px dashed #000; margin: 4px 0; }
    .flex { display: flex; justify-content: space-between; }
    .items { margin: 8px 0; }
    .item { margin-bottom: 4px; }
    .item-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .item-meta { font-size: 10px; color: #666; }
    @media print {
      body { width: 100%; padding: 0; }
      @page { margin: 0; size: 80mm auto; }
    }
    button { display: none; }
  </style>
</head>
<body>
  <div class="center">
    <div class="bold">${businessName}</div>
    <div class="small">${businessAddress}</div>
    <div class="small">Point of Sale Receipt</div>
  </div>

  <div class="line"></div>

  <div class="flex">
    <span>Receipt #</span>
    <span class="bold">${receipt}</span>
  </div>
  <div class="flex">
    <span>Invoice #</span>
    <span class="bold">${salesOrder.orderNumber}</span>
  </div>
  <div class="flex">
    <span>Date</span>
    <span>${date}</span>
  </div>
  <div class="flex">
    <span>Time</span>
    <span>${time}</span>
  </div>
  <div class="flex">
    <span>Cashier</span>
    <span>${cashierName ?? shift?.cashierName ?? "—"}</span>
  </div>
  <div class="flex">
    <span>Shift #</span>
    <span>${shift ? shift.id.slice(0, 8) : "—"}</span>
  </div>
  ${customer ? `
  <div class="flex">
    <span>Points Earned</span>
    <span>${pointsEarned ?? 0} pts</span>
  </div>` : ""}
  <div class="flex">
    <span>Customer</span>
    <span>${customer?.name ?? "Walk-in"}</span>
  </div>

  <div class="line"></div>

  <div class="items">
    ${cart.items
      .map(
        (item) => `
      <div class="item">
        <div class="item-name bold">${item.name}</div>
        <div class="item-meta">${item.sku}${item.barcode ? ` · ${item.barcode}` : ""} · ${item.quantity} × ${formatCurrency(item.unitPrice)}</div>
        <div class="flex">
          <span></span>
          <span class="bold">${formatCurrency(item.subtotal)}</span>
        </div>
      </div>`,
      )
      .join("")}
  </div>

  <div class="line"></div>

  <div class="flex">
    <span>Subtotal</span>
    <span>${formatCurrency(cart.subtotal)}</span>
  </div>
  <div class="flex">
    <span>Tax</span>
    <span>${formatCurrency(cart.tax)}</span>
  </div>
  <div class="flex">
    <span>Discount Applied</span>
    <span>${formatCurrency(cart.discount + loyaltyDiscount)}</span>
  </div>
  <div class="flex bold" style="border-top: 1px dashed #000; padding-top: 4px;">
    <span>Total</span>
    <span>${formatCurrency(cart.total)}</span>
  </div>

  <div class="line"></div>

  <div class="flex">
    <span>Payment</span>
    <span class="bold">Completed</span>
  </div>
  <div class="flex">
    <span>Stock</span>
    <span class="bold">${result.stockMovementStatus}</span>
  </div>

  ${result.warning ? `<div class="small" style="color: #b45309;">${result.warning}</div>` : ""}

  <div class="line"></div>

  <div class="small" style="text-align: center; margin-top: 4px;">Payment Breakdown</div>
  ${payments
    .map(
      (payment) => `
  <div class="flex small">
    <span>${payment.method}${payment.reference ? ` · ${payment.reference}` : ""}</span>
    <span>${formatCurrency(payment.amount)}</span>
  </div>`,
    )
    .join("")}
  <div class="flex bold" style="border-top: 1px dashed #000; padding-top: 4px;">
    <span>Total</span>
    <span>${formatCurrency(
      payments.reduce((sum, p) => sum + p.amount, 0),
    )}</span>
  </div>

  <div class="line" style="margin-top: 12px;"></div>
  <div class="center small" style="margin-top: 8px;">
    Thank you for your business!
  </div>
</body>
</html>
  `;
}

type POSPrintReceiptProps = {
  /** The completed sale to print. */
  result: POSTransactionResult;

  /** Cart snapshot at time of sale. */
  cart: Cart;

  /** Optional customer. */
  customer: POSCustomer | null;

  /** Cashier display name (from active user / shift). */
  cashierName?: string;

  /** Active shift the sale belongs to. */
  shift?: POSShift | null;

  /** Human-readable receipt number. */
  receiptNumber?: string;

  /** Loyalty points earned by the customer on this sale (display only). */
  pointsEarned?: number;

  /** Loyalty discount (currency) applied on this sale, if any. */
  loyaltyDiscount?: number;

  /** Business details for the receipt header. */
  businessName?: string;
  businessAddress?: string;

  /** Called when printing completes or is cancelled. */
  onClose: () => void;

  /** Called when the print dialog closes. */
  onAfterPrint?: () => void;
};

/**
 * Thermal / 80mm receipt printer component.
 *
 * Renders a minimal, print-optimized receipt in a hidden iframe and triggers
 * `window.print()`. The layout is designed for 80mm thermal paper (284px @
 * 96dpi) and uses browser `@media print` styles so it prints cleanly without
 * margins or browser chrome.
 *
 * Usage:
 *   - Open in a modal or side panel after a successful sale.
 *   - Call `onClose` to dismiss and start a new sale.
 *   - For production thermal printers, replace the iframe approach with a
 *     WebUSB / WebBluetooth / ESC/POS driver or server-side raw print job.
 */
export default function POSPrintReceipt({
  result,
  cart,
  customer,
  cashierName,
  shift,
  receiptNumber,
  pointsEarned,
  loyaltyDiscount = 0,
  businessName = "Nebula ERP",
  businessAddress = "123 Galaxy Road, Dhaka, Bangladesh",
  onClose,
  onAfterPrint,
}: POSPrintReceiptProps) {
  const { salesOrder, payments } = result;

  const issuedAt = new Date();

  const date = issuedAt.toLocaleDateString("en-US", {
    dateStyle: "medium",
  });

  const time = issuedAt.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  const receipt = receiptNumber ?? salesOrder.orderNumber;

  // Build the receipt HTML string for the print iframe.
  const receiptHtml = buildReceiptHtml({
    businessName,
    businessAddress,
    receipt,
    salesOrder,
    date,
    time,
    cashierName,
    shift,
    customer,
    pointsEarned,
    loyaltyDiscount,
    cart,
    result,
    payments,
  });

  // Trigger print via iframe to avoid page navigation.
  const printRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (printRef.current?.contentDocument) {
      printRef.current.contentDocument.write(receiptHtml);
      printRef.current.contentDocument.close();

      // Allow the iframe to render before printing.
      setTimeout(() => {
        printRef.current?.contentWindow?.print();

        if (onAfterPrint) {
          const handleAfterPrint = () => {
            window.removeEventListener("afterprint", handleAfterPrint);
            onAfterPrint();
          };
          window.addEventListener("afterprint", handleAfterPrint);
        }
      }, 100);
    }
  }, [receiptHtml, onAfterPrint]);

  return (
    <div className="surface flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--nebula-text-primary)]">
          Print Receipt
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm text-[var(--nebula-text-secondary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
        >
          New Sale
        </button>
      </div>

      <p className="text-xs text-[var(--nebula-text-muted)] mb-4">
        Sending receipt to printer… if the print dialog doesn't appear, click
        "Print" below.
      </p>

      {/* Hidden print iframe */}
      <iframe
        ref={printRef}
        title="Receipt Print"
        className="w-full h-96 border border-[var(--nebula-border)] rounded-md bg-white"
        style={{ display: "none" }}
      />

      <div className="flex gap-2 mt-auto">
        <button
          type="button"
          onClick={() => printRef.current?.contentWindow?.print()}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-[var(--nebula-border)] px-4 py-2.5 text-sm font-semibold text-[var(--nebula-text-primary)] transition-colors hover:bg-[var(--nebula-surface-muted)]"
        >
          <Printer size={16} /> Print
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[var(--nebula-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          New Sale
        </button>
      </div>
    </div>
  );
}