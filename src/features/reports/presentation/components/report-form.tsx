"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useReportForm } from "../../hooks/use-report-form";
import { useGenerateReport } from "../../hooks/use-reports-queries";
import {
  REPORT_FORMAT_LABELS,
  REPORT_TYPE_LABELS,
} from "../../interfaces/reports.interface";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";
import RHFSelect from "@/components/rhf/RHFSelect";
import RHFDatePicker from "@/components/rhf/date-picker/RHFDatePicker";
import { FormProvider } from "react-hook-form";

export default function ReportForm() {
  const { form, onSubmit } = useReportForm();
  const generateReport = useGenerateReport();
  const { data: categories = [] } = useCategories();

  // Transformar las opciones para el selector de tipo de reporte
  const reportTypeOptions = Object.entries(REPORT_TYPE_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  // Transformar las opciones para el selector de formato
  const reportFormatOptions = Object.entries(REPORT_FORMAT_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  console.log(reportTypeOptions);
  console.log(reportFormatOptions);

  // Transformar las opciones para el selector de categoría
  const categoryOptions = [
    ...categories.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })),
  ];

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFSelect
            name="type"
            label="Tipo de Reporte"
            placeholder="Selecciona un tipo"
            options={reportTypeOptions || []}
          />

          <RHFSelect
            name="format"
            label="Formato"
            placeholder="Selecciona un formato"
            options={reportFormatOptions || []}
          />

          <RHFSelect
            name="categoryId"
            label="Categoría (Opcional)"
            placeholder="Todas las categorías"
            options={categoryOptions || []}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFDatePicker name="startDate" label="Fecha de Inicio (Opcional)" />

          <RHFDatePicker name="endDate" label="Fecha de Fin (Opcional)" />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={generateReport.isPending}
            className="w-full md:w-auto"
          >
            {generateReport.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
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
