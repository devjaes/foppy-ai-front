"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import BudgetForm from "../components/budget-form";

export default function BudgetCreateView() {
  return (
    <ContentLayout title="Crear Presupuesto">
      <BudgetForm />
    </ContentLayout>
  );
}
