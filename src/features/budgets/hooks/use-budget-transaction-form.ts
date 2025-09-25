import { useForm } from "react-hook-form";
import { Budget } from "../interfaces/budgets.interface";
import { useSession } from "next-auth/react";
import { useCreateBudgetTransaction } from "./use-budgets-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { TransactionType } from "@/features/transactions/interfaces/transactions.interface";
import { BudgetTransaction } from "../interfaces/budget-transaction.interface";

const budgetTransactionFormSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, "El monto de la transacción debe ser mayor que 0")
    .refine((val) => val > 0, {
      message: "El monto de la transacción debe ser mayor que 0",
    }),
  type: z.nativeEnum(TransactionType),
  payment_method_id: z.coerce.string().optional(),
  description: z.string().optional(),
  category_id: z.string().optional(),
});

export type BudgetTransactionFormValues = z.infer<
  typeof budgetTransactionFormSchema
>;

export const useBudgetTransactionForm = (budget: Budget) => {
  const { data: session } = useSession();
  const createBudgetTransactionMutation = useCreateBudgetTransaction();
  const router = useRouter();

  const defaultValues: BudgetTransactionFormValues = {
    amount: 0,
    type: TransactionType.EXPENSE,
    payment_method_id: "",
    description: "",
    category_id: budget?.category?.id ? budget.category.id.toString() : "",
  };

  const methods = useForm<BudgetTransactionFormValues>({
    defaultValues,
    resolver: zodResolver(budgetTransactionFormSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit((data) => {
    const transaction: BudgetTransaction = {
      amount: data.amount,
      type: data.type,
      payment_method_id: data.payment_method_id
        ? Number(data.payment_method_id)
        : undefined,
      description: data.description,
      category_id: data.category_id ? Number(data.category_id) : undefined,
    };

    createBudgetTransactionMutation.mutate(
      {
        budgetId: budget.id,
        userId: Number(session?.user?.id),
        transaction,
      },
      {
        onSuccess: () => {
          router.push("/management/budgets");
        },
      }
    );
  });

  return {
    methods,
    onSubmit,
    isLoading: createBudgetTransactionMutation.isPending,
    isError: createBudgetTransactionMutation.isError,
    error: createBudgetTransactionMutation.error,
  };
};
