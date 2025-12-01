"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReportForm from "../components/report-form";
import { useSession } from "next-auth/react";
import { useSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReportCreateView() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: response, isLoading } = useSubscription(userId);
  const subscription = response?.data;
  const router = useRouter();

  const hasLitePlan = subscription?.plan?.name?.toLowerCase().includes('lite');

  useEffect(() => {
    // Only redirect if we have loaded subscription data and user has basic plan
    if (!isLoading && hasLitePlan) {
      router.push('/management');
    }
  }, [isLoading, hasLitePlan, router]);

  // Show loading or nothing while checking/redirecting
  if (isLoading || hasLitePlan) {
    return (
      <ContentLayout title="Reportes">
        <div className="space-y-6">
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Lock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-600">Función Premium</AlertTitle>
            <AlertDescription className="text-yellow-600/80">
              Los reportes están disponibles solo para usuarios con plan Plus.
              <Link href="/subscribe?planId=2" className="block mt-2">
                <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white">
                  Actualizar a Plan Plus
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Crear Reporte">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {/* <Link href="/management/reports" passHref>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link> */}
          <h2 className="text-2xl font-bold">Generar Nuevo Reporte</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configurar Reporte</CardTitle>
            <CardDescription>
              Selecciona el tipo de reporte que deseas generar y configura los
              filtros necesarios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportForm />
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
