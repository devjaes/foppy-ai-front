import RecoveryView from "@/features/auth/presentation/views/recovery.view";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <h2 className="text-center">
        Ingresa tu nueva contraseña para resetearla.
      </h2>
      <RecoveryView />
    </Suspense>
  );
}
