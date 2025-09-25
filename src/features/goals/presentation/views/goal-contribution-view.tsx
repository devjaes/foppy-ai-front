"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import GoalContributionForm from "../components/goal-contribution-form";
import { useFindGoalById } from "../../hooks/use-goals-queries";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface GoalContributionViewProps {
  goalId: string;
}

export default function GoalContributionView({
  goalId,
}: GoalContributionViewProps) {
  const { data: goal, isLoading } = useFindGoalById(goalId);

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
    <ContentLayout title="Contribuir a Meta">
      <GoalContributionForm goal={goal} />
    </ContentLayout>
  );
}
