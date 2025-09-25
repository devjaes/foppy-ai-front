import BudgetTransactionFormView from "@/features/budgets/presentation/views/budget-transaction-form-view";

export default function BudgetTransactionFormPage({
  params,
}: {
  params: { id: string };
}) {
  return <BudgetTransactionFormView budgetId={params.id} />;
}
