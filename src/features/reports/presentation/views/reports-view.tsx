"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ReportsList from "../components/reports-list";
import { useQuery } from "@tanstack/react-query";
import { REPORTS_KEYS } from "../../constants/reports-keys";
import { Report } from "../../interfaces/reports.interface";

export default function ReportsView() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Realizar consulta de reportes (simulada por ahora)
  const { data: reports = [], isLoading } = useQuery({
    queryKey: REPORTS_KEYS.REPORTS,
    queryFn: async () => {
      // Este es un placeholder ya que la API necesitaría un endpoint para listar reportes
      // Por ahora solo devuelve un array vacío
      return [] as Report[];
    },
    enabled: !!userId,
  });

  const handleCreateReport = () => {
    router.push("/management/reports/create");
  };

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
