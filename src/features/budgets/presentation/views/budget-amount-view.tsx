"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindBudgetById } from "../../hooks/use-budgets-queries";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import BudgetAmountForm from "../components/budget-amount-form";

export default function BudgetAmountView() {
  const params = useParams();
  const budgetId = params.id as string;
  const { data: budget, isLoading } = useFindBudgetById(budgetId);

  if (isLoading) {
    return (
      <ContentLayout title="Actualizar Gasto">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  if (!budget) {
    return (
      <ContentLayout title="Actualizar Gasto">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Presupuesto no encontrado</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Actualizar Gasto">
      <BudgetAmountForm budget={budget} />
    </ContentLayout>
  );
}
