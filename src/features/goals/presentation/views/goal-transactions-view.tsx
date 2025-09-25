"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import GoalTransactionsList from "../components/goal-transactions-list";
import GoalContributionsList from "../components/goal-contributions-list";
import { useFindGoalById } from "../../hooks/use-goals-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface GoalTransactionsViewProps {
  goalId: string;
}

export default function GoalTransactionsView({
  goalId,
}: GoalTransactionsViewProps) {
  const { data: goal, isLoading } = useFindGoalById(goalId);
  const router = useRouter();

  if (isLoading || !goal) {
    return (
      <ContentLayout title="Cargando...">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={`Historial: ${goal.name}`}>
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>

        <GoalContributionsList goal={goal} />

        <GoalTransactionsList goal={goal} />
      </div>
    </ContentLayout>
  );
}
