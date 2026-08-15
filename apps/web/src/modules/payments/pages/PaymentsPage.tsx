import PaymentForm from "../components/PaymentForm";
import PaymentTable from "../components/PaymentTable";
import SupplierPayableTable from "../components/SupplierPayableTable";
import CustomerReceivableTable from "../components/CustomerReceivableTable";

import { usePayments } from "../hooks/usePayments";

import { useSuppliers } from "../../purchase/hooks/useSupplier";
import { useCustomers } from "../../sales/hooks/useCustomer";

import type {
  CustomerReceivable,
  PayableStatus,
  SupplierPayable,
} from "../types/payment.types";

function deriveStatus(
  invoiceAmount: number,
  paidAmount: number,
): PayableStatus {
  if (paidAmount <= 0) return "due";
  if (paidAmount >= invoiceAmount) return "paid";
  return "partial";
}

export default function PaymentsPage() {
  const { data: payments = [] } = usePayments();
  const { data: suppliers = [] } = useSuppliers();
  const { data: customers = [] } = useCustomers();

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