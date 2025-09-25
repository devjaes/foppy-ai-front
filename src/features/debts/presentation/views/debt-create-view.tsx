import { ContentLayout } from "@/core/layout/content/content-layout";
import DebtForm from "../components/debt-form";

export default function DebtCreateView() {
  return (
    <ContentLayout title="Crear Deuda">
      <DebtForm />
    </ContentLayout>
  );
}
