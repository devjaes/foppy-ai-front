import { useMutation, useQuery } from "@tanstack/react-query";
import { TRANSACTIONS_KEYS } from "../constants/transactions-keys";
import { TransactionService } from "../services/transaction.datasource";
import {
  TransactionCreate,
  TransactionUpdate,
} from "../interfaces/transactions.interface";
import queryClient from "@/core/infrastructure/react-query/query-client";
import { useRouter } from "next/navigation";

const transactionService = TransactionService.getInstance();

export const useFindAllTransactions = () => {
  return useQuery({
    queryKey: TRANSACTIONS_KEYS.TRANSACTIONS,
    queryFn: () => transactionService.getTransactions(),
  });
};

export const useFindTransactionById = (id: string) => {
  return useQuery({
    queryKey: TRANSACTIONS_KEYS.TRANSACTION(id),
    queryFn: () => transactionService.getTransaction(Number(id)),
    enabled: !!id,
  });
};

export const useFindUserTransactions = (id: string) => {
  return useQuery({
    queryKey: TRANSACTIONS_KEYS.USER_TRANSACTIONS(id),
    queryFn: () => transactionService.getUserTransactions(Number(id)),
    enabled: !!id,
  });
};

export const useFindUserTransactionsFiltered = (
  id: string,
  filters: {
    startDate?: string;
    endDate?: string;
    type?: string;
    category_id?: number;
    payment_method_id?: number;
    min_amount?: number;
    max_amount?: number;
  }
) => {
  return useQuery({
    queryKey: [...TRANSACTIONS_KEYS.USER_TRANSACTIONS(id), filters],
    queryFn: () =>
      transactionService.getUserTransactionsFiltered(Number(id), filters),
    enabled: !!id,
  });
};

export const useMonthlyBalance = (userId: string, month: string) => {
  return useQuery({
    queryKey: TRANSACTIONS_KEYS.MONTHLY_BALANCE(userId, month),
    queryFn: () => transactionService.getMonthlyBalance(Number(userId), month),
    enabled: !!userId && !!month,
  });
};

export const useCategoryTotals = (
  userId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: TRANSACTIONS_KEYS.CATEGORY_TOTALS(userId, startDate, endDate),
    queryFn: () =>
      transactionService.getCategoryTotals(Number(userId), startDate, endDate),
    enabled: !!userId && !!startDate && !!endDate,
  });
};

export const usePeriodBalance = (
  userId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: [...TRANSACTIONS_KEYS.USER_TRANSACTIONS(userId), "balance", startDate, endDate],
    queryFn: async () => {
      const transactions = await transactionService.getUserTransactionsFiltered(
        Number(userId),
        { startDate, endDate }
      );

      const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      };
    },
    enabled: !!userId && !!startDate && !!endDate,
  });
};

export const useMonthlyTrends = (userId: string) => {
  return useQuery({
    queryKey: TRANSACTIONS_KEYS.MONTHLY_TRENDS(userId),
    queryFn: () => transactionService.getMonthlyTrends(Number(userId)),
    enabled: !!userId,
  });
};

export const useCreateTransaction = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (transaction: TransactionCreate) =>
      transactionService.createTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_KEYS.TRANSACTIONS,
      });
      router.push("/management/transactions");
    },
  });
};

export const useUpdateTransaction = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({
      id,
      transaction,
    }: {
      id: number;
      transaction: TransactionUpdate;
    }) => transactionService.updateTransaction(id, transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_KEYS.TRANSACTIONS,
      });
      router.push("/management/transactions");
    },
  });
};

export const useDeleteTransaction = () => {
  return useMutation({
    mutationFn: (id: number) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_KEYS.TRANSACTIONS,
      });
    },
  });
};
