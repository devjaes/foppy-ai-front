"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindDebtUserById } from "../../hooks/use-debts-queries";
import DebtCard from "../components/debt-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export default function DebtsView() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: debts = [], isLoading } = useFindDebtUserById(userId!);

  const handleCreateDebt = () => {
    router.push("/management/debts/create");
  };

  return (
    <ContentLayout title="Deudas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tus Deudas</h2>
          <Button
            onClick={handleCreateDebt}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Deuda</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : debts.length === 0 ? (
          <EmptyState
            title="No tienes deudas"
            description="Crea tu primer deuda para empezar a registrar tus transacciones."
            action={
              <Link href="/management/debts/create" passHref>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Crear Deuda
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            {debts.map((debt) => (
              <DebtCard key={debt.id} debt={debt} />
            ))}
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
