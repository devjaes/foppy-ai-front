"use client";

import RHFInput from "@/components/rhf/RHFInput";
import { FormProvider } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Goal } from "../../interfaces/ goals.interface";
import { formatCurrency } from "@/lib/format-currency";
import RHFSelect from "@/components/rhf/RHFSelect";
import { useFindAllPaymentMethods } from "@/features/payment-methods/hooks/use-payment-methods-queries";
import { useGoalContributionForm } from "../../hooks/use-goal-contribution-form";
import { useRouter } from "next/navigation";

interface GoalContributionFormProps {
  goal: Goal;
}

export default function GoalContributionForm({
  goal,
}: GoalContributionFormProps) {
  const router = useRouter();
  const { methods, onSubmit, isLoading } = useGoalContributionForm(goal);
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
          <h3 className="font-semibold text-lg">{goal.name}</h3>
          <div className="grid grid-cols-2 text-sm mb-2">
            <span className="text-gray-500">Meta total:</span>
            <span className="font-medium">
              {formatCurrency(goal.target_amount)}
            </span>
            <span className="text-gray-500">Acumulado:</span>
            <span className="font-medium text-green-600">
              {formatCurrency(goal.current_amount)}
            </span>
            <span className="text-gray-500">Pendiente:</span>
            <span className="font-medium text-red-600">
              {formatCurrency(goal.target_amount - goal.current_amount)}
            </span>
          </div>
        </div>

        <RHFInput
          name="amount"
          label="Cantidad a contribuir"
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
          placeholder="Añade una descripción para esta contribución..."
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <LoadingSpinner size={16} />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Guardar Contribución</span>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
