import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  PaymentMethod,
  PaymentMethodCreate,
  PaymentMethodType,
} from "../interfaces/payment-methods.interface";
import {
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
} from "./use-payment-methods-queries";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const paymentMethodSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.nativeEnum(PaymentMethodType),
  last_four_digits: z.string().optional(),
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

interface UsePaymentMethodFormProps {
  paymentMethod?: PaymentMethod;
}

export const usePaymentMethodForm = ({
  paymentMethod,
}: UsePaymentMethodFormProps) => {
  const createPaymentMethod = useCreatePaymentMethod();
  const updatePaymentMethod = useUpdatePaymentMethod();
  const { data } = useSession();
  const userId = data?.user?.id;
  const router = useRouter();

  const form = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: paymentMethod?.name || "",
      type: paymentMethod?.type || PaymentMethodType.CASH,
      last_four_digits: paymentMethod?.last_four_digits || undefined,
    },
  });

  const watchType = form.watch("type");

  const onSubmit: SubmitHandler<PaymentMethodForm> = async (data) => {
    const last_four_digits =
      data.type === PaymentMethodType.CASH ? undefined : data.last_four_digits;

    const paymentMethodData: PaymentMethodCreate = {
      name: data.name,
      type: data.type,
      last_four_digits,
      user_id: Number(userId),
    };

    if (paymentMethod) {
      await updatePaymentMethod.mutateAsync({
        id: paymentMethod.id,
        paymentMethod: paymentMethodData,
      });
    } else {
      await createPaymentMethod.mutateAsync(paymentMethodData);
    }
  };

  const onCancel = () => {
    form.reset();
    router.back();
  };

  return {
    form,
    onSubmit,
    onCancel,
    isSubmitting: form.formState.isSubmitting,
    watchType,
  };
};
