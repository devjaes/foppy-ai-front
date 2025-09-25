import { Category } from "@/features/categories/interfaces/categories.interface";

export interface GoalBase {
  name: string;
  target_amount: number;
  current_amount: number;
  contribution_frequency: number;
}

export interface Goal extends GoalBase {
  id: number;
  user_id: number;
  end_date: Date;
  created_at?: Date;
  contribution_amount: number;
  category: Category;
}

export interface GoalCreate extends GoalBase {
  user_id: number;
  end_date: string;
  category_id?: number;
}

export type GoalUpdate = Partial<GoalCreate>;

export const GOAL_CONTRIBUTION_FREQUENCIES = [
  { label: "Diario", value: "1" },
  { label: "Semanal", value: "7" },
  { label: "Mensual", value: "30" },
  { label: "Anual", value: "365" },
];
