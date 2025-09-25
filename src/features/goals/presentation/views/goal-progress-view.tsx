"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindGoalById } from "../../hooks/use-goals-queries";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import GoalProgressForm from "../components/goal-progress-form";

export default function GoalProgressView() {
  const params = useParams();
  const goalId = params.id as string;
  const { data: goal, isLoading } = useFindGoalById(goalId);

  if (isLoading) {
    return (
      <ContentLayout title="Actualizar Progreso">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  if (!goal) {
    return (
      <ContentLayout title="Actualizar Progreso">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Meta no encontrada</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Actualizar Progreso">
      <GoalProgressForm goal={goal} />
    </ContentLayout>
  );
}
