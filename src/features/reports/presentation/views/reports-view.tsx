"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ReportsList from "../components/reports-list";
import { useQuery } from "@tanstack/react-query";
import { REPORTS_KEYS } from "../../constants/reports-keys";
import { Report } from "../../interfaces/reports.interface";
import { useSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function ReportsView() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: response, isLoading: subscriptionLoading } = useSubscription(userId);
  const subscription = response?.data;

  const hasLitePlan = subscription?.plan?.name?.toLowerCase().includes('lite');

  useEffect(() => {
    // Only redirect if we have loaded subscription data and user has lite plan
    if (!subscriptionLoading && hasLitePlan) {
      router.push('/management');
    }
  }, [subscriptionLoading, hasLitePlan, router]);

  // Realizar consulta de reportes (simulada por ahora)
  const { data: reports = [], isLoading } = useQuery({
    queryKey: REPORTS_KEYS.REPORTS,
    queryFn: async () => {
      // Este es un placeholder ya que la API necesitaría un endpoint para listar reportes
      // Por ahora solo devuelve un array vacío
      return [] as Report[];
    },
    enabled: !!userId && !hasLitePlan,
  });

  const handleCreateReport = () => {
    router.push("/management/reports/create");
  };

  // Show loading or alert while checking/redirecting
  if (subscriptionLoading || hasLitePlan) {
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
    <ContentLayout title="Reportes">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tus Reportes</h2>
          <Button
            onClick={handleCreateReport}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Reporte</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <ReportsList reports={reports} />
        )}
      </div>
    </ContentLayout>
  );
}
