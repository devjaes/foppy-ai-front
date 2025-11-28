"use client";

import { useDebtForm } from "../../hooks/use-debt-form";
import { FormProvider } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Debt } from "../../interfaces/debts.interface";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";
import { TapToInput } from "@/components/ui/tap-to-input";
import { CategoryPillSelector } from "@/components/ui/category-pill-selector";
import { VoiceInputButton } from "@/components/ui/voice-input-button";
import { formatCurrency } from "@/lib/format-currency";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DebtFormProps {
  debt?: Debt;
}

export default function DebtForm({ debt }: DebtFormProps) {
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { methods, onSubmit, isLoading, isError, error, onCancel } = useDebtForm(debt);

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon || "💸",
  }));



  if (isLoadingCategories) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
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
            {debt ? "Editar Deuda" : "Nueva Deuda"}
          </div>
          <div className="w-10" />
        </div>

        <div className="space-y-8 px-2">
          {/* Main Inputs */}
          <div className="space-y-4">
            <TapToInput
              name="description"
              label="Descripción"
              placeholder="¿A quién le debes?"
              className="text-3xl font-bold"
            />

            <TapToInput
              name="original_amount"
              label="Monto Total"
              type="number"
              formatValue={(val) => formatCurrency(Number(val))}
              placeholder="$0.00"
              className="text-4xl font-bold text-red-500"
            />
          </div>

          {/* Categories */}
          <CategoryPillSelector
            name="category_id"
            categories={categoryOptions}
            label="Categoría"
          />

          {/* Due Date */}
          <div className="pt-4">
            <TapToInput
              name="due_date"
              label="Fecha de Vencimiento"
              type="date"
              formatValue={(val) => format(new Date(val), "EEEE, d 'de' MMMM", { locale: es })}
            />
          </div>

          {isError && (
            <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm text-center">
              {error?.message || "Ocurrió un error al procesar la deuda"}
            </div>
          )}
        </div>

        {/* Floating Actions - Voice input will auto-populate the form */}
        <VoiceInputButton />

        <Button
          disabled={isLoading}
          type="submit"
          size="icon"
          className="fixed bottom-6 right-24 h-14 w-14 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90 text-primary-foreground animate-fade-in"
        >
          {isLoading ? <LoadingSpinner className="text-white" /> : <Save className="h-6 w-6" />}
        </Button>
      </form>
    </FormProvider>
  );
}
