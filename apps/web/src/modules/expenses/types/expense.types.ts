export type ExpenseStatus = "draft" | "approved" | "cancelled";

export type PaymentStatus = "unpaid" | "partial" | "paid";

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
}

export interface Expense {
  id: string;
  categoryId: string;
  contactId?: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  paymentStatus: PaymentStatus;
  status: ExpenseStatus;
  createdAt: string;
}

export interface CreateExpenseCategoryInput {
  name: string;
  description: string;
  status: "active" | "inactive";
}

export interface UpdateExpenseCategoryInput extends Partial<CreateExpenseCategoryInput> {
  id: string;
}

export interface CreateExpenseInput {
  categoryId: string;
  contactId?: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  paymentStatus: PaymentStatus;
  status: ExpenseStatus;
}

export interface UpdateExpenseInput extends Partial<CreateExpenseInput> {
  id: string;
}
