import AxiosClient from "@/core/infrastructure/http/axios-client";
import { Transaction } from "@/features/transactions/interfaces/transaction.interface";
import {
  Debt,
  DebtCreate,
  DebtPayment,
  DebtUpdate,
} from "../interfaces/debts.interface";
import { IDebtService } from "./debt.service.interface";

export class DebtService implements IDebtService {
  private url: string = "debts";
  private axiosClient: AxiosClient;
  private static instance: DebtService;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): IDebtService {
    if (!DebtService.instance) {
      DebtService.instance = new DebtService();
    }
    return DebtService.instance;
  }

  async getDebts(): Promise<Debt[]> {
    const { data } = await this.axiosClient.get<Debt[]>(this.url);
    return data.data;
  }

  async createDebt(debt: DebtCreate): Promise<Debt> {
    const { data } = await this.axiosClient.post<Debt>(this.url, debt);
    return data.data;
  }

  async getDebt(id: number): Promise<Debt> {
    const { data } = await this.axiosClient.get<Debt>(`${this.url}/${id}`);
    return data.data;
  }

  async updateDebt(id: number, debt: DebtUpdate): Promise<Debt> {
    const { data } = await this.axiosClient.patch<Debt>(
      `${this.url}/${id}`,
      debt
    );
    return data.data;
  }

  async deleteDebt(id: number): Promise<{ deleted: boolean }> {
    const { data } = await this.axiosClient.delete<{ deleted: boolean }>(
      `${this.url}/${id}`
    );
    return data.data;
  }

  async getUserDebts(userId: number): Promise<Debt[]> {
    const { data } = await this.axiosClient.get<Debt[]>(
      `users/${userId}/debts`
    );
    return data.data;
  }

  async getUserCredits(creditorId: number): Promise<Debt[]> {
    const { data } = await this.axiosClient.get<Debt[]>(
      `users/${creditorId}/credits`
    );
    return data.data;
  }

  async payDebt(
    debtId: number,
    userId: number,
    payment: DebtPayment
  ): Promise<Debt> {
    const { data } = await this.axiosClient.post<Debt>(
      `${this.url}/${debtId}/users/${userId}/pay`,
      payment
    );
    return data.data;
  }

  async getDebtTransactions(debtId: number): Promise<Transaction[]> {
    const { data } = await this.axiosClient.get<Transaction[]>(
      `${this.url}/${debtId}/transactions`
    );
    return data.data;
  }
}
