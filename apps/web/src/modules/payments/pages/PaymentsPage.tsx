import PaymentAllocationForm from "../components/PaymentAllocationForm";
import PaymentAllocationTable from "../components/PaymentAllocationTable";
import PaymentForm from "../components/PaymentForm";
import PaymentTable from "../components/PaymentTable";
import SupplierPayableTable from "../components/SupplierPayableTable";
import CustomerReceivableTable from "../components/CustomerReceivableTable";
import PaymentChannelsPage from "../channels/pages/PaymentChannelsPage";

import { usePayments } from "../hooks/usePayments";
import { usePurchaseOrders } from "../../purchase/hooks/usePurchaseOrder";
import { useSalesOrders } from "../../sales/hooks/useSalesOrder";

import { useSuppliers } from "../../purchase/hooks/useSupplier";
import { useCustomers } from "../../sales/hooks/useCustomer";

import type {
  CustomerReceivable,
  OutstandingDocument,
  PayableStatus,
  Payment,
  SupplierPayable,
} from "../types/payment.types";

import type { PurchaseOrder } from "../../purchase/types/purchase.types";
import type { SalesOrder } from "../../sales/types/sales.types";

function deriveStatus(
  invoiceAmount: number,
  paidAmount: number,
): PayableStatus {
  if (paidAmount <= 0) return "due";
  if (paidAmount >= invoiceAmount) return "paid";
  return "partial";
}

function buildOutstandingDocuments(
  payments: Payment[],
  salesOrders: SalesOrder[],
  purchaseOrders: PurchaseOrder[],
): OutstandingDocument[] {
  const docs: OutstandingDocument[] = [];

  // Sales orders -> Customer invoices (receivable)
  for (const so of salesOrders) {
    if (so.status === "draft" || so.status === "cancelled") continue;

    const receivedAmount = payments
      .filter(
        (p) => p.type === "receivable" && p.partyId === so.customerId,
      )
      .reduce((sum, p) => sum + p.amount, 0);

    const dueAmount = Math.max(so.total - receivedAmount, 0);

    if (dueAmount > 0) {
      docs.push({
        documentId: so.id,
        documentType: "sales_invoice",
        documentNumber: so.orderNumber,
        date: so.date,
        total: so.total,
        paid: receivedAmount,
        due: dueAmount,
      });
    }
  }

  // Purchase orders -> Supplier invoices (payable)
  for (const po of purchaseOrders) {
    if (po.status === "draft" || po.status === "cancelled") continue;

    const paidAmount = payments
      .filter((p) => p.type === "payable" && p.partyId === po.supplierId)
      .reduce((sum, p) => sum + p.amount, 0);

    const dueAmount = Math.max(po.total - paidAmount, 0);

    if (dueAmount > 0) {
      docs.push({
        documentId: po.id,
        documentType: "purchase_invoice",
        documentNumber: po.orderNumber,
        date: po.date,
        total: po.total,
        paid: paidAmount,
        due: dueAmount,
      });
    }
  }

  return docs;
}

export default function PaymentsPage() {
  const { data: payments = [] } = usePayments();
  const { data: suppliers = [] } = useSuppliers();
  const { data: customers = [] } = useCustomers();
  const { data: salesOrders = [] } = useSalesOrders();
  const { data: purchaseOrders = [] } = usePurchaseOrders();

  const payablePayments = payments.filter((p) => p.type === "payable");
  const receivablePayments = payments.filter(
    (p) => p.type === "receivable",
  );

  const supplierPayables: SupplierPayable[] = suppliers.map((supplier) => {
    const paidAmount = payablePayments
      .filter((p) => p.partyId === supplier.id)
      .reduce((sum, p) => sum + p.amount, 0);

    const invoiceAmount = paidAmount;
    const dueAmount = Math.max(invoiceAmount - paidAmount, 0);

    return {
      supplierId: supplier.id,
      supplierName: supplier.companyName,
      invoiceAmount,
      paidAmount,
      dueAmount,
      status: deriveStatus(invoiceAmount, paidAmount),
    };
  });

  const customerReceivables: CustomerReceivable[] = customers.map(
    (customer) => {
      const receivedAmount = receivablePayments
        .filter((p) => p.partyId === customer.id)
        .reduce((sum, p) => sum + p.amount, 0);

      const invoiceAmount = receivedAmount;
      const dueAmount = Math.max(invoiceAmount - receivedAmount, 0);

      return {
        customerId: customer.id,
        customerName: customer.name,
        invoiceAmount,
        receivedAmount,
        dueAmount,
        status: deriveStatus(invoiceAmount, receivedAmount),
      };
    },
  );

  const outstandingDocuments = buildOutstandingDocuments(
    payments,
    salesOrders,
    purchaseOrders,
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Payments Module</h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Record supplier payments and customer receipts. Each payment posts a
          balanced journal entry into the accounting engine and never touches
          inventory, stock or products.
        </p>
      </div>

      {/* Payment Records */}
      <section id="payments-records" className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Records</h2>

        <PaymentForm suppliers={suppliers} customers={customers} />

        <PaymentTable payments={payments} />
      </section>

      {/* Payment Allocation */}
      <section id="payments-allocation" className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Allocation</h2>

        <PaymentAllocationForm
          payments={payments}
          outstandingDocuments={outstandingDocuments}
        />

        <PaymentAllocationTable payments={payments} />
      </section>

      {/* Payment Channels & Settlement */}
      <section id="payments-channels" className="space-y-4">
        <PaymentChannelsPage />
      </section>

      {/* Supplier Payables */}
      <section id="payments-payables" className="space-y-4">
        <h2 className="text-xl font-semibold">Supplier Payables</h2>

        <SupplierPayableTable payables={supplierPayables} />
      </section>

      {/* Customer Receivables */}
      <section id="payments-receivables" className="space-y-4">
        <h2 className="text-xl font-semibold">Customer Receivables</h2>

        <CustomerReceivableTable receivables={customerReceivables} />
      </section>
    </div>
  );
}