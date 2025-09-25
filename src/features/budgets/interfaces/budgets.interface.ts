import { Category } from "@/features/categories/interfaces/categories.interface";

export interface BudgetBase {
  limit_amount: number;
  current_amount: number;
  month: Date | string;
}

export interface Budget extends BudgetBase {
  id: number;
  user_id: number;
  category: Category;
}

export interface BudgetCreate {
  user_id: number;
  category_id: number;
  limit_amount: number;
  current_amount?: number;
  month: Date | string;
}

export type BudgetUpdate = Partial<BudgetBase>;
