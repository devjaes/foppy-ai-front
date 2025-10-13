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

export default function ReportCreateView() {
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
