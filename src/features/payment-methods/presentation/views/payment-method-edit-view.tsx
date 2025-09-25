"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindPaymentMethodById } from "../../hooks/use-payment-methods-queries";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PaymentMethodForm from "../components/payment-method-form";

export default function PaymentMethodEditView() {
  const params = useParams();
  const paymentMethodId = params.id as string;
  const { data: paymentMethod, isLoading } =
    useFindPaymentMethodById(paymentMethodId);

  if (isLoading) {
    return (
      <ContentLayout title="Editar Método de Pago">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </ContentLayout>
    );
  }

  if (!paymentMethod) {
    return (
      <ContentLayout title="Editar Método de Pago">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Método de pago no encontrado</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Editar Método de Pago">
      <PaymentMethodForm paymentMethod={paymentMethod} />
    </ContentLayout>
  );
}
