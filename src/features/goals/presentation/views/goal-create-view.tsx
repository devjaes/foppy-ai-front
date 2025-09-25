import { ContentLayout } from "@/core/layout/content/content-layout";
import GoalForm from "../components/goal-form";

export default function GoalCreateView() {
  return (
    <ContentLayout title="Crear Objetivo">
      <GoalForm />
    </ContentLayout>
  );
}
