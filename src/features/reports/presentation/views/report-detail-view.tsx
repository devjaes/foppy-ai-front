"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChevronLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetReport } from "../../hooks/use-reports-queries";
import ReportViewer from "../components/report-viewer";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { useSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReportDetailViewProps {
  reportId: string;
}

export default function ReportDetailView({ reportId }: ReportDetailViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: response, isLoading: subscriptionLoading } = useSubscription(userId);
  const subscription = response?.data;

  const hasLitePlan = subscription?.plan?.name?.toLowerCase().includes('lite');

  useEffect(() => {
    // Only redirect if we have loaded subscription data and user has basic plan
    if (!subscriptionLoading && hasLitePlan) {
      router.push('/management');
    }
  }, [subscriptionLoading, hasLitePlan, router]);

  const { data: report, isLoading, error } = useGetReport(reportId);

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
    <ContentLayout title="Detalles del Reporte">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/management/reports" passHref>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">Detalles del Reporte</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No se pudo cargar el reporte. El reporte puede haber expirado o
              sido eliminado.
            </AlertDescription>
          </Alert>
        ) : report ? (
          <ReportViewer report={report} />
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Reporte no encontrado</AlertTitle>
            <AlertDescription>
              El reporte solicitado no existe o ha sido eliminado.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </ContentLayout>
  );
}
