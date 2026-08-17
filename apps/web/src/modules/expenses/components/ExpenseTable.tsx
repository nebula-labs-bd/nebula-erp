import type { Expense, ExpenseCategory } from "../types/expense.types";

type ExpenseTableProps = {
  expenses: Expense[];
  categories?: ExpenseCategory[];
  contactNames?: Record<string, string>;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
};

function statusClass(status: Expense["status"]): string {
  switch (status) {
    case "approved":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    case "cancelled":
      return "rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700";
    default:
      return "rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700";
  }
}

function paymentClass(status: Expense["paymentStatus"]): string {
  switch (status) {
    case "paid":
      return "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700";
    case "partial":
      return "rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700";
    default:
      return "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700";
  }
}

function categoryName(
  categoryId: string,
  categories?: ExpenseCategory[],
): string {
  const category = categories?.find((c) => c.id === categoryId);
  return category ? category.name : categoryId;
}

export default function ExpenseTable({
  expenses,
  categories,
  contactNames = {},
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-right">Amount</th>
            <th className="p-3 text-left">Payment</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b">
              <td className="p-3">{expense.date}</td>
              <td className="p-3 font-medium">{expense.title}</td>
              <td className="p-3">
                {categoryName(expense.categoryId, categories)}
              </td>
              <td className="p-3">
                {expense.contactId
                  ? (contactNames[expense.contactId] ?? expense.contactId)
                  : "-"}
              </td>
              <td className="p-3 text-right font-medium">
                ${expense.amount.toFixed(2)}
              </td>
              <td className="p-3">
                <span className={paymentClass(expense.paymentStatus)}>
                  {expense.paymentStatus}
                </span>
              </td>
              <td className="p-3">
                <span className={statusClass(expense.status)}>
                  {expense.status}
                </span>
              </td>
              <td className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <button
                      className="rounded border px-2 py-1 text-xs"
                      onClick={() => onEdit(expense)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="rounded border border-red-300 px-2 py-1 text-xs text-red-700"
                      onClick={() => onDelete(expense.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {expenses.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="p-8 text-center text-[var(--nebula-text-secondary)]"
              >
                No expenses recorded yet. Record one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
