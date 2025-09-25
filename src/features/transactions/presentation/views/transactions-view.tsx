"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindUserTransactions } from "../../hooks/use-transactions-queries";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TransactionsList } from "../components/transactions-list";

export default function TransactionsView() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useFindUserTransactions(userId!);

  const handleCreateTransaction = () => {
    router.push("/management/transactions/create");
  };

  return (
    <ContentLayout title="Transacciones">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tus Transacciones</h2>
          <Button
            onClick={handleCreateTransaction}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Transacción</span>
          </Button>
        </div>

        {isLoadingTransactions ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <TransactionsList transactions={transactions} />
        )}
      </div>
    </ContentLayout>
  );
}
