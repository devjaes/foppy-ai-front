"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import TransactionForm from "../components/transaction-form";

export default function TransactionCreateView() {
  return (
    <ContentLayout title="Crear Transacción">
      <TransactionForm />
    </ContentLayout>
  );
}
