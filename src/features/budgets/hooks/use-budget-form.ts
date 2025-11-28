"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Budget } from "../interfaces/budgets.interface";
import { useCreateBudget, useUpdateBudget } from "./use-budgets-queries";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormData } from "@/hooks/use-form-data";
import { useEffect, useRef } from "react";

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
  const formData = useFormData();
  const initialDataProcessedRef = useRef(false);

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

  useEffect(() => {
    console.log('Initial budget form values:', form.getValues());
  }, [form]);

  useEffect(() => {
    if (initialDataProcessedRef.current) {
      return;
    }

    const recommendationData = localStorage.getItem("recommendationAction");
    let dataToProcess = formData;

    if (recommendationData && !budget) {
      try {
        const parsedData = JSON.parse(recommendationData);
        dataToProcess = parsedData;
        localStorage.removeItem("recommendationAction");
        console.log("Pre-filling budget form from recommendation:", parsedData);
      } catch (error) {
        console.error("Error parsing recommendation data:", error);
      }
    }

    if (!dataToProcess) {
      return;
    }

    if (dataToProcess.category_id) {
      form.setValue('category_id', dataToProcess.category_id, { shouldValidate: true });
    }

    if (dataToProcess.limit_amount) {
      form.setValue('limit_amount', dataToProcess.limit_amount, { shouldValidate: true });
    }

    if (dataToProcess.current_amount !== undefined) {
      form.setValue('current_amount', dataToProcess.current_amount, { shouldValidate: true });
    }

    if (dataToProcess.month) {
      form.setValue('month', new Date(dataToProcess.month), { shouldValidate: true });
    }
    
    initialDataProcessedRef.current = true;
  }, [formData, form, budget]);

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
