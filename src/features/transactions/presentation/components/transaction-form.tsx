"use client";

import RHFInput from "@/components/rhf/RHFInput";
import RHFSelect from "@/components/rhf/RHFSelect";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FormProvider } from "react-hook-form";
import {
  Transaction,
  TRANSACTION_TYPES,
} from "../../interfaces/transactions.interface";
import { useTransactionForm } from "../../hooks/use-transaction-form";
import RHFDatePicker from "@/components/rhf/date-picker/RHFDatePicker";
import { useFindAllPaymentMethods } from "@/features/payment-methods/hooks/use-payment-methods-queries";

interface TransactionFormProps {
  transaction?: Transaction;
}

export default function TransactionForm({ transaction }: TransactionFormProps) {
  const { form, onSubmit, onCancel, isSubmitting, categories, isLoadingCategories } = useTransactionForm({
    transaction,
  });
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
    useFindAllPaymentMethods();

  const categoryOptions =
    categories?.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })) || [];

  const paymentMethodOptions =
    paymentMethods?.map((paymentMethod) => ({
      value: paymentMethod.id.toString(),
      label: paymentMethod.name,
    })) || [];

  if (isLoadingCategories || isLoadingPaymentMethods) {
    return <LoadingSpinner className="w-full" />;
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center w-full max-w-xl mx-auto"
      >
        <RHFInput name="amount" label="Monto" type="number" />
        <RHFSelect name="type" label="Tipo" options={TRANSACTION_TYPES} />
        <RHFSelect
          name="category_id"
          label="Categoría"
          options={categoryOptions}
          placeholder="Selecciona una categoría"
        />
        <RHFSelect
          name="payment_method_id"
          label="Método de Pago"
          options={paymentMethodOptions}
          placeholder="Selecciona un método de pago"
        />
        <RHFInput name="description" label="Descripción" />
        <RHFDatePicker name="date" label="Fecha" />

        <div className="flex space-x-2 mt-6">
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
