import { useForm } from "react-hook-form";
import { Debt, DebtPayment } from "../interfaces/debts.interface";
import { useSession } from "next-auth/react";
import { usePayDebt } from "./use-debts-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const debtPaymentFormSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, "El monto del pago debe ser mayor que 0")
    .refine((val) => val > 0, {
      message: "El monto del pago debe ser mayor que 0",
    }),
  payment_method_id: z.coerce.string().optional(),
  description: z.string().optional(),
});

export type DebtPaymentFormValues = z.infer<typeof debtPaymentFormSchema>;

export const useDebtPaymentForm = (debt: Debt) => {
  const { data: session } = useSession();
  const payDebtMutation = usePayDebt();
  const router = useRouter();

  const defaultValues: DebtPaymentFormValues = {
    amount: debt?.pending_amount || 0,
    payment_method_id: "",
    description: "",
  };

  const methods = useForm<DebtPaymentFormValues>({
    defaultValues,
    resolver: zodResolver(debtPaymentFormSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit((data) => {
    const payment: DebtPayment = {
      amount: data.amount,
      payment_method_id: data.payment_method_id
        ? Number(data.payment_method_id)
        : undefined,
      description: data.description,
    };

    payDebtMutation.mutate(
      {
        debtId: debt.id,
        userId: Number(session?.user?.id),
        payment,
      },
      {
        onSuccess: () => {
          router.push("/management/debts");
        },
      }
    );
  });

  return {
    methods,
    onSubmit,
    isLoading: payDebtMutation.isPending,
    isError: payDebtMutation.isError,
    error: payDebtMutation.error,
  };
};
