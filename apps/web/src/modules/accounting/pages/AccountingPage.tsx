import TransactionTable from "../components/TransactionTable";

import type {
  Transaction,
} from "../types/accounting.types";


const demoTransactions: Transaction[] = [
  {
    id: "TX-001",
    type: "income",
    description: "Sales Revenue",
    date: "2026-07-21",
    amount: 5000,
  },
  {
    id: "TX-002",
    type: "expense",
    description: "Office Expense",
    date: "2026-07-20",
    amount: 850,
  },
];


export default function AccountingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Accounting Module
        </h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Manage financial transactions and reports.
        </p>
      </div>

      <TransactionTable
        transactions={demoTransactions}
      />
    </div>
  );
}