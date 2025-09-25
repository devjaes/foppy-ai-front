"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindDebtById } from "../../hooks/use-debts-queries";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import DebtPaymentForm from "../components/debt-payment-form";

export default function DebtPaymentView() {
  const params = useParams();
  const debtId = params.id as string;
  const { data: debt, isLoading } = useFindDebtById(debtId);

  if (isLoading) {
    return (
      <ContentLayout title="Pagar Deuda">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  if (!debt) {
    return (
      <ContentLayout title="Pagar Deuda">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Deuda no encontrada</p>
        </div>
      </ContentLayout>
    );
  }

  if (debt.paid) {
    return (
      <ContentLayout title="Pagar Deuda">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Esta deuda ya ha sido pagada</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Pagar Deuda">
      <DebtPaymentForm debt={debt} />
    </ContentLayout>
  );
}
