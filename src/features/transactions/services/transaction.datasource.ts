import AxiosClient from "@/core/infrastructure/http/axios-client";
import {
  Transaction,
  TransactionCreate,
  TransactionUpdate,
} from "../interfaces/transactions.interface";
import {
  CategoryTotal,
  ITransactionService,
  MonthlyBalance,
  MonthlyTrend,
} from "./transaction.service.interface";

export class TransactionService implements ITransactionService {
  private url: string = "transactions";
  private axiosClient: AxiosClient;
  private static instance: TransactionService;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): ITransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  async getTransactions(): Promise<Transaction[]> {
    const { data } = await this.axiosClient.get<Transaction[]>(this.url);
    return data.data;
  }

  async createTransaction(
    transaction: TransactionCreate
  ): Promise<Transaction> {
    const { data } = await this.axiosClient.post<Transaction>(
      this.url,
      transaction
    );
    return data.data;
  }

  async getTransaction(id: number): Promise<Transaction> {
    const { data } = await this.axiosClient.get<Transaction>(
      `${this.url}/${id}`
    );
    return data.data;
  }

  async updateTransaction(
    id: number,
    transaction: TransactionUpdate
  ): Promise<Transaction> {
    const { data } = await this.axiosClient.patch<Transaction>(
      `${this.url}/${id}`,
      transaction
    );
    return data.data;
  }

  async deleteTransaction(id: number): Promise<{ deleted: boolean }> {
    const { data } = await this.axiosClient.delete<{ deleted: boolean }>(
      `${this.url}/${id}`
    );
    return data.data;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    const { data } = await this.axiosClient.get<Transaction[]>(
      `users/${userId}/transactions`
    );
    return data.data;
  }

  async getUserTransactionsFiltered(
    userId: number,
    filters: {
      startDate?: string;
      endDate?: string;
      type?: string;
      category_id?: number;
      payment_method_id?: number;
      min_amount?: number;
      max_amount?: number;
    }
  ): Promise<Transaction[]> {
    const queryParams = new URLSearchParams();

    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.type) queryParams.append("type", filters.type);
    if (filters.category_id)
      queryParams.append("category_id", filters.category_id.toString());
    if (filters.payment_method_id)
      queryParams.append(
        "payment_method_id",
        filters.payment_method_id.toString()
      );
    if (filters.min_amount)
      queryParams.append("min_amount", filters.min_amount.toString());
    if (filters.max_amount)
      queryParams.append("max_amount", filters.max_amount.toString());

    const { data } = await this.axiosClient.get<Transaction[]>(
      `users/${userId}/transactions/filter?${queryParams.toString()}`
    );
    return data.data;
  }

  async getMonthlyBalance(
    userId: number,
    month: string
  ): Promise<MonthlyBalance> {
    const { data } = await this.axiosClient.get<MonthlyBalance>(
      `users/${userId}/balance/monthly?month=${month}`
    );
    return data.data;
  }

  async getCategoryTotals(
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<CategoryTotal[]> {
    const { data } = await this.axiosClient.get<CategoryTotal[]>(
      `users/${userId}/totals/category?startDate=${startDate}&endDate=${endDate}`
    );
    return data.data;
  }

  async getMonthlyTrends(userId: number): Promise<MonthlyTrend[]> {
    const { data } = await this.axiosClient.get<MonthlyTrend[]>(
      `users/${userId}/trends/monthly`
    );
    return data.data;
  }
}
