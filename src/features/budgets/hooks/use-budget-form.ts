"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Budget } from "../interfaces/budgets.interface";
import { useCreateBudget, useUpdateBudget } from "./use-budgets-queries";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const budgetSchema = z
  .object({
    category_id: z.coerce
      .number({
        invalid_type_error: "La categoría debe ser un número",
      })
      .min(1, "Debe seleccionar una categoría"),
    current_amount: z.coerce
      .number({
        invalid_type_error: "La cantidad actual debe ser un número",
      })
      .min(0, "La cantidad actual debe ser mayor o igual a 0"),
    limit_amount: z.coerce
      .number({
        invalid_type_error: "El límite debe ser un número",
      })
      .min(0, "El límite debe ser mayor que 0"),
    month: z.coerce.date({
      invalid_type_error: "La fecha debe ser una fecha válida",
    }),
  })
  .refine(
    (data) => {
      const currentAmount = data.current_amount;
      const limitAmount = data.limit_amount;
      return currentAmount <= limitAmount;
    },
    {
      message: "La cantidad actual no puede ser mayor que el límite",
      path: ["current_amount"],
    }
  );

type BudgetForm = z.infer<typeof budgetSchema>;

interface UseBudgetFormProps {
  budget?: Budget;
}

export const useBudgetForm = ({ budget }: UseBudgetFormProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();

  const defaultValues: Partial<BudgetForm> = {
    category_id: budget?.category?.id || undefined,
    current_amount: budget?.current_amount || 0,
    limit_amount: budget?.limit_amount || undefined,
    month: budget?.month ? new Date(budget.month) : new Date(),
  };

  const form = useForm<BudgetForm>({
    resolver: zodResolver(budgetSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<BudgetForm> = async (data) => {
    if (!session?.user?.id) return;

    try {
      if (budget) {
        await updateBudget.mutateAsync({
          id: budget.id,
          budget: {
            ...data,
            month: data.month.toISOString(),
          },
        });
      } else {
        await createBudget.mutateAsync({
          ...data,
          user_id: Number(session.user.id),
          month: data.month.toISOString(),
        });
      }
      router.push("/management/budgets");
    } catch (error) {
      console.error("Error al guardar el presupuesto:", error);
    }
  };

  const onCancel = () => {
    router.push("/management/budgets");
  };

  return {
    form,
    onSubmit,
    onCancel,
    isSubmiting: createBudget.isPending || updateBudget.isPending,
  };
};
