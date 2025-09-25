const BASE_KEY = "payment-methods";

export const PAYMENT_METHODS_KEYS = {
  PAYMENT_METHODS: [BASE_KEY],
  PAYMENT_METHOD: (id: string) => [BASE_KEY, id],
  USER_PAYMENT_METHODS: (id: string) => [BASE_KEY, "user", id],
  SHARED_PAYMENT_METHODS: (id: string) => [BASE_KEY, "shared", id],
};
