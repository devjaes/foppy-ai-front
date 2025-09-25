import LoginView from "@/features/auth/presentation/views/login.view";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense>
      <h2 className="text-center">Inicio de sesión</h2>
      <LoginView />
    </Suspense>
  );
}
