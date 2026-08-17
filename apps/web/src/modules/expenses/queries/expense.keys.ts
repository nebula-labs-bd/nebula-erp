export const expenseKeys = {
  all: ["expenses"] as const,

  expenses: () => [...expenseKeys.all, "list"] as const,
  expense: (id: string) => [...expenseKeys.expenses(), id] as const,

  categories: () => [...expenseKeys.all, "categories"] as const,
  category: (id: string) => [...expenseKeys.categories(), id] as const,
};
