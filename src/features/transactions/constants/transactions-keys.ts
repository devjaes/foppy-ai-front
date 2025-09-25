const BASE_KEY = "transactions";

export const TRANSACTIONS_KEYS = {
  TRANSACTIONS: [BASE_KEY],
  TRANSACTION: (id: string) => [BASE_KEY, id],
  USER_TRANSACTIONS: (id: string) => [BASE_KEY, "user", id],
  MONTHLY_BALANCE: (userId: string, month: string) => [
    BASE_KEY,
    "balance",
    "monthly",
    userId,
    month,
  ],
  CATEGORY_TOTALS: (userId: string, startDate: string, endDate: string) => [
    BASE_KEY,
    "totals",
    "category",
    userId,
    startDate,
    endDate,
  ],
  MONTHLY_TRENDS: (userId: string) => [BASE_KEY, "trends", "monthly", userId],
};
