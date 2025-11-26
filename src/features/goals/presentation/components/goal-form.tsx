"use client";

import { useGoalForm } from "../../hooks/use-goal-form";
import { FormProvider } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Goal,
  GOAL_CONTRIBUTION_FREQUENCIES,
} from "../../interfaces/ goals.interface";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";
import { TapToInput } from "@/components/ui/tap-to-input";
import { CategoryPillSelector } from "@/components/ui/category-pill-selector";
import { VoiceInputButton } from "@/components/ui/voice-input-button";
import { FilterPillGroup } from "@/components/ui/filter-pill-group";
import { formatCurrency } from "@/lib/format-currency";
import { FormSection } from "@/components/ui/form-section";

interface GoalFormProps {
  goal?: Goal;
}

const GoalForm = ({ goal }: GoalFormProps) => {
  const { form, onSubmit, onCancel, isSubmiting } = useGoalForm({ goal });
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  const categoryOptions = categories?.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon || "🎯", // Fallback icon if none exists
  })) || [];

  const frequencyOptions = GOAL_CONTRIBUTION_FREQUENCIES.map(freq => ({
    value: freq.value,
    label: freq.label
  }));

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-2xl mx-auto pb-24 relative min-h-[80vh]"
      >
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onCancel}
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <div className="flex gap-2">
            <FilterPillGroup
              options={frequencyOptions}
              value={form.watch("contribution_frequency")}
              onChange={(val) => form.setValue("contribution_frequency", Number(val), { shouldValidate: true })}
              placeholder="Frecuencia"
            />
          </div>
        </div>

        <div className="space-y-8 px-2">
          {/* Main Inputs */}
          <div className="space-y-1">
            <TapToInput
              name="name"
              label="Nombre de la Meta"
              placeholder="Ej. Comprar coche nuevo"
              className="text-3xl font-bold"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <TapToInput
                name="target_amount"
                label="Objetivo"
                type="number"
                formatValue={(val) => formatCurrency(Number(val))}
                placeholder="$0.00"
              />

              <TapToInput
                name="current_amount"
                label="Ahorrado"
                type="number"
                formatValue={(val) => formatCurrency(Number(val))}
                placeholder="$0.00"
              />
            </div>
          </div>

          {/* Categories */}
          <CategoryPillSelector
            name="category_id"
            categories={categoryOptions}
            label="Categoría"
          />

          {/* Details Section */}
          <FormSection title="Detalles">
            <TapToInput
              name="end_date"
              label="Fecha Objetivo"
              type="date"
            />

            <TapToInput
              name="contribution_amount"
              label="Contribución Periódica"
              type="number"
              formatValue={(val) => val ? formatCurrency(Number(val)) : "Opcional"}
              placeholder="Opcional"
            />
          </FormSection>
        </div>

        {/* Floating Actions - Voice input will auto-populate the form */}
        <VoiceInputButton />

        <Button
          disabled={isSubmiting}
          type="submit"
          size="icon"
          className="fixed bottom-6 right-24 h-14 w-14 rounded-full shadow-lg z-40 bg-green-600 hover:bg-green-700 text-white animate-fade-in"
        >
          {isSubmiting ? <LoadingSpinner className="text-white" /> : <Save className="h-6 w-6" />}
        </Button>
      </form>
    </FormProvider>
  );
};

export default GoalForm;
