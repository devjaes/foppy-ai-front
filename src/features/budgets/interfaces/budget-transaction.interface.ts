import { TransactionType } from "@/features/transactions/interfaces/transactions.interface";

export interface BudgetTransaction {
  amount: number;
  type: TransactionType;
  payment_method_id?: number;
  description?: string;
  category_id?: number;
}
