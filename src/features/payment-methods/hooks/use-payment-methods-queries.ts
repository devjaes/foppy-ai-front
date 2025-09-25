import { useMutation, useQuery } from "@tanstack/react-query";
import { PAYMENT_METHODS_KEYS } from "../constants/payment-methods-keys";
import { PaymentMethodService } from "../services/payment-method.datasource";
import {
  PaymentMethodCreate,
  PaymentMethodUpdate,
} from "../interfaces/payment-methods.interface";
import queryClient from "@/core/infrastructure/react-query/query-client";
import { useRouter } from "next/navigation";

const paymentMethodService = PaymentMethodService.getInstance();

export const useFindAllPaymentMethods = () => {
  return useQuery({
    queryKey: PAYMENT_METHODS_KEYS.PAYMENT_METHODS,
    queryFn: () => paymentMethodService.getPaymentMethods(),
  });
};

export const useFindPaymentMethodById = (id: string) => {
  return useQuery({
    queryKey: PAYMENT_METHODS_KEYS.PAYMENT_METHOD(id),
    queryFn: () => paymentMethodService.getPaymentMethod(Number(id)),
    enabled: !!id,
  });
};

export const useFindUserPaymentMethods = (id: string) => {
  return useQuery({
    queryKey: PAYMENT_METHODS_KEYS.USER_PAYMENT_METHODS(id),
    queryFn: () => paymentMethodService.getUserPaymentMethods(Number(id)),
    enabled: !!id,
  });
};

export const useFindSharedPaymentMethods = (id: string) => {
  return useQuery({
    queryKey: PAYMENT_METHODS_KEYS.SHARED_PAYMENT_METHODS(id),
    queryFn: () => paymentMethodService.getSharedPaymentMethods(Number(id)),
    enabled: !!id,
  });
};

export const useCreatePaymentMethod = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (paymentMethod: PaymentMethodCreate) =>
      paymentMethodService.createPaymentMethod(paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PAYMENT_METHODS_KEYS.PAYMENT_METHODS,
      });
      router.push("/management/payment-methods");
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({
      id,
      paymentMethod,
    }: {
      id: number;
      paymentMethod: PaymentMethodUpdate;
    }) => paymentMethodService.updatePaymentMethod(id, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PAYMENT_METHODS_KEYS.PAYMENT_METHODS,
      });
      router.push("/management/payment-methods");
    },
  });
};

export const useDeletePaymentMethod = () => {
  return useMutation({
    mutationFn: (id: number) => paymentMethodService.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PAYMENT_METHODS_KEYS.PAYMENT_METHODS,
      });
    },
  });
};
