import {
  PaymentMethod,
  PaymentMethodCreate,
  PaymentMethodUpdate,
} from "../interfaces/payment-methods.interface";

export interface IPaymentMethodService {
  getPaymentMethods(): Promise<PaymentMethod[]>;
  createPaymentMethod(
    paymentMethod: PaymentMethodCreate
  ): Promise<PaymentMethod>;
  getPaymentMethod(id: number): Promise<PaymentMethod>;
  updatePaymentMethod(
    id: number,
    paymentMethod: PaymentMethodUpdate
  ): Promise<PaymentMethod>;
  deletePaymentMethod(id: number): Promise<{ deleted: boolean }>;
  getUserPaymentMethods(userId: number): Promise<PaymentMethod[]>;
  getSharedPaymentMethods(userId: number): Promise<PaymentMethod[]>;
}
