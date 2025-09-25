import GoalTransactionsView from "@/features/goals/presentation/views/goal-transactions-view";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <GoalTransactionsView goalId={params.id} />;
}
