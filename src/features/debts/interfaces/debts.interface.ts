import { Category } from "@/features/categories/interfaces/categories.interface";

export interface DebtBase {
  description: string;
  original_amount: number;
  paid?: boolean;
  creditor_id?: number;
  category_id?: number;
}

export interface Debt extends DebtBase {
  id: number;
  user_id: number;
  due_date?: Date;
  category?: Category;
  pending_amount: number;
}

export interface DebtCreate extends DebtBase {
  user_id: number;
  due_date: string;
}

export type DebtUpdate = Partial<DebtBase>;

export interface DebtPayment {
  amount: number;
  payment_method_id?: number;
  description?: string;
}
