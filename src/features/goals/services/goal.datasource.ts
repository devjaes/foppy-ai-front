import { Goal, GoalCreate, GoalUpdate } from "../interfaces/ goals.interface";
import AxiosClient from "@/core/infrastructure/http/axios-client";
import { GoalContribution } from "../interfaces/goal-contribution.interface";
import { Transaction } from "@/features/transactions/interfaces/transactions.interface";

interface IGoalService {
  getGoals(): Promise<Goal[]>;
  createGoal(goal: GoalCreate): Promise<Goal>;
  getGoal(id: number): Promise<Goal>;
  updateGoal(id: number, goal: GoalUpdate): Promise<Goal>;
  deleteGoal(id: number): Promise<{ deleted: boolean }>;
  getUserGoals(userId: number): Promise<Goal[]>;
  getSharedGoals(userId: number): Promise<Goal[]>;
  updateGoalProgress(
    goalId: number,
    userId: number,
    amount: number
  ): Promise<Goal>;
  createGoalContribution(
    goalId: number,
    userId: number,
    amount: number,
    paymentMethodId?: number,
    description?: string
  ): Promise<GoalContribution>;
  getGoalContributions(goalId: number): Promise<GoalContribution[]>;
  deleteGoalContribution(id: number): Promise<{ deleted: boolean }>;
  getGoalTransactions(goalId: number): Promise<Transaction[]>;
}

export class GoalService implements IGoalService {
  private url: string = "goals";
  private axiosClient: AxiosClient;
  private static instance: GoalService;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): IGoalService {
    if (!GoalService.instance) {
      GoalService.instance = new GoalService();
    }
    return GoalService.instance;
  }

  async getGoals(): Promise<Goal[]> {
    const { data } = await this.axiosClient.get<Goal[]>(this.url);
    return data.data;
  }

  async createGoal(goal: GoalCreate): Promise<Goal> {
    const { data } = await this.axiosClient.post<Goal>(this.url, goal);
    return data.data;
  }

  async getGoal(id: number): Promise<Goal> {
    const { data } = await this.axiosClient.get<Goal>(`${this.url}/${id}`);
    return data.data;
  }

  async updateGoal(id: number, goal: GoalUpdate): Promise<Goal> {
    const { data } = await this.axiosClient.patch<Goal>(
      `${this.url}/${id}`,
      goal
    );
    return data.data;
  }

  async deleteGoal(id: number): Promise<{ deleted: boolean }> {
    const { data } = await this.axiosClient.delete<{ deleted: boolean }>(
      `${this.url}/${id}`
    );
    return data.data;
  }

  async getUserGoals(userId: number): Promise<Goal[]> {
    const { data } = await this.axiosClient.get<Goal[]>(
      `users/${userId}/goals`
    );
    return data.data;
  }

  async getSharedGoals(userId: number): Promise<Goal[]> {
    const { data } = await this.axiosClient.get<Goal[]>(
      `users/${userId}/shared-goals`
    );
    return data.data;
  }

  async updateGoalProgress(
    goalId: number,
    userId: number,
    amount: number
  ): Promise<Goal> {
    const { data } = await this.axiosClient.post<Goal>(
      `${this.url}/${goalId}/users/${userId}/progress`,
      { amount }
    );
    return data.data;
  }

  async createGoalContribution(
    goalId: number,
    userId: number,
    amount: number,
    paymentMethodId?: number,
    description?: string
  ): Promise<GoalContribution> {
    const { data } = await this.axiosClient.post<GoalContribution>(
      "goal-contributions",
      {
        goal_id: goalId,
        user_id: userId,
        amount,
        payment_method_id: paymentMethodId,
        description,
      }
    );
    return data.data;
  }

  async getGoalContributions(goalId: number): Promise<GoalContribution[]> {
    const { data } = await this.axiosClient.get<GoalContribution[]>(
      `${this.url}/${goalId}/contributions`
    );
    return data.data;
  }

  async deleteGoalContribution(id: number): Promise<{ deleted: boolean }> {
    const { data } = await this.axiosClient.delete<{ deleted: boolean }>(
      `goal-contributions/${id}`
    );
    return data.data;
  }

  async getGoalTransactions(goalId: number): Promise<Transaction[]> {
    const { data } = await this.axiosClient.get<Transaction[]>(
      `${this.url}/${goalId}/transactions`
    );
    return data.data;
  }
}
