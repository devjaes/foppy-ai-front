export interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category_id: number | null;
  description: string | null;
  payment_method_id: number | null;
  date: string;
  scheduled_transaction_id: number | null;
  debt_id: number | null;
  contribution_id: number | null;
  budget_id: number | null;

  // Relaciones potenciales
  category?: {
    id: number;
    name: string;
    description: string | null;
  };
  payment_method?: {
    id: number;
    name: string;
    type: string;
    last_four_digits: string | null;
  };
}
