"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import BudgetTransactionsList from "../components/budget-transactions-list";
import { useFindBudgetById } from "../../hooks/use-budgets-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BudgetTransactionsViewProps {
  budgetId: string;
}

export default function BudgetTransactionsView({
  budgetId,
}: BudgetTransactionsViewProps) {
  const { data: budget, isLoading } = useFindBudgetById(budgetId);
  const router = useRouter();

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
    <ContentLayout
      title={`Historial de Transacciones: ${budget.category?.name}`}
    >
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>

        <BudgetTransactionsList budget={budget} />
      </div>
    </ContentLayout>
  );
}
