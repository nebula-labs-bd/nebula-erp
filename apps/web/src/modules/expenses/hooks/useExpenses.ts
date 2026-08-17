import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createExpenseCategory,
  createExpenseWithJournal,
  deleteExpense,
  deleteExpenseCategory,
  getExpenseCategories,
  getExpenses,
  updateExpense,
  updateExpenseCategory,
} from "../services/expense.service";

import { expenseKeys } from "../queries/expense.keys";

import { accountingKeys } from "../../accounting/queries/accounting.keys";
import { paymentKeys } from "../../payments/queries/payment.keys";

import type {
  CreateExpenseCategoryInput,
  CreateExpenseInput,
  Expense,
  ExpenseCategory,
  UpdateExpenseCategoryInput,
  UpdateExpenseInput,
} from "../types/expense.types";

export function useExpenses() {
  return useQuery({
    queryKey: expenseKeys.expenses(),
    queryFn: async () => {
      const response = await getExpenses();
      return response.data;
    },
  });
}

export function useExpenseMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: expenseKeys.all,
    });

    queryClient.invalidateQueries({
      queryKey: accountingKeys.all,
    });

    queryClient.invalidateQueries({
      queryKey: paymentKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createExpenseWithJournal,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateExpense,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteExpense,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}

export function useExpenseCategories() {
  return useQuery({
    queryKey: expenseKeys.categories(),
    queryFn: async () => {
      const response = await getExpenseCategories();
      return response.data;
    },
  });
}

export function useExpenseCategoryMutation() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: expenseKeys.all,
    });

    queryClient.invalidateQueries({
      queryKey: accountingKeys.all,
    });
  };

  const create = useMutation({
    mutationFn: createExpenseCategory,
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: updateExpenseCategory,
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: deleteExpenseCategory,
    onSuccess: refresh,
  });

  return {
    create,
    update,
    remove,
  };
}

export type {
  CreateExpenseCategoryInput,
  CreateExpenseInput,
  Expense,
  ExpenseCategory,
  UpdateExpenseCategoryInput,
  UpdateExpenseInput,
};