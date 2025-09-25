"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import PaymentMethodForm from "../components/payment-method-form";

export default function PaymentMethodCreateView() {
  return (
    <ContentLayout title="Crear Método de Pago">
      <PaymentMethodForm />
    </ContentLayout>
  );
}
