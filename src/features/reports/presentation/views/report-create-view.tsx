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
import { ReportPreview } from "../components/report-preview";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import {
  ReportType,
  ReportFormat,
  ReportFilters,
} from "../../interfaces/reports.interface";
import { PeriodRange } from "@/components/period-selector";
import { useReportPreview } from "../../hooks/use-report-preview";
import { useGenerateReport } from "../../hooks/use-reports-queries";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ReportCreateView() {
  // Estados para el flujo de vista previa
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [reportConfig, setReportConfig] = useState<{
    type: ReportType;
    filters: ReportFilters;
    period: PeriodRange;
  } | null>(null);
  const [initialPeriod, setInitialPeriod] = useState<PeriodRange | null>(null);

  // Hooks
  const reportPreview = useReportPreview();
  const generateReport = useGenerateReport();
  const searchParams = useSearchParams();

  // Leer query params para pre-llenar el período
  useEffect(() => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");
    const label = searchParams.get("label");

    if (startDate && endDate) {
      setInitialPeriod({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type: (type as any) || "custom",
        label: label || "Período personalizado",
      });
    }
  }, [searchParams]);

  // Función para manejar la vista previa
  const handlePreview = async (config: {
    type: ReportType;
    filters: ReportFilters;
    period: PeriodRange;
  }) => {
    setReportConfig(config);

    try {
      const data = await reportPreview.mutateAsync({
        type: config.type,
        filters: config.filters,
      });
      setPreviewData(data);
      setShowPreview(true);
    } catch (error) {
      console.error("Error al obtener vista previa:", error);
    }
  };

  // Función para manejar la descarga
  const handleDownload = (format: ReportFormat) => {
    if (!reportConfig) return;

    const reportRequest = {
      type: reportConfig.type,
      format,
      filters: reportConfig.filters,
    };

    generateReport.mutate(reportRequest, {
      onSuccess: (data) => {
        // Abrir en nueva pestaña
        window.open(
          `${process.env.NEXT_PUBLIC_API_URL}/reports/${data.id}`,
          "_blank"
        );
      },
    });
  };

  // Función para cancelar vista previa
  const handleCancelPreview = () => {
    setShowPreview(false);
    setPreviewData(null);
    setReportConfig(null);
  };

  return (
    <ContentLayout title="Crear Reporte">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/management/reports" passHref>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">
            {showPreview ? "Vista Previa del Reporte" : "Generar Nuevo Reporte"}
          </h2>
        </div>

        {!showPreview ? (
          <Card>
            <CardHeader>
              <CardTitle>Configurar Reporte</CardTitle>
              <CardDescription>
                Selecciona el tipo de reporte que deseas generar y configura los
                filtros necesarios. Podrás ver una vista previa antes de
                descargar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportForm
                onPreview={handlePreview}
                initialPeriod={initialPeriod}
              />
            </CardContent>
          </Card>
        ) : (
          <ReportPreview
            reportData={previewData}
            reportType={reportConfig!.type}
            period={reportConfig!.period}
            onDownload={handleDownload}
            onCancel={handleCancelPreview}
            isLoading={reportPreview.isPending}
          />
        )}
      </div>
    </ContentLayout>
  );
}
