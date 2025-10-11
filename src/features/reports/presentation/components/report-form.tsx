"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Info } from "lucide-react";
import { useReportForm } from "../../hooks/use-report-form";
import { useGenerateReport } from "../../hooks/use-reports-queries";
import {
  REPORT_FORMAT_LABELS,
  REPORT_TYPE_LABELS,
  REPORT_TYPE_DESCRIPTIONS,
  ReportType,
} from "../../interfaces/reports.interface";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";
import RHFSelect from "@/components/rhf/RHFSelect";
import RHFDatePicker from "@/components/rhf/date-picker/RHFDatePicker";
import { FormProvider } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFindGoalUsersById } from "@/features/goals/hooks/use-goals-queries";
import { useSession } from "next-auth/react";

export default function ReportForm() {
  const { form, onSubmit } = useReportForm();
  const generateReport = useGenerateReport();
  const { data: categories = [] } = useCategories();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: goals = [] } = useFindGoalUsersById(userId || "");

  const selectedType = form.watch("type");
  const selectedFormat = form.watch("format");

  const reportTypeOptions = Object.entries(REPORT_TYPE_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  const reportFormatOptions = Object.entries(REPORT_FORMAT_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  const categoryOptions = [
    { value: "all", label: "Todas las categorías" },
    ...categories.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })),
  ];

  const goalOptions = [
    { value: "none", label: "Selecciona una meta" },
    ...goals.map((goal) => ({
      value: goal.id.toString(),
      label: goal.name,
    })),
  ];

  const requiresGoal = [
    ReportType.CONTRIBUTIONS_BY_GOAL,
    ReportType.SAVINGS_COMPARISON,
  ].includes(selectedType as ReportType);

  const supportsCategory = [
    ReportType.GOALS_BY_CATEGORY,
    ReportType.GOALS_BY_STATUS,
  ].includes(selectedType as ReportType);

  const supportsDateRange = true;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurar Reporte</CardTitle>
            <CardDescription>
              Selecciona el tipo de reporte que deseas generar y configura los
              filtros necesarios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RHFSelect
                name="type"
                label="Tipo de Reporte"
                placeholder="Selecciona un tipo"
                options={reportTypeOptions}
              />

              <RHFSelect
                name="format"
                label="Formato"
                placeholder="Selecciona un formato"
                options={reportFormatOptions}
              />
            </div>

            {selectedType && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {REPORT_TYPE_DESCRIPTIONS[selectedType as ReportType]}
                </AlertDescription>
              </Alert>
            )}

            {requiresGoal && (
              <div>
                <RHFSelect
                  name="goalId"
                  label="Meta"
                  placeholder="Selecciona una meta"
                  options={goalOptions}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  * Campo requerido para este tipo de reporte
                </p>
              </div>
            )}

            {supportsCategory && (
              <RHFSelect
                name="categoryId"
                label="Categoría (Opcional)"
                placeholder="Todas las categorías"
                options={categoryOptions}
              />
            )}

            {supportsDateRange && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RHFDatePicker
                    name="startDate"
                    label="Fecha de Inicio (Opcional)"
                  />

                  <RHFDatePicker
                    name="endDate"
                    label="Fecha de Fin (Opcional)"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Si no especificas fechas, se incluirán todos los datos
                  disponibles.
                </p>
              </div>
            )}

            {selectedFormat && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {selectedFormat === "JSON" &&
                    "El formato JSON te permitirá visualizar los datos directamente en el navegador con un diseño mejorado."}
                  {selectedFormat === "PDF" &&
                    "El formato PDF generará un documento profesional listo para imprimir o compartir."}
                  {selectedFormat === "EXCEL" &&
                    "El formato Excel te permitirá analizar y manipular los datos con herramientas de hoja de cálculo."}
                  {selectedFormat === "CSV" &&
                    "El formato CSV es ideal para importar los datos en otras aplicaciones o realizar análisis personalizados."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={generateReport.isPending}
            size="lg"
            className="w-full md:w-auto"
          >
            {generateReport.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando Reporte...
              </>
            ) : (
              "Generar Reporte"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
