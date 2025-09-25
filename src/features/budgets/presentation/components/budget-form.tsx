"use client";

import { FormProvider } from "react-hook-form";

import { Budget } from "../../interfaces/budgets.interface";
import { useBudgetForm } from "../../hooks/use-budget-form";
import { Save } from "lucide-react";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";
import RHFDatePicker from "@/components/rhf/date-picker/RHFDatePicker";
import RHFInput from "@/components/rhf/RHFInput";
import RHFSelect from "@/components/rhf/RHFSelect";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

interface BudgetFormProps {
  budget?: Budget;
}

const BudgetForm = ({ budget }: BudgetFormProps) => {
  const { form, onSubmit, onCancel, isSubmiting } = useBudgetForm({ budget });
  const { data: categories } = useCategories();

  const categoryOptions =
    categories?.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })) || [];

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center w-full max-w-xl mx-auto"
      >
        <RHFSelect
          name="category_id"
          label="Categoría"
          options={categoryOptions}
        />

        <RHFInput
          name="limit_amount"
          label="Límite del Presupuesto"
          type="number"
        />

        <RHFInput name="current_amount" label="Cantidad Actual" type="number" />

        <RHFDatePicker name="month" label="Mes" minDate={new Date()} />

        <div className="flex space-x-2 mt-6">
          <Button onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button disabled={isSubmiting} type="submit" className="space-x-2">
            {isSubmiting ? <LoadingSpinner /> : <Save />}
            <span>Guardar</span>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BudgetForm;
