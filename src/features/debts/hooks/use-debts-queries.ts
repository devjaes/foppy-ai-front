import { useMutation, useQuery } from "@tanstack/react-query";
import { DEBTS_KEYS } from "../constants/debts-keys";
import { DebtService } from "../services/debt.datasource";
import {
  DebtCreate,
  DebtPayment,
  DebtUpdate,
} from "../interfaces/debts.interface";
import queryClient from "@/core/infrastructure/react-query/query-client";
import { useRouter } from "next/navigation";

const debtService = DebtService.getInstance();

export const useFindAllDebts = () => {
  return useQuery({
    queryKey: DEBTS_KEYS.DEBTS,
    queryFn: () => debtService.getDebts(),
  });
};

export const useFindDebtById = (id: string) => {
  return useQuery({
    queryKey: DEBTS_KEYS.DEBT(id),
    queryFn: () => debtService.getDebt(Number(id)),
    enabled: !!id,
  });
};

export const useFindDebtUserById = (id: string) => {
  return useQuery({
    queryKey: DEBTS_KEYS.DEBT_USERS(id),
    queryFn: () => debtService.getUserDebts(Number(id)),
    enabled: !!id,
  });
};

export const useFindCreditsByUserId = (id: string) => {
  return useQuery({
    queryKey: DEBTS_KEYS.DEBT_CREDITORS(id),
    queryFn: () => debtService.getUserCredits(Number(id)),
    enabled: !!id,
  });
};

export const useCreateDebt = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (debt: DebtCreate) => debtService.createDebt(debt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEYS.DEBTS });
      router.push("/management/debts");
    },
  });
};

export const useUpdateDebt = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ id, debt }: { id: number; debt: DebtUpdate }) =>
      debtService.updateDebt(id, debt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEYS.DEBTS });
      router.push("/management/debts");
    },
  });
};

export const useDeleteDebt = () => {
  return useMutation({
    mutationFn: (id: number) => debtService.deleteDebt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEYS.DEBTS });
    },
  });
};

export const usePayDebt = () => {
  return useMutation({
    mutationFn: ({
      debtId,
      userId,
      payment,
    }: {
      debtId: number;
      userId: number;
      payment: DebtPayment;
    }) => debtService.payDebt(debtId, userId, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEYS.DEBTS });
    },
  });
};

export const useFindDebtTransactions = (debtId: string) => {
  return useQuery({
    queryKey: DEBTS_KEYS.DEBT_TRANSACTIONS(debtId),
    queryFn: () => debtService.getDebtTransactions(Number(debtId)),
    enabled: !!debtId,
  });
};
