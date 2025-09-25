"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindBudgetById } from "../../hooks/use-budgets-queries";
import { useParams } from "next/navigation";
import BudgetForm from "../components/budget-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function BudgetEditView() {
  const params = useParams();
  const budgetId = params.id as string;
  const { data: budget, isLoading } = useFindBudgetById(budgetId);

  if (isLoading) {
    return (
      <ContentLayout title="Editar Presupuesto">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  if (!budget) {
    return (
      <ContentLayout title="Editar Presupuesto">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Presupuesto no encontrado</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Editar Presupuesto">
      <BudgetForm budget={budget} />
    </ContentLayout>
  );
}
