"use client";

import RHFInput from "@/components/rhf/RHFInput";
import { useDebtPaymentForm } from "../../hooks/use-debt-payment-form";
import { FormProvider } from "react-hook-form";
import { DollarSign } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Debt } from "../../interfaces/debts.interface";
import { formatCurrency } from "@/lib/format-currency";
import RHFSelect from "@/components/rhf/RHFSelect";
import { useFindAllPaymentMethods } from "@/features/payment-methods/hooks/use-payment-methods-queries";
import { useRouter } from "next/navigation";

interface DebtPaymentFormProps {
  debt: Debt;
}

export default function DebtPaymentForm({ debt }: DebtPaymentFormProps) {
  const router = useRouter();
  const { methods, onSubmit, isLoading } = useDebtPaymentForm(debt);
  const { data: paymentMethods = [] } = useFindAllPaymentMethods();

  const paymentMethodOptions = paymentMethods.map((method) => ({
    value: method.id.toString(),
    label: method.name,
  }));

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center w-full max-w-xl mx-auto"
      >
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-4 w-full">
          <h3 className="font-semibold text-lg">{debt.description}</h3>
          <div className="grid grid-cols-2 text-sm">
            <span className="text-gray-500 ">Monto original:</span>
            <span className="font-medium dark:text-black">
              {formatCurrency(debt.original_amount)}
            </span>
            <span className="text-gray-500">Monto pagado:</span>
            <span className="font-medium text-green-600">
              {formatCurrency(debt.original_amount - debt.pending_amount)}
            </span>
            <span className="text-gray-500">Monto pendiente:</span>
            <span className="font-medium text-red-600">
              {formatCurrency(debt.pending_amount)}
            </span>
          </div>
        </div>

        <RHFInput
          name="amount"
          label="Monto a Pagar"
          type="number"
          placeholder="0.00"
        />

        <RHFSelect
          name="payment_method_id"
          label="Método de Pago (opcional)"
          placeholder="Selecciona un método de pago"
          options={paymentMethodOptions}
        />

        <RHFInput
          name="description"
          label="Descripción (opcional)"
          placeholder="Añade una descripción para este pago..."
        />

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            Cerrar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || debt.pending_amount <= 0}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <LoadingSpinner size={16} />
            ) : (
              <DollarSign className="h-4 w-4" />
            )}
            <span>Realizar Pago</span>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
