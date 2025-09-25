import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateGoalContribution } from "./use-goals-queries";
import { Goal } from "../interfaces/ goals.interface";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const goalContributionSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, "La cantidad debe ser mayor a 0")
    .refine((val) => val > 0, {
      message: "La cantidad debe ser mayor a 0",
    }),
  payment_method_id: z.coerce.string().optional(),
  description: z.string().optional(),
});

type GoalContributionFormValues = z.infer<typeof goalContributionSchema>;

export const useGoalContributionForm = (goal: Goal) => {
  const router = useRouter();
  const createContribution = useCreateGoalContribution();
  const { data } = useSession();
  const user = data?.user;

  const methods = useForm<GoalContributionFormValues>({
    resolver: zodResolver(goalContributionSchema),
    defaultValues: {
      amount: 0,
      payment_method_id: "",
      description: "",
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    if (!user?.id) return;

    await createContribution.mutateAsync({
      goalId: goal.id,
      userId: Number(user.id),
      amount: data.amount,
      paymentMethodId: data.payment_method_id
        ? Number(data.payment_method_id)
        : undefined,
      description: data.description || undefined,
    });

    router.back();
  });

  return {
    methods,
    onSubmit,
    isLoading: createContribution.isPending,
    isError: createContribution.isError,
    error: createContribution.error,
  };
};
