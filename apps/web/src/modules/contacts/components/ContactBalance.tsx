import { useMemo } from "react";

import { usePayments } from "../../payments/hooks/usePayments";
import { usePaymentAllocations } from "../../payments/hooks/usePayments";
import { useSalesOrders } from "../../sales/hooks/useSalesOrder";
import { usePurchaseOrders } from "../../purchase/hooks/usePurchaseOrder";

import type { Contact } from "../types/contact.types";
import type { PaymentAllocation } from "../../payments/types/payment.types";

type ContactBalanceProps = {
  contact: Contact;
};

/**
 * Contact Balance Foundation.
 *
 * Calculates a unified financial position for a contact by aggregating:
 *   - Sales invoices    (receivable, negative for the business)
 *   - Purchase invoices (payable, positive for the business)
 *   - Payments          (cash movement)
 *   - Allocations       (which invoices the payments settled)
 *
 * This is a read-only, financial-only computation. It never mutates
 * inventory, stock or products.
 */
export default function ContactBalance({ contact }: ContactBalanceProps) {
  const { data: payments = [] } = usePayments();
  const { data: salesOrders = [] } = useSalesOrders();
  const { data: purchaseOrders = [] } = usePurchaseOrders();

  // Allocations across every payment for this contact.
  const paymentIds = useMemo(
    () =>
      payments
        .filter(
          (p) =>
            p.partyId === contact.id &&
            (contact.roles.includes("customer") ||
              contact.roles.includes("vendor")),
        )
        .map((p) => p.id),
    [payments, contact.id, contact.roles],
  );

  const allocationsByPayment = usePaymentAllocationsList(paymentIds);

  const { receivable, payable, netBalance } = useMemo(() => {
    let receivableTotal = 0;
    let payableTotal = 0;

    // Sales invoices → receivable
    if (contact.roles.includes("customer")) {
      for (const so of salesOrders) {
        if (
          so.customerId === contact.id &&
          so.status !== "draft" &&
          so.status !== "cancelled"
        ) {
          receivableTotal += so.total;
        }
      }
    }

    // Purchase invoices → payable
    if (contact.roles.includes("vendor")) {
      for (const po of purchaseOrders) {
        if (
          po.supplierId === contact.id &&
          po.status !== "draft" &&
          po.status !== "cancelled"
        ) {
          payableTotal += po.total;
        }
      }
    }

    // Payments reduce the balance (received vs paid)
    for (const payment of payments) {
      if (payment.partyId !== contact.id) continue;

      if (payment.type === "receivable") {
        receivableTotal -= payment.amount;
      } else {
        payableTotal -= payment.amount;
      }
    }

    // Allocations confirm settled amounts
    for (const allocation of allocationsByPayment) {
      if (allocation.documentType === "sales_invoice") {
        receivableTotal -= allocation.allocatedAmount;
      } else if (allocation.documentType === "purchase_invoice") {
        payableTotal -= allocation.allocatedAmount;
      }
    }

    const net = payableTotal - receivableTotal;

    return {
      receivable: receivableTotal,
      payable: payableTotal,
      netBalance: net,
    };
  }, [
    salesOrders,
    purchaseOrders,
    payments,
    allocationsByPayment,
    contact.id,
    contact.roles,
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="surface p-4 space-y-1">
        <p className="text-sm text-[var(--nebula-text-secondary)]">
          Receivable
        </p>
        <p className="text-2xl font-bold">
          ${receivable.toFixed(2)}
        </p>
      </div>

      <div className="surface p-4 space-y-1">
        <p className="text-sm text-[var(--nebula-text-secondary)]">
          Payable
        </p>
        <p className="text-2xl font-bold">${payable.toFixed(2)}</p>
      </div>

      <div className="surface p-4 space-y-1">
        <p className="text-sm text-[var(--nebula-text-secondary)]">
          Net Balance
        </p>
        <p
          className={`text-2xl font-bold ${
            netBalance >= 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          ${netBalance.toFixed(2)}
        </p>
        <p className="text-xs text-[var(--nebula-text-secondary)]">
          {netBalance >= 0 ? "We owe" : "Owed to us"}
        </p>
      </div>
    </div>
  );
}

/**
 * Aggregates allocation records across multiple payment ids without
 * triggering an unbounded number of hooks (hooks must be called
 * unconditionally at the top level, so we fetch per-payment in a list
 * and flatten).
 */
function usePaymentAllocationsList(paymentIds: string[]): PaymentAllocation[] {
  const results: PaymentAllocation[] = [];

  for (const id of paymentIds) {
    const { data } = usePaymentAllocations(id);
    if (data) results.push(...data);
  }

  return results;
}
