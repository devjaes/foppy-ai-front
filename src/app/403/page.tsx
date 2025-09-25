"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  const goToHome = () => {
    router.back();
  };

  return (
    <div className="flex h-screen items-center justify-center ">
      <Card className="w-full max-w-lg p-6 shadow-lg rounded-lg text-center">
        <CardHeader className="flex flex-col items-center text-red-600">
          <AlertTriangle className="w-12 h-12 mb-2" />
          <h1 className="text-3xl font-extrabold">403</h1>
        </CardHeader>
        <CardContent>
          <p className="mt-4">
            Lo sentimos, pero no tienes permisos para acceder a esta página.
          </p>
          <Button onClick={goToHome} className="mt-6">
            Regresar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
