export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "income"
  | "expense";

export type AccountStatus = "active" | "inactive";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountInput {
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  status: AccountStatus;
}

export interface UpdateAccountInput extends Partial<CreateAccountInput> {
  id: string;
}

export type JournalEntryStatus = "draft" | "posted" | "cancelled";

export interface JournalLine {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
}

export interface CreateJournalLineInput {
  accountId: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  status: JournalEntryStatus;
  lines: JournalLine[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntryInput {
  date: string;
  reference: string;
  description: string;
  lines: CreateJournalLineInput[];
}

export interface UpdateJournalEntryInput extends Partial<CreateJournalEntryInput> {
  id: string;
}

export interface LedgerEntry {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface AccountingSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  date: string;
  amount: number;
}