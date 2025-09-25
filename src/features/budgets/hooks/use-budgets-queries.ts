import { useMutation, useQuery } from "@tanstack/react-query";
import { BUDGETS_KEYS } from "../constants/budgets-keys";
import { BudgetService } from "../services/budget.datasource";
import { BudgetCreate, BudgetUpdate } from "../interfaces/budgets.interface";
import queryClient from "@/core/infrastructure/react-query/query-client";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format-date";
import { BudgetTransaction } from "../interfaces/budget-transaction.interface";

const budgetService = BudgetService.getInstance();

export const useFindAllBudgets = () => {
  return useQuery({
    queryKey: BUDGETS_KEYS.BUDGETS,
    queryFn: () => budgetService.getBudgets(),
  });
};

export const useFindBudgetById = (id: string) => {
  return useQuery({
    queryKey: BUDGETS_KEYS.BUDGET(id),
    queryFn: () => budgetService.getBudget(Number(id)),
    enabled: !!id,
  });
};

export const useFindBudgetUsersById = (id: string) => {
  return useQuery({
    queryKey: BUDGETS_KEYS.BUDGET_USERS(id),
    queryFn: () => budgetService.getUserBudgets(Number(id)),
    enabled: !!id,
  });
};

export const useFindSharedBudgetUsersById = (id: string) => {
  return useQuery({
    queryKey: BUDGETS_KEYS.SHARED_BUDGET_USERS(id),
    queryFn: () => budgetService.getSharedBudgets(Number(id)),
    enabled: !!id,
  });
};

export const useFindMonthlyBudgets = (userId: string, month: string) => {
  return useQuery({
    queryKey: BUDGETS_KEYS.MONTHLY_BUDGETS(userId, month),
    queryFn: () => budgetService.getMonthlyBudgets(Number(userId), month),
    enabled: !!userId && !!month,
  });
};

export const useCreateBudget = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (budget: BudgetCreate) => budgetService.createBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEYS.BUDGETS });
      router.push("/management/budgets");
    },
  });
};

export const useUpdateBudget = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ id, budget }: { id: number; budget: BudgetUpdate }) =>
      budgetService.updateBudget(id, budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEYS.BUDGETS });
      router.push("/management/budgets");
    },
  });
};

export const useDeleteBudget = () => {
  return useMutation({
    mutationFn: (id: number) => budgetService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEYS.BUDGETS });
    },
  });
};

export const useUpdateBudgetAmount = () => {
  return useMutation({
    mutationFn: ({
      budgetId,
      userId,
      amount,
    }: {
      budgetId: number;
      userId: number;
      amount: number;
    }) => budgetService.updateBudgetAmount(budgetId, userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEYS.BUDGETS });
    },
  });
};

export const useCreateBudgetTransaction = () => {
  return useMutation({
    mutationFn: ({
      budgetId,
      userId,
      transaction,
    }: {
      budgetId: number;
      userId: number;
      transaction: BudgetTransaction;
    }) => budgetService.createBudgetTransaction(budgetId, userId, transaction),
    onSuccess: (_, { budgetId }) => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEYS.BUDGETS });
      queryClient.invalidateQueries({
        queryKey: BUDGETS_KEYS.BUDGET_TRANSACTIONS(budgetId.toString()),
      });
    },
  });
};

export const useFindBudgetTransactions = (budgetId: string) => {
  return useQuery({
    queryKey: BUDGETS_KEYS.BUDGET_TRANSACTIONS(budgetId),
    queryFn: () => budgetService.getBudgetTransactions(Number(budgetId)),
    enabled: !!budgetId,
  });
};

export const getCurrentMonth = (): string => {
  return formatDate(new Date(), "yyyy-MM-dd");
};
