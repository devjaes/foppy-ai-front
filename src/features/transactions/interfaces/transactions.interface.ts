import { Category } from "@/features/categories/interfaces/categories.interface";
import { PaymentMethod } from "@/features/payment-methods/interfaces/payment-methods.interface";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface TransactionBase {
  amount: number;
  type: TransactionType;
  category_id?: number | null;
  description?: string | null;
  payment_method_id?: number | null;
  date?: string;
  scheduled_transaction_id?: number | null;
  debt_id?: number | null;
  contribution_id?: number | null;
}

export interface Transaction extends TransactionBase {
  id: number;
  user_id: number;
  date: string;
  category: Category;
  payment_method: PaymentMethod;
}

export interface TransactionCreate extends TransactionBase {
  user_id: number;
}

export type TransactionUpdate = Partial<TransactionBase>;

export const TRANSACTION_TYPES = [
  { label: "Ingreso", value: TransactionType.INCOME },
  { label: "Gasto", value: TransactionType.EXPENSE },
];
