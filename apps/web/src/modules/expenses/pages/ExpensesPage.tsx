import { useMemo, useState } from "react";

import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseCategoryForm from "../components/ExpenseCategoryForm";
import ExpenseCategoryTable from "../components/ExpenseCategoryTable";

import {
  useExpenses,
  useExpenseMutation,
  useExpenseCategories,
  useExpenseCategoryMutation,
} from "../hooks/useExpenses";
import { useContacts } from "../../contacts/hooks/useContacts";

import type {
  Expense,
  ExpenseCategory,
} from "../types/expense.types";

export default function ExpensesPage() {
  const { data: expenses = [] } = useExpenses();
  const { data: categories = [] } = useExpenseCategories();
  const { data: contacts = [] } = useContacts();

  const { remove: removeExpense } = useExpenseMutation();
  const { remove: removeCategory } = useExpenseCategoryMutation();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<ExpenseCategory | null>(null);

  const contactNames = useMemo(() => {
    const map: Record<string, string> = {};
    contacts.forEach((contact) => {
      map[contact.id] = contact.name;
    });
    return map;
  }, [contacts]);

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense);
  }

  function handleDeleteExpense(id: string) {
    if (window.confirm("Delete this expense?")) {
      removeExpense.mutate(id);
    }
  }

  function handleEditCategory(category: ExpenseCategory) {
    setEditingCategory(category);
  }

  function handleDeleteCategory(id: string) {
    if (window.confirm("Delete this category?")) {
      removeCategory.mutate(id);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Expense Management</h1>

        <p className="mt-2 text-[var(--nebula-text-secondary)]">
          Track operational costs — rent, utilities, marketing, transport,
          software and more. Expenses post directly into the accounting
          engine (journal entry → general ledger) and never touch inventory,
          stock or products.
        </p>
      </div>

      {/* Expense Records */}
      <section id="expense-records" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Expense Records</h2>

          <button
            className="rounded bg-black px-4 py-2 text-white"
            onClick={() => {
              setEditingExpense(null);
            }}
          >
            Record Expense
          </button>
        </div>

        <ExpenseForm
          expense={editingExpense}
          onClose={() => {
            setEditingExpense(null);
          }}
        />

        <ExpenseTable
          expenses={expenses}
          categories={categories}
          contactNames={contactNames}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </section>

      {/* Expense Categories */}
      <section id="expense-categories" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Expense Categories</h2>

          <button
            className="rounded bg-black px-4 py-2 text-white"
            onClick={() => {
              setEditingCategory(null);
            }}
          >
            Add Category
          </button>
        </div>

        <ExpenseCategoryForm
          category={editingCategory}
          onClose={() => {
            setEditingCategory(null);
          }}
        />

        <ExpenseCategoryTable
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </section>
    </div>
  );
}
