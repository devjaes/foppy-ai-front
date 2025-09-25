"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindGoalById } from "../../hooks/use-goals-queries";
import { useParams } from "next/navigation";
import GoalForm from "../components/goal-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function GoalEditView() {
  const params = useParams();
  const goalId = params.id as string;
  const { data: goal, isLoading } = useFindGoalById(goalId);

  if (isLoading) {
    return (
      <ContentLayout title="Editar Meta">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  if (!goal) {
    return (
      <ContentLayout title="Editar Meta">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Meta no encontrada</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Editar Meta">
      <GoalForm goal={goal} />
    </ContentLayout>
  );
}
