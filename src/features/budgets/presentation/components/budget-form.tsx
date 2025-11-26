"use client";

import { FormProvider } from "react-hook-form";
import { Budget } from "../../interfaces/budgets.interface";
import { useBudgetForm } from "../../hooks/use-budget-form";
import { Save, ArrowLeft } from "lucide-react";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { TapToInput } from "@/components/ui/tap-to-input";
import { CategoryPillSelector } from "@/components/ui/category-pill-selector";
import { VoiceInputButton } from "@/components/ui/voice-input-button";
import { formatCurrency } from "@/lib/format-currency";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BudgetFormProps {
  budget?: Budget;
}

const BudgetForm = ({ budget }: BudgetFormProps) => {
  const { form, onSubmit, onCancel, isSubmiting } = useBudgetForm({ budget });
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const categoryOptions = categories?.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon || "💰",
  })) || [];



  if (isLoadingCategories) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-2xl mx-auto pb-24 relative min-h-[80vh]"
      >
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={onCancel}
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-lg font-medium">
            {budget ? "Editar Presupuesto" : "Nuevo Presupuesto"}
          </div>
          <div className="w-10" />
        </div>

        <div className="space-y-8 px-2">
          {/* Main Inputs */}
          <div className="space-y-4">
            <TapToInput
              name="limit_amount"
              label="Límite Mensual"
              type="number"
              formatValue={(val) => formatCurrency(Number(val))}
              placeholder="$0.00"
              className="text-5xl font-bold text-primary text-center"
            />

            <TapToInput
              name="current_amount"
              label="Gastado Actual (Opcional)"
              type="number"
              formatValue={(val) => formatCurrency(Number(val))}
              placeholder="$0.00"
              className="text-2xl font-medium text-muted-foreground text-center"
            />
          </div>

          {/* Categories */}
          <CategoryPillSelector
            name="category_id"
            categories={categoryOptions}
            label="Categoría"
          />

          {/* Month Selection */}
          <div className="pt-4">
            <TapToInput
              name="month"
              label="Mes del Presupuesto"
              type="date"
              formatValue={(val) => format(new Date(val), "MMMM yyyy", { locale: es })}
            />
          </div>
        </div>

        {/* Floating Actions - Voice input will auto-populate the form */}
        <VoiceInputButton />

        <Button
          disabled={isSubmiting}
          type="submit"
          size="icon"
          className="fixed bottom-6 right-24 h-14 w-14 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90 text-primary-foreground animate-fade-in"
        >
          {isSubmiting ? <LoadingSpinner className="text-white" /> : <Save className="h-6 w-6" />}
        </Button>
      </form>
    </FormProvider>
  );
};

export default BudgetForm;
