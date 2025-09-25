"use client";

import RHFInput from "@/components/rhf/RHFInput";
import { useDebtForm } from "../../hooks/use-debt-form";
import { FormProvider } from "react-hook-form";
import RHFDatePicker from "@/components/rhf/date-picker/RHFDatePicker";
import { Save } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Debt } from "../../interfaces/debts.interface";
import RHFSelect from "@/components/rhf/RHFSelect";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";

interface DebtFormProps {
  debt?: Debt;
}

export default function DebtForm({ debt }: DebtFormProps) {
  const { data: categories = [] } = useCategories();
  const { methods, onSubmit, isLoading, isError, error } = useDebtForm(debt);

  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center w-full max-w-xl mx-auto"
      >
        <RHFInput
          name="description"
          label="Descripción"
          placeholder="Ingresa una descripción para la deuda"
        />

        <RHFInput
          name="original_amount"
          label="Monto Original"
          type="number"
          placeholder="0.00"
        />

        <RHFDatePicker name="due_date" label="Fecha de Vencimiento" />

        <RHFSelect
          name="category_id"
          label="Categoría"
          placeholder="Selecciona una categoría"
          options={categoryOptions}
        />

        {isError && (
          <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error?.message || "Ocurrió un error al procesar la deuda"}
          </div>
        )}

        <div className="flex justify-end">
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
            <span>{debt ? "Actualizar" : "Guardar"} Deuda</span>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
