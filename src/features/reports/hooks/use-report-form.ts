import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReportFormat, ReportType } from "../interfaces/reports.interface";
import { useSession } from "next-auth/react";
import { useGenerateReport } from "./use-reports-queries";
import { PeriodRange } from "@/components/period-selector";
import { format } from "date-fns";

// Schema para validar el formulario
const reportFormSchema = z.object({
  type: z.nativeEnum(ReportType),
  format: z.nativeEnum(ReportFormat),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  categoryId: z.coerce.string().optional(),
});

// Tipo para inferir el tipo de datos del formulario
type ReportFormValues = z.infer<typeof reportFormSchema>;

export const useReportForm = (selectedPeriod: PeriodRange) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const generateReport = useGenerateReport();

  // Inicializar el formulario con valores por defecto
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      type: ReportType.GOALS_BY_CATEGORY,
      format: ReportFormat.PDF,
      startDate: selectedPeriod.startDate,
      endDate: selectedPeriod.endDate,
      categoryId: undefined,
    },
  });

  // Enviar el formulario
  const onSubmit = (values: ReportFormValues) => {
    // Usar las fechas del período seleccionado en formato YYYY-MM-DD
    const startDateStr = format(selectedPeriod.startDate, "yyyy-MM-dd");
    const endDateStr = format(selectedPeriod.endDate, "yyyy-MM-dd");

    // Añadir el userId al objeto de filtros
    const reportRequest = {
      type: values.type,
      format: values.format,
      filters: {
        startDate: startDateStr,
        endDate: endDateStr,
        categoryId: values.categoryId,
        userId: userId?.toString(),
      },
    };

    generateReport.mutate(reportRequest, {
      onSuccess: (data) => {
        // dirigir a una nueva pestaña
        window.open(
          `${process.env.NEXT_PUBLIC_API_URL}/reports/${data.id}`,
          "_blank"
        );
      },
    });

    console.log(reportRequest);

    return reportRequest;
  };

  return {
    form,
    onSubmit,
  };
};
