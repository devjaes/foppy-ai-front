import { useForm } from "react-hook-form";
import { Debt, DebtCreate, DebtUpdate } from "../interfaces/debts.interface";
import { useSession } from "next-auth/react";
import { useCreateDebt, useUpdateDebt } from "./use-debts-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const debtFormSchema = z.object({
  description: z
    .string({
      invalid_type_error: "La descripción debe ser una cadena de caracteres",
    })
    .min(2, "La descripción debe tener al menos 2 caracteres"),
  original_amount: z.coerce
    .number({
      invalid_type_error: "El monto original debe ser un número",
    })
    .min(0.01, "El monto original debe ser mayor que 0"),

  due_date: z.coerce.date({
    invalid_type_error: "La fecha de vencimiento debe ser una fecha válida",
  }),
  creditor_id: z.coerce.number().optional(),
  category_id: z.coerce.number().optional(),
});

export type DebtFormValues = z.infer<typeof debtFormSchema>;

export const useDebtForm = (debt?: Debt) => {
  const { data: session } = useSession();
  const createDebtMutation = useCreateDebt();
  const updateDebtMutation = useUpdateDebt();

  const defaultValues: DebtFormValues = {
    description: debt?.description || "",
    original_amount: debt?.original_amount || 0,
    due_date: debt?.due_date || new Date(),
    creditor_id: debt?.creditor_id || undefined,
    category_id: debt?.category_id || undefined,
  };

  const methods = useForm<DebtFormValues>({
    defaultValues,
    resolver: zodResolver(debtFormSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit((data) => {
    if (debt) {
      updateDebtMutation.mutate({
        id: debt.id,
        debt: data as DebtUpdate,
      });
    } else {
      const newDebt: DebtCreate = {
        ...data,
        user_id: Number(session?.user?.id),
        due_date: data.due_date.toISOString(),
      };

      createDebtMutation.mutate(newDebt);
    }
  });

  const onCancel = () => {
    window.history.back();
  };

  return {
    methods,
    onSubmit,
    onCancel,
    isLoading: createDebtMutation.isPending || updateDebtMutation.isPending,
    isError: createDebtMutation.isError || updateDebtMutation.isError,
    error: createDebtMutation.error || updateDebtMutation.error,
  };
};
