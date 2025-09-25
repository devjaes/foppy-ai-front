"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindTransactionById } from "../../hooks/use-transactions-queries";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import TransactionForm from "../components/transaction-form";

export default function TransactionEditView() {
  const params = useParams();
  const transactionId = params.id as string;
  const { data: transaction, isLoading } =
    useFindTransactionById(transactionId);

  if (isLoading) {
    return (
      <ContentLayout title="Editar Transacción">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  if (!transaction) {
    return (
      <ContentLayout title="Editar Transacción">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Transacción no encontrada</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Editar Transacción">
      <TransactionForm transaction={transaction} />
    </ContentLayout>
  );
}
