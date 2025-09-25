import AxiosClient from "@/core/infrastructure/http/axios-client";
import {
  PaymentMethod,
  PaymentMethodCreate,
  PaymentMethodUpdate,
} from "../interfaces/payment-methods.interface";
import { IPaymentMethodService } from "./payment-method.service.interface";

export class PaymentMethodService implements IPaymentMethodService {
  private url: string = "payment-methods";
  private axiosClient: AxiosClient;
  private static instance: PaymentMethodService;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): IPaymentMethodService {
    if (!PaymentMethodService.instance) {
      PaymentMethodService.instance = new PaymentMethodService();
    }
    return PaymentMethodService.instance;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data } = await this.axiosClient.get<PaymentMethod[]>(this.url);
    return data.data;
  }

  async createPaymentMethod(
    paymentMethod: PaymentMethodCreate
  ): Promise<PaymentMethod> {
    const { data } = await this.axiosClient.post<PaymentMethod>(
      this.url,
      paymentMethod
    );
    return data.data;
  }

  async getPaymentMethod(id: number): Promise<PaymentMethod> {
    const { data } = await this.axiosClient.get<PaymentMethod>(
      `${this.url}/${id}`
    );
    return data.data;
  }

  async updatePaymentMethod(
    id: number,
    paymentMethod: PaymentMethodUpdate
  ): Promise<PaymentMethod> {
    const { data } = await this.axiosClient.patch<PaymentMethod>(
      `${this.url}/${id}`,
      paymentMethod
    );
    return data.data;
  }

  async deletePaymentMethod(id: number): Promise<{ deleted: boolean }> {
    const { data } = await this.axiosClient.delete<{ deleted: boolean }>(
      `${this.url}/${id}`
    );
    return data.data;
  }

  async getUserPaymentMethods(userId: number): Promise<PaymentMethod[]> {
    const { data } = await this.axiosClient.get<PaymentMethod[]>(
      `users/${userId}/payment-methods`
    );
    return data.data;
  }

  async getSharedPaymentMethods(userId: number): Promise<PaymentMethod[]> {
    const { data } = await this.axiosClient.get<PaymentMethod[]>(
      `users/${userId}/shared-payment-methods`
    );
    return data.data;
  }
}
