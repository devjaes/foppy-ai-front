import { Debt } from "../interfaces/debts.interface";
import {
  ProgressStatus,
  calculateProgressPercentage,
  calculateDaysToDeadline,
} from "@/lib/progress-utils";

/**
 * Calcula el estado de progreso de una deuda basado en el pago y la fecha de vencimiento
 * @param debt La deuda a evaluar
 * @returns Objeto con color de progreso, texto de estado y porcentaje de progreso
 */
export function calculateDebtProgressStatus(debt: Debt): ProgressStatus {
  // Calcular el progreso de pago de la deuda
  const amountPaid = debt.original_amount - debt.pending_amount;
  const progressPercentage = calculateProgressPercentage(
    amountPaid,
    debt.original_amount
  );

  // Determinar el estado del pago basado en la fecha de vencimiento y el progreso
  const today = new Date();
  const dueDate = debt.due_date ? new Date(debt.due_date) : null;

  // Determinar el color de la barra de progreso y el estado
  let progressColor = "";
  let statusText = "";

  if (debt.paid) {
    // Deuda completamente pagada
    progressColor = "bg-green-500";
    statusText = "Pagada";
  } else if (!dueDate) {
    // Si no hay fecha de vencimiento, evaluar solo por progreso
    if (progressPercentage >= 75) {
      progressColor = "bg-green-500";
      statusText = "Buen progreso";
    } else if (progressPercentage >= 40) {
      progressColor = "bg-yellow-500";
      statusText = "Progreso moderado";
    } else {
      progressColor = "bg-red-500";
      statusText = "Poco progreso";
    }
  } else if (dueDate < today) {
    // La fecha de vencimiento ya pasó
    progressColor = "bg-red-500";
    statusText = "Vencida";
  } else {
    // Calcular cuánto tiempo queda hasta la fecha de vencimiento
    const daysToDeadline = calculateDaysToDeadline(dueDate);

    // Evaluar el estado basado en tiempo restante y progreso
    if (daysToDeadline <= 7) {
      // Menos de una semana para vencimiento
      if (progressPercentage >= 80) {
        progressColor = "bg-green-500";
        statusText = "A tiempo";
      } else {
        progressColor = "bg-yellow-500";
        statusText = "Próxima a vencer";
      }
    } else {
      // Más de una semana para el vencimiento
      if (progressPercentage >= 50) {
        progressColor = "bg-green-500";
        statusText = "Buen ritmo";
      } else if (progressPercentage >= 25) {
        progressColor = "bg-yellow-500";
        statusText = "Ritmo moderado";
      } else {
        progressColor = "bg-red-500";
        statusText = "Ritmo bajo";
      }
    }
  }

  return { progressColor, statusText, progressPercentage };
}
