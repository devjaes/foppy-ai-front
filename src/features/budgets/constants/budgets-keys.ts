const BASE_KEY = "budgets";
export const BUDGETS_KEYS = {
  BUDGETS: [BASE_KEY],
  BUDGET: (id: string) => [BASE_KEY, id],
  BUDGET_USERS: (id: string) => [BASE_KEY, id, "users"],
  SHARED_BUDGET_USERS: (id: string) => [BASE_KEY, "shared", id, "users"],
  MONTHLY_BUDGETS: (userId: string, month: string) => [
    BASE_KEY,
    userId,
    "month",
    month,
  ],
  BUDGET_TRANSACTIONS: (id: string) => [BASE_KEY, id, "transactions"],
};
