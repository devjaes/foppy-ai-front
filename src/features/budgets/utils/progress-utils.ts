import { Budget } from "../interfaces/budgets.interface";
import {
  ProgressStatus,
  calculateProgressPercentage,
  getProgressColorByPercentage,
} from "@/lib/progress-utils";

/**
 * Calcula el estado de progreso de un presupuesto basado en su uso actual
 * @param budget El presupuesto a evaluar
 * @returns Objeto con color de progreso, texto de estado, porcentaje y si excede el límite
 */
export function calculateBudgetProgressStatus(
  budget: Budget
): ProgressStatus & { isOverBudget: boolean } {
  const progressPercentage = calculateProgressPercentage(
    budget.current_amount,
    budget.limit_amount
  );
  const isOverBudget = budget.current_amount > budget.limit_amount;

  // Calcular el porcentaje de uso del presupuesto
  const usagePercentage = (budget.current_amount / budget.limit_amount) * 100;

  // Determinar el color de la barra de progreso y el estado
  const progressColor = getProgressColorByPercentage(usagePercentage, true);
  let statusText = "";

  if (isOverBudget) {
    // Presupuesto excedido
    statusText = "Excedido";
  } else if (usagePercentage >= 90) {
    // Casi alcanzando el límite
    statusText = "Casi al límite";
  } else if (usagePercentage >= 75) {
    // Acercándose al límite
    statusText = "Acercándose al límite";
  } else {
    // Uso adecuado del presupuesto
    statusText = "Uso adecuado";
  }

  return { progressColor, statusText, progressPercentage, isOverBudget };
}
