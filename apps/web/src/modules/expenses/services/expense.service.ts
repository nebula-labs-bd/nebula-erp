import { apiClient } from "../../../api/client";
import {
  createJournalEntry,
  getAccounts,
} from "../../accounting/services/accounting.service";
import type {
  Account,
  CreateJournalEntryInput,
} from "../../accounting/types/accounting.types";
import type {
  Expense,
  ExpenseCategory,
  CreateExpenseInput,
  UpdateExpenseInput,
  CreateExpenseCategoryInput,
  UpdateExpenseCategoryInput,
} from "../types/expense.types";

/* ---------------------------------------------------------------- */
/* Expense Categories                                               */
/* ---------------------------------------------------------------- */

export function getExpenseCategories() {
  return apiClient.get<ExpenseCategory[]>("/expenses/categories");
}

export function createExpenseCategory(data: CreateExpenseCategoryInput) {
  return apiClient.post<ExpenseCategory>("/expenses/categories", data);
}

export function updateExpenseCategory(data: UpdateExpenseCategoryInput) {
  return apiClient.post<ExpenseCategory>(
    `/expenses/categories/${data.id}`,
    data,
  );
}

export function deleteExpenseCategory(id: string) {
  return apiClient.post(`/expenses/categories/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* Expenses                                                         */
/* ---------------------------------------------------------------- */

export function getExpenses() {
  return apiClient.get<Expense[]>("/expenses/expenses");
}

export function createExpense(data: CreateExpenseInput) {
  return apiClient.post<Expense>("/expenses/expenses", data);
}

export function updateExpense(data: UpdateExpenseInput) {
  return apiClient.post<Expense>(`/expenses/expenses/${data.id}`, data);
}

export function deleteExpense(id: string) {
  return apiClient.post(`/expenses/expenses/${id}/delete`, {});
}

/* ---------------------------------------------------------------- */
/* Accounting Integration                                           */
/* ---------------------------------------------------------------- */

function findAccount(
  accounts: Account[],
  match: (account: Account) => boolean,
): Account | undefined {
  return accounts.find(match);
}

export async function createExpenseWithJournal(expense: CreateExpenseInput) {
  const response = await getAccounts();
  const accounts = response.data;

  // 1. Identify Accounts
  const expenseAccount = findAccount(
    accounts,
    (account) =>
      account.type === "expense" &&
      new RegExp(expense.title, "i").test(account.name),
  ) || findAccount(
    accounts,
    (account) => account.type === "expense" && /general expense/i.test(account.name),
  );

  const cashAccount = findAccount(
    accounts,
    (account) => account.type === "asset" && /cash/i.test(account.name),
  );

  const payableAccount = findAccount(
    accounts,
    (account) =>
      account.type === "liability" && /accounts payable/i.test(account.name),
  );

  // Determine credit account based on payment status
  const creditAccount =
    expense.paymentStatus === "paid" ? cashAccount : payableAccount;

  const lines: CreateJournalEntryInput["lines"] = [];

  if (expenseAccount) {
    lines.push({
      accountId: expenseAccount.id,
      debit: expense.amount,
      credit: 0,
    });
  }

  if (creditAccount) {
    lines.push({
      accountId: creditAccount.id,
      debit: 0,
      credit: expense.amount,
    });
  }

  // 2. Create Journal Entry if possible
  if (lines.length === 2) {
    const journalEntry: CreateJournalEntryInput = {
      date: expense.date,
      reference: `EXP-${Date.now()}`,
      description: `Expense: ${expense.title} - ${expense.description}`,
      lines,
    };

    await createJournalEntry(journalEntry);
  }

  // 3. Create Expense Record
  return createExpense(expense);
}
