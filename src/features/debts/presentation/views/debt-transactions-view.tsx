"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import DebtTransactionsList from "../components/debt-transactions-list";
import { useFindDebtById } from "../../hooks/use-debts-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface DebtTransactionsViewProps {
  debtId: string;
}

export default function DebtTransactionsView({
  debtId,
}: DebtTransactionsViewProps) {
  const { data: debt, isLoading } = useFindDebtById(debtId);
  const router = useRouter();

  if (isLoading || !debt) {
    return (
      <ContentLayout title="Cargando...">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={`Historial de Transacciones: ${debt.description}`}>
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>

        <DebtTransactionsList debt={debt} />
      </div>
    </ContentLayout>
  );
}
