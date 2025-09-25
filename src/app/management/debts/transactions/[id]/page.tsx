import DebtTransactionsView from "@/features/debts/presentation/views/debt-transactions-view";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <DebtTransactionsView debtId={params.id} />;
}
