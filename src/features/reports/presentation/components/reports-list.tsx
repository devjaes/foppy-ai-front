"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { formatDate } from "@/lib/format-date";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Report,
  REPORT_FORMAT_LABELS,
  REPORT_TYPE_LABELS,
} from "../../interfaces/reports.interface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface ReportsListProps {
  reports: Report[];
}

export default function ReportsList({ reports }: ReportsListProps) {
  const router = useRouter();

  if (reports.length === 0) {
    return (
      <EmptyState
        title="No hay reportes"
        description="No se han generado reportes. Genera tu primer reporte para comenzar."
        action={
          <Link href="/management/reports/create" passHref>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear reporte
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reports.map((report) => {
        // Determinar si el reporte ha expirado
        const isExpired = new Date(report.expiresAt) < new Date();

        return (
          <Card
            key={report.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/management/reports/${report.id}`)}
          >
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-lg">
                  {REPORT_TYPE_LABELS[report.type] || report.type}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant={isExpired ? "destructive" : "default"}>
                    {isExpired ? "Expirado" : "Disponible"}
                  </Badge>
                  <Badge variant="outline">
                    {REPORT_FORMAT_LABELS[report.format] || report.format}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>
                  Creado:{" "}
                  {formatDate(new Date(report.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
                <p>
                  Expira:{" "}
                  {formatDate(new Date(report.expiresAt), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
