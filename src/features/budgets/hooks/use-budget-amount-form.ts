import { useState } from "react";
import { useSession } from "next-auth/react";
import { Budget } from "../interfaces/budgets.interface";
import { useUpdateBudgetAmount } from "./use-budgets-queries";
import { useRouter } from "next/navigation";

interface UseBudgetAmountFormProps {
  budget: Budget;
}

export const useBudgetAmountForm = ({ budget }: UseBudgetAmountFormProps) => {
  const [amount, setAmount] = useState<number>(0);
  const { data } = useSession();
  const user = data?.user;
  const updateAmount = useUpdateBudgetAmount();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    await updateAmount.mutateAsync({
      budgetId: budget.id,
      userId: Number(user.id),
      amount,
    });

    router.back();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    amount,
    handleAmountChange,
    handleSubmit,
    handleCancel,
    isSubmitting: updateAmount.isPending,
  };
};
