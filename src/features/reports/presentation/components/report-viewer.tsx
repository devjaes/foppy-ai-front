"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format-date";
import { DownloadCloud, Loader2, Trash2 } from "lucide-react";
import {
  useDeleteReport,
  useDownloadReport,
} from "../../hooks/use-reports-queries";
import {
  Report,
  REPORT_FORMAT_LABELS,
  REPORT_TYPE_LABELS,
} from "../../interfaces/reports.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ReportViewerProps {
  report: Report;
}

export default function ReportViewer({ report }: ReportViewerProps) {
  const deleteReport = useDeleteReport();
  const downloadReport = useDownloadReport();
  const router = useRouter();

  const handleDelete = () => {
    deleteReport.mutate(report.id, {
      onSuccess: () => {
        router.push("/management/reports");
      },
    });
  };

  const handleDownload = () => {
    downloadReport.mutate({ id: report.id, report });
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-xl">
            {REPORT_TYPE_LABELS[report.type] || report.type}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={"default"}>{"Disponible"}</Badge>
            <Badge variant="outline">
              {REPORT_FORMAT_LABELS[report.format] || report.format}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">ID:</span>
          <span className="text-right font-medium">{report.id}</span>

          <span className="text-muted-foreground">Creado:</span>
          <span className="text-right font-medium">
            {formatDate(new Date(report.createdAt), "dd/MM/yyyy HH:mm")}
          </span>

          <span className="text-muted-foreground">Expira:</span>
          <span className="text-right font-medium">
            {formatDate(new Date(report.expiresAt), "dd/MM/yyyy HH:mm")}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2 pt-4">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleDownload}
          disabled={downloadReport.isPending}
        >
          {downloadReport.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Descargando...</span>
            </>
          ) : (
            <>
              <DownloadCloud className="h-4 w-4" />
              <span>Descargar</span>
            </>
          )}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              className="flex items-center gap-1"
              disabled={deleteReport.isPending}
            >
              {deleteReport.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente
                este reporte.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
