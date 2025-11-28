"use client";

import { useTransactionForm } from "../../hooks/use-transaction-form";
import { FormProvider } from "react-hook-form";
import { Save, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Transaction,
  TRANSACTION_TYPES,
} from "../../interfaces/transactions.interface";
import { useFindAllPaymentMethods } from "@/features/payment-methods/hooks/use-payment-methods-queries";
import { TapToInput } from "@/components/ui/tap-to-input";
import { CategoryPillSelector } from "@/components/ui/category-pill-selector";
import { VoiceInputButton } from "@/components/ui/voice-input-button";
import { FilterPillGroup } from "@/components/ui/filter-pill-group";
import { formatCurrency } from "@/lib/format-currency";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TransactionFormProps {
  transaction?: Transaction;
}

export default function TransactionForm({ transaction }: TransactionFormProps) {
  const { form, onSubmit, onCancel, isSubmitting, categories, isLoadingCategories } = useTransactionForm({
    transaction,
  });
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
    useFindAllPaymentMethods();

  if (isLoadingCategories || isLoadingPaymentMethods) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  const categoryOptions = categories?.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon || "🛒",
  })) || [];

  const paymentMethodOptions = paymentMethods?.map((pm) => ({
    value: pm.id,
    label: pm.name,
  })) || [];

  const typeOptions = TRANSACTION_TYPES.map(type => ({
    value: type.value,
    label: type.label
  }));

  const dateOptions = [
    { value: "today", label: "Hoy" },
    { value: "yesterday", label: "Ayer" },
    { value: "custom", label: "Otro día", icon: <CalendarIcon className="w-3 h-3" /> },
  ];

  const handleDateFilterChange = (val: string | number) => {
    const today = new Date();
    if (val === "today") {
      form.setValue("date", today, { shouldValidate: true });
    } else if (val === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      form.setValue("date", yesterday, { shouldValidate: true });
    } else {
      // For custom, we'll let the user tap the date input
    }
  };



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

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <FilterPillGroup
              options={dateOptions}
              value="today" // This logic could be improved to check actual date value
              onChange={handleDateFilterChange}
              placeholder="Fecha"
            />
            <FilterPillGroup
              options={typeOptions}
              value={form.watch("type")}
              onChange={(val) => form.setValue("type", val as any, { shouldValidate: true })}
              placeholder="Tipo"
            />
            <FilterPillGroup
              options={paymentMethodOptions}
              value={form.watch("payment_method_id")}
              onChange={(val) => form.setValue("payment_method_id", Number(val), { shouldValidate: true })}
              placeholder="Método de Pago"
            />
          </div>
        </div>

        <div className="space-y-8 px-2">
          {/* Main Inputs */}
          <div className="space-y-4">
            <TapToInput
              name="description"
              label="Descripción"
              placeholder="¿Qué compraste?"
              className="text-3xl font-bold"
            />

            <TapToInput
              name="amount"
              label="Monto"
              type="number"
              formatValue={(val) => formatCurrency(Number(val))}
              placeholder="$0.00"
              className="text-4xl font-bold text-primary"
            />
          </div>

          {/* Categories */}
          <CategoryPillSelector
            name="category_id"
            categories={categoryOptions}
            label="Categoría"
          />

          {/* Date Display (if custom) */}
          <div className="pt-4">
            <TapToInput
              name="date"
              label="Fecha Seleccionada"
              type="date"
              formatValue={(val) => format(new Date(val), "EEEE, d 'de' MMMM", { locale: es })}
            />
          </div>
        </div>

        {/* Floating Actions - Voice input will auto-populate the form */}
        <VoiceInputButton />

        <Button
          disabled={isSubmitting}
          type="submit"
          size="icon"
          className="fixed bottom-6 right-24 h-14 w-14 rounded-full shadow-lg z-40 bg-green-600 hover:bg-green-700 text-white animate-fade-in"
        >
          {isSubmitting ? <LoadingSpinner className="text-white" /> : <Save className="h-6 w-6" />}
        </Button>
      </form>
    </FormProvider>
  );
}
