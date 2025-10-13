import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReportFormat, ReportType } from "../interfaces/reports.interface";
import { useSession } from "next-auth/react";
import { useGenerateReport } from "./use-reports-queries";

// Schema para validar el formulario
const reportFormSchema = z.object({
  type: z.nativeEnum(ReportType),
  format: z.nativeEnum(ReportFormat),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  categoryId: z.string().optional(),
  goalId: z.string().optional(),
});

// Tipo para inferir el tipo de datos del formulario
type ReportFormValues = z.infer<typeof reportFormSchema>;

export const useReportForm = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const generateReport = useGenerateReport();

  // Inicializar el formulario con valores por defecto
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      type: ReportType.GOALS_BY_STATUS,
      format: ReportFormat.PDF,
      startDate: undefined,
      endDate: undefined,
      categoryId: "",
      goalId: "",
    },
  });

  // Enviar el formulario
  const onSubmit = (values: ReportFormValues) => {
    const filters: Record<string, string> = {
      userId: userId?.toString() || "",
    };

    // Solo incluir fechas si están definidas
    if (values.startDate) {
      filters.startDate = values.startDate.toISOString();
    }

    if (values.endDate) {
      filters.endDate = values.endDate.toISOString();
    }

    // Solo incluir categoryId si no está vacío
    if (values.categoryId && values.categoryId !== "") {
      filters.categoryId = values.categoryId;
    }

    // Solo incluir goalId si no está vacío
    if (values.goalId && values.goalId !== "" && values.goalId !== "none") {
      filters.goalId = values.goalId;
    }

    const reportRequest = {
      type: values.type,
      format: values.format,
      filters,
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

    console.log("Report request:", reportRequest);

    return reportRequest;
  };

  return {
    form,
    onSubmit,
  };
};
