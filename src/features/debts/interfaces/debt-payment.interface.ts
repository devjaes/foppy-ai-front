export interface DebtPayment {
  amount: number;
  payment_method_id?: number;
  description?: string;
}

export interface DebtPaymentResponse {
  id: number;
  user_id: number;
  description: string;
  original_amount: string;
  pending_amount: string;
  due_date: string;
  paid: boolean;
  creditor_id: number | null;
  category_id: number | null;
  category?: {
    id: number;
    name: string;
    description: string | null;
  };
}
