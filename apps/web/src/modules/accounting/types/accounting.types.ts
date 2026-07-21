export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  date: string;
  amount: number;
}

export interface AccountingSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}