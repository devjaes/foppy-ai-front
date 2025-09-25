"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindGoalUsersById } from "../../hooks/use-goals-queries";
import GoalCard from "../components/goal-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export default function GoalsView() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: goals = [], isLoading } = useFindGoalUsersById(userId!);

  const handleCreateGoal = () => {
    router.push("/management/goals/create");
  };

  return (
    <ContentLayout title="Metas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tus Metas</h2>
          <Button
            onClick={handleCreateGoal}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Meta</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : goals.length === 0 ? (
          <EmptyState
            title="No tienes metas"
            description="Crea tu primer meta para empezar a registrar tus transacciones."
            action={
              <Link href="/management/goals/create" passHref>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Crear meta
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
