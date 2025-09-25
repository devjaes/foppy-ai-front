import { useMutation, useQuery } from "@tanstack/react-query";
import { REPORTS_KEYS } from "../constants/reports-keys";
import { ReportService } from "../services/report.datasource";
import { Report, ReportRequest } from "../interfaces/reports.interface";
import queryClient from "@/core/infrastructure/react-query/query-client";
import { saveAs } from "file-saver";
import { useToast } from "@/shared/hooks/use-toast";

const reportService = ReportService.getInstance();

export const useGenerateReport = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (reportRequest: ReportRequest) =>
      reportService.generateReport(reportRequest),
    onSuccess: () => {
      toast({
        title: "Reporte generado",
        description: "El reporte ha sido generado exitosamente",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: REPORTS_KEYS.REPORTS });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte. Inténtalo nuevamente.",
        variant: "destructive",
      });
    },
  });
};

export const useGetReport = (id: string) => {
  return useQuery({
    queryKey: REPORTS_KEYS.REPORT(id),
    queryFn: () => reportService.getReport(id),
    enabled: !!id,
  });
};

export const useDeleteReport = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => reportService.deleteReport(id),
    onSuccess: () => {
      toast({
        title: "Reporte eliminado",
        description: "El reporte ha sido eliminado exitosamente",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: REPORTS_KEYS.REPORTS });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el reporte. Inténtalo nuevamente.",
        variant: "destructive",
      });
    },
  });
};

export const useDownloadReport = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, report }: { id: string; report: Report }) => {
      const blob = await reportService.downloadReport(id);

      // Determinar la extensión del archivo según el formato
      let fileExtension = "";
      switch (report.format) {
        case "PDF":
          fileExtension = ".pdf";
          break;
        case "EXCEL":
          fileExtension = ".xlsx";
          break;
        default:
          fileExtension = ".json";
      }

      // Crear un nombre de archivo con el tipo de reporte y la fecha
      const fileName = `reporte-${report.type.toLowerCase()}-${
        new Date().toISOString().split("T")[0]
      }${fileExtension}`;

      // Descargar el archivo
      saveAs(blob, fileName);

      return true;
    },
    onSuccess: () => {
      toast({
        title: "Reporte descargado",
        description: "El reporte ha sido descargado exitosamente",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo descargar el reporte. Inténtalo nuevamente.",
        variant: "destructive",
      });
    },
  });
};
