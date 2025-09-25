"use client";

import RHFInput from "@/components/rhf/RHFInput";
import { useGoalForm } from "../../hooks/use-goal-form";
import { FormProvider } from "react-hook-form";
import RHFDatePicker from "@/components/rhf/date-picker/RHFDatePicker";
import { Save } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Goal,
  GOAL_CONTRIBUTION_FREQUENCIES,
} from "../../interfaces/ goals.interface";
import RHFSelect from "@/components/rhf/RHFSelect";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";

interface GoalFormProps {
  goal?: Goal;
}
const GoalForm = ({ goal }: GoalFormProps) => {
  const { form, onSubmit, onCancel, isSubmiting } = useGoalForm({ goal });
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return <LoadingSpinner className="w-full" />;
  }

  const categoryOptions = categories?.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center w-full max-w-xl mx-auto"
      >
        <RHFInput name="name" label="Nombre" />
        <RHFInput name="target_amount" label="Cantidad Objetivo" />
        <RHFInput name="current_amount" label="Cantidad Actual" />
        <RHFSelect
          name="contribution_frequency"
          label="Frecuencia de Contribución"
          options={GOAL_CONTRIBUTION_FREQUENCIES}
        />
        <RHFSelect
          name="category_id"
          label="Categoría"
          options={categoryOptions || []}
        />
        <RHFDatePicker
          name="end_date"
          label="Fecha de Fin"
          minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
        />

        <div className="flex space-x-2">
          <Button onClick={onCancel} type="button" variant={"secondary"}>
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

export default GoalForm;
