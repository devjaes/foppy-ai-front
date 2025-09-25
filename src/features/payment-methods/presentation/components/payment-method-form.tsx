"use client";

import RHFInput from "@/components/rhf/RHFInput";
import RHFSelect from "@/components/rhf/RHFSelect";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FormProvider } from "react-hook-form";
import {
  PaymentMethod,
  PAYMENT_METHOD_TYPES,
} from "../../interfaces/payment-methods.interface";
import { usePaymentMethodForm } from "../../hooks/use-payment-method-form";

interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod;
}

export default function PaymentMethodForm({
  paymentMethod,
}: PaymentMethodFormProps) {
  const { form, onSubmit, onCancel, isSubmitting, watchType } =
    usePaymentMethodForm({ paymentMethod });

  const showLastFourDigits = watchType !== "CASH";

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center w-full max-w-xl mx-auto"
      >
        <RHFInput name="name" label="Nombre" />
        <RHFSelect name="type" label="Tipo" options={PAYMENT_METHOD_TYPES} />

        {showLastFourDigits && (
          <RHFInput name="last_four_digits" label="Últimos 4 dígitos" />
        )}

        <div className="flex space-x-2">
          <Button onClick={onCancel} type="button" variant={"secondary"}>
            Cancelar
          </Button>
          <Button disabled={isSubmitting} type="submit" className="space-x-2">
            {isSubmitting ? <LoadingSpinner /> : <Save />}
            <span>Guardar</span>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
