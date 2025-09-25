import BudgetTransactionsView from "@/features/budgets/presentation/views/budget-transactions-view";

export default function BudgetTransactionsPage({
  params,
}: {
  params: { id: string };
}) {
  return <BudgetTransactionsView budgetId={params.id} />;
}
