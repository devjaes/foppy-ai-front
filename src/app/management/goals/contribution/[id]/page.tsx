import GoalContributionView from "@/features/goals/presentation/views/goal-contribution-view";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <GoalContributionView goalId={params.id} />;
}
