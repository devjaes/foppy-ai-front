"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindMonthlyBudgets } from "../../hooks/use-budgets-queries";
import BudgetCard from "../components/budget-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useState } from "react";
import DatePicker from "@/components/rhf/date-picker/DatePicker";
import { formatDate } from "@/lib/format-date";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export default function BudgetsView() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [month, setMonth] = useState<Date | undefined>(new Date());

  const { data: budgets = [], isLoading } = useFindMonthlyBudgets(
    userId!,
    formatDate(month, "yyyy-MM-dd")
  );

  const handleCreateBudget = () => {
    router.push("/management/budgets/create");
  };

  return (
    <ContentLayout title="Presupuestos">
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Tus Presupuestos</h2>
            <DatePicker
              name="month"
              value={month}
              onChange={setMonth}
              className="w-min"
            />{" "}
          </div>
          <Button
            onClick={handleCreateBudget}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Presupuesto</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {budgets.length === 0 ? (
              <EmptyState
                title="No tienes presupuestos"
                description="Crea tu primer presupuesto para empezar a registrar tus transacciones."
                action={
                  <Link href="/management/budgets/create" passHref>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Crear Presupuesto
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {budgets.map((budget) => (
                  <BudgetCard key={budget.id} budget={budget} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ContentLayout>
  );
}
