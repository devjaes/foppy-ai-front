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
import { PeriodSelector, type PeriodRange } from "@/components/period-selector";
import { useState } from "react";
import { ReportType, ReportFilters } from "../../interfaces/reports.interface";
import { format } from "date-fns";

interface ReportFormProps {
  onPreview?: (config: {
    type: ReportType;
    filters: ReportFilters;
    period: PeriodRange;
  }) => void;
  initialPeriod?: PeriodRange | null;
}

export default function ReportForm({
  onPreview,
  initialPeriod,
}: ReportFormProps = {}) {
  // Estado para el período seleccionado
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodRange>(
    initialPeriod || {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Primer día del mes actual
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // Último día del mes actual
      type: "current-month",
      label: "Mes actual",
    }
  );

  const { form, onSubmit } = useReportForm(selectedPeriod);
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

        <div className="col-span-2">
          <label className="text-sm font-medium mb-2 block">
            Período del Reporte
          </label>
          <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
        </div>

        <div className="flex justify-end gap-2">
          {onPreview && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const values = form.getValues();
                const config = {
                  type: values.type,
                  filters: {
                    startDate: format(selectedPeriod.startDate, "yyyy-MM-dd"),
                    endDate: format(selectedPeriod.endDate, "yyyy-MM-dd"),
                    categoryId: values.categoryId,
                    userId: form.getValues().userId,
                  },
                  period: selectedPeriod,
                };
                onPreview(config);
              }}
              disabled={generateReport.isPending}
              className="w-full md:w-auto"
            >
              Vista Previa
            </Button>
          )}
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
