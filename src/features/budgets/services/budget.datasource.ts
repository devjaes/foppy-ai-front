import {
  Budget,
  BudgetCreate,
  BudgetUpdate,
} from "../interfaces/budgets.interface";
import AxiosClient from "@/core/infrastructure/http/axios-client";
import { Transaction } from "@/features/transactions/interfaces/transaction.interface";
import { BudgetTransaction } from "../interfaces/budget-transaction.interface";

interface IBudgetService {
  getBudgets(): Promise<Budget[]>;
  createBudget(budget: BudgetCreate): Promise<Budget>;
  getBudget(id: number): Promise<Budget>;
  updateBudget(id: number, budget: BudgetUpdate): Promise<Budget>;
  deleteBudget(id: number): Promise<{ deleted: boolean }>;
  getUserBudgets(userId: number): Promise<Budget[]>;
  getSharedBudgets(userId: number): Promise<Budget[]>;
  getMonthlyBudgets(userId: number, month: string): Promise<Budget[]>;
  updateBudgetAmount(
    budgetId: number,
    userId: number,
    amount: number
  ): Promise<Budget>;
  createBudgetTransaction(
    budgetId: number,
    userId: number,
    transaction: BudgetTransaction
  ): Promise<Budget>;
  getBudgetTransactions(budgetId: number): Promise<Transaction[]>;
}

export class BudgetService implements IBudgetService {
  private url: string = "budgets";
  private axiosClient: AxiosClient;
  private static instance: BudgetService;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): IBudgetService {
    if (!BudgetService.instance) {
      BudgetService.instance = new BudgetService();
    }
    return BudgetService.instance;
  }

  async getBudgets(): Promise<Budget[]> {
    const { data } = await this.axiosClient.get<Budget[]>(this.url);
    return data.data;
  }

  async createBudget(budget: BudgetCreate): Promise<Budget> {
    const { data } = await this.axiosClient.post<Budget>(this.url, budget);
    return data.data;
  }

  async getBudget(id: number): Promise<Budget> {
    const { data } = await this.axiosClient.get<Budget>(`${this.url}/${id}`);
    return data.data;
  }

  async updateBudget(id: number, budget: BudgetUpdate): Promise<Budget> {
    const { data } = await this.axiosClient.patch<Budget>(
      `${this.url}/${id}`,
      budget
    );
    return data.data;
  }

  async deleteBudget(id: number): Promise<{ deleted: boolean }> {
    const { data } = await this.axiosClient.delete<{ deleted: boolean }>(
      `${this.url}/${id}`
    );
    return data.data;
  }

  async getUserBudgets(userId: number): Promise<Budget[]> {
    const { data } = await this.axiosClient.get<Budget[]>(
      `users/${userId}/budgets`
    );
    return data.data;
  }

  async getSharedBudgets(userId: number): Promise<Budget[]> {
    const { data } = await this.axiosClient.get<Budget[]>(
      `users/${userId}/shared-budgets`
    );
    return data.data;
  }

  async getMonthlyBudgets(userId: number, month: string): Promise<Budget[]> {
    const { data } = await this.axiosClient.get<Budget[]>(
      `users/${userId}/budgets/month?month=${month}`
    );
    return data.data;
  }

  async updateBudgetAmount(
    budgetId: number,
    userId: number,
    amount: number
  ): Promise<Budget> {
    const { data } = await this.axiosClient.post<Budget>(
      `${this.url}/${budgetId}/users/${userId}/amount`,
      { amount }
    );
    return data.data;
  }

  async createBudgetTransaction(
    budgetId: number,
    userId: number,
    transaction: BudgetTransaction
  ): Promise<Budget> {
    const { data } = await this.axiosClient.post<Budget>(
      `${this.url}/${budgetId}/users/${userId}/transactions`,
      transaction
    );
    return data.data;
  }

  async getBudgetTransactions(budgetId: number): Promise<Transaction[]> {
    const { data } = await this.axiosClient.get<Transaction[]>(
      `${this.url}/${budgetId}/transactions`
    );
    return data.data;
  }
}
