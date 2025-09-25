import EmailGenderView from "@/features/auth/presentation/views/email-gender.view";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <h2 className="text-center">
        ¿Olvidaste tu contraseña? <br />
        Ingresa tu email y te enviaremos un link para resetearla.
      </h2>
      <EmailGenderView />
    </Suspense>
  );
}
