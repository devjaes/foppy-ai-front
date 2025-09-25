"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetReport } from "../../hooks/use-reports-queries";
import ReportViewer from "../components/report-viewer";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReportDetailViewProps {
  reportId: string;
}

export default function ReportDetailView({ reportId }: ReportDetailViewProps) {
  const { data: report, isLoading, error } = useGetReport(reportId);

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
