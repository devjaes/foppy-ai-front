import RegisterView from "@/features/auth/presentation/views/register.view";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterView />
    </Suspense>
  );
}
