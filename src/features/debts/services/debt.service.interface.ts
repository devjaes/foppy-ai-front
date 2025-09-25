import { Transaction } from "@/features/transactions/interfaces/transaction.interface";
import {
  Debt,
  DebtCreate,
  DebtPayment,
  DebtUpdate,
} from "../interfaces/debts.interface";

export interface IDebtService {
  getDebts(): Promise<Debt[]>;
  createDebt(debt: DebtCreate): Promise<Debt>;
  getDebt(id: number): Promise<Debt>;
  updateDebt(id: number, debt: DebtUpdate): Promise<Debt>;
  deleteDebt(id: number): Promise<{ deleted: boolean }>;
  getUserDebts(userId: number): Promise<Debt[]>;
  getUserCredits(creditorId: number): Promise<Debt[]>;
  payDebt(debtId: number, userId: number, payment: DebtPayment): Promise<Debt>;
  getDebtTransactions(debtId: number): Promise<Transaction[]>;
}
