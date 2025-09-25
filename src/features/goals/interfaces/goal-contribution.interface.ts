export interface GoalContribution {
  id: number;
  goal_id: number;
  user_id: number;
  amount: string;
  date: string;
}

export interface GoalContributionCreate {
  goal_id: number;
  user_id: number;
  amount: number;
  payment_method_id?: number;
  description?: string;
}
