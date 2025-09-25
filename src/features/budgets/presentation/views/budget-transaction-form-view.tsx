"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import BudgetTransactionForm from "../components/budget-transaction-form";
import { useFindBudgetById } from "../../hooks/use-budgets-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface BudgetTransactionFormViewProps {
  budgetId: string;
}

export default function BudgetTransactionFormView({
  budgetId,
}: BudgetTransactionFormViewProps) {
  const { data: budget, isLoading } = useFindBudgetById(budgetId);

  if (isLoading || !budget) {
    return (
      <ContentLayout title="Cargando...">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={`Nueva Transacción: ${budget.category?.name}`}>
      <BudgetTransactionForm budget={budget} />
    </ContentLayout>
  );
}
