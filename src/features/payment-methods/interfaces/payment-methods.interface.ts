export enum PaymentMethodType {
  CASH = "CASH",
  CARD = "CARD",
  BANK_ACCOUNT = "BANK_ACCOUNT",
}

export interface PaymentMethodBase {
  name: string;
  type: PaymentMethodType;
  last_four_digits?: string;
}

export interface PaymentMethod extends PaymentMethodBase {
  id: number;
  user_id: number;
}

export interface PaymentMethodCreate extends PaymentMethodBase {
  user_id: number;
}

export type PaymentMethodUpdate = Partial<PaymentMethodBase>;

export const PAYMENT_METHOD_TYPES = [
  { label: "Efectivo", value: PaymentMethodType.CASH },
  { label: "Tarjeta", value: PaymentMethodType.CARD },
  { label: "Cuenta Bancaria", value: PaymentMethodType.BANK_ACCOUNT },
];
