import {
  Transaction,
  TransactionCreate,
  TransactionUpdate,
} from "../interfaces/transactions.interface";

export interface MonthlyBalance {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryTotal {
  category: string;
  categoryName?: string;
  total: number;
  count?: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

export interface ITransactionService {
  getTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: TransactionCreate): Promise<Transaction>;
  getTransaction(id: number): Promise<Transaction>;
  updateTransaction(
    id: number,
    transaction: TransactionUpdate
  ): Promise<Transaction>;
  deleteTransaction(id: number): Promise<{ deleted: boolean }>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getUserTransactionsFiltered(
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
  ): Promise<Transaction[]>;
  getMonthlyBalance(userId: number, month: string): Promise<MonthlyBalance>;
  getCategoryTotals(
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<CategoryTotal[]>;
  getMonthlyTrends(userId: number): Promise<MonthlyTrend[]>;
}
