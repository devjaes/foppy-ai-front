"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindDebtById } from "../../hooks/use-debts-queries";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import DebtForm from "../components/debt-form";

export default function DebtEditView() {
  const params = useParams();
  const debtId = params.id as string;
  const { data: debt, isLoading } = useFindDebtById(debtId);

  if (isLoading) {
    return (
      <ContentLayout title="Editar Deuda">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  if (!debt) {
    return (
      <ContentLayout title="Editar Deuda">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Deuda no encontrada</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Editar Deuda">
      <DebtForm debt={debt} />
    </ContentLayout>
  );
}
