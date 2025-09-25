import { Goal } from "../interfaces/ goals.interface";
import {
  ProgressStatus,
  calculateProgressPercentage,
  calculateTimeProgress,
  calculateProgressRatio,
} from "@/lib/progress-utils";

/**
 * Calcula el estado de progreso de una meta basado en el avance y el tiempo transcurrido
 * @param goal La meta a evaluar
 * @returns Objeto con color de progreso, texto de estado y porcentaje de progreso
 */
export function calculateGoalProgressStatus(goal: Goal): ProgressStatus {
  const progressPercentage = calculateProgressPercentage(
    goal.current_amount,
    goal.target_amount
  );

  const startDate = new Date(goal?.created_at || new Date()); // Fecha actual como punto de inicio por defecto
  const endDate = new Date(goal.end_date);
  const timeProgress = calculateTimeProgress(startDate, endDate);

  // Determinar el estado del progreso
  const progressRatio = calculateProgressRatio(
    progressPercentage,
    timeProgress
  );

  let progressColor = "";
  let statusText = "";

  if (progressPercentage >= 100) {
    progressColor = "bg-green-500";
    statusText = "Completado";
  } else if (progressRatio >= 1) {
    progressColor = "bg-green-500";
    statusText = "Buen ritmo";
  } else if (progressRatio >= 0.7) {
    progressColor = "bg-yellow-500";
    statusText = "Ligeramente retrasado";
  } else {
    progressColor = "bg-red-500";
    statusText = "Muy retrasado";
  }

  return { progressColor, statusText, progressPercentage };
}
