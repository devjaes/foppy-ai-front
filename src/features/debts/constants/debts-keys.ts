const BASE_KEY = "debts";
export const DEBTS_KEYS = {
  DEBTS: [BASE_KEY],
  DEBT: (id: string) => [BASE_KEY, id],
  DEBT_USERS: (id: string) => [BASE_KEY, id, "users"],
  DEBT_CREDITORS: (id: string) => [BASE_KEY, "credits", id, "users"],
  DEBT_TRANSACTIONS: (id: string) => [BASE_KEY, id, "transactions"],
};
