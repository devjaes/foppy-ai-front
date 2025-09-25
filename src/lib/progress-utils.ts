/**
 * Interfaz para representar el estado visual del progreso
 */
export interface ProgressStatus {
  progressColor: string;
  statusText: string;
  progressPercentage: number;
}

/**
 * Calcula el porcentaje de progreso basado en un valor actual y un valor objetivo
 * @param currentValue Valor actual alcanzado
 * @param targetValue Valor objetivo a alcanzar
 * @returns Porcentaje de progreso (limitado a 100%)
 */
export function calculateProgressPercentage(
  currentValue: number,
  targetValue: number
): number {
  if (targetValue <= 0) return 0;
  return Math.min((currentValue / targetValue) * 100, 100);
}

/**
 * Calcula el progreso esperado basado en tiempo transcurrido
 * @param startDate Fecha de inicio
 * @param endDate Fecha de finalización
 * @returns Porcentaje de tiempo transcurrido (0-100)
 */
export function calculateTimeProgress(startDate: Date, endDate: Date): number {
  const today = new Date();

  // Si la fecha de inicio es posterior a hoy, usar la fecha actual
  const effectiveStartDate = startDate > today ? today : startDate;

  const totalDuration = endDate.getTime() - effectiveStartDate.getTime();
  if (totalDuration <= 0) return 100; // Para evitar división por cero o valores negativos

  const elapsedTime = today.getTime() - effectiveStartDate.getTime();
  return Math.min((elapsedTime / totalDuration) * 100, 100);
}

/**
 * Calcula días restantes hasta una fecha de vencimiento
 * @param dueDate Fecha de vencimiento
 * @returns Número de días restantes (negativo si ya pasó)
 */
export function calculateDaysToDeadline(dueDate: Date): number {
  const today = new Date();
  const timeToDeadline = dueDate.getTime() - today.getTime();
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  return Math.ceil(timeToDeadline / millisecondsInDay);
}

/**
 * Determina el color para la barra de progreso basado en un porcentaje
 * @param percentage Porcentaje de progreso
 * @param isInverse True si valores altos son negativos (ej: presupuestos)
 * @returns Clase CSS para el color de fondo
 */
export function getProgressColorByPercentage(
  percentage: number,
  isInverse: boolean = false
): string {
  if (isInverse) {
    // Para presupuestos donde acercarse al 100% no es positivo
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 90) return "bg-yellow-500";
    if (percentage >= 75) return "bg-yellow-400";
    return "bg-green-500";
  } else {
    // Para metas, pagos, etc. donde acercarse al 100% es positivo
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-green-400";
    if (percentage >= 50) return "bg-yellow-400";
    return "bg-red-500";
  }
}

/**
 * Evalúa si el progreso está acorde al tiempo transcurrido
 * @param progressPercentage Porcentaje de progreso actual
 * @param timeProgress Porcentaje de tiempo transcurrido
 * @returns Ratio de progreso vs tiempo (>1 significa buen ritmo)
 */
export function calculateProgressRatio(
  progressPercentage: number,
  timeProgress: number
): number {
  if (timeProgress <= 0) return 1;
  return progressPercentage / timeProgress;
}
