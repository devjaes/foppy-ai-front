export enum ReportType {
  // Existentes
  GOALS_BY_STATUS = "GOALS_BY_STATUS",
  GOALS_BY_CATEGORY = "GOALS_BY_CATEGORY",
  CONTRIBUTIONS_BY_GOAL = "CONTRIBUTIONS_BY_GOAL",
  SAVINGS_COMPARISON = "SAVINGS_COMPARISON",
  SAVINGS_SUMMARY = "SAVINGS_SUMMARY",
  // Nuevos
  BUDGET = "BUDGET",
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  DEBT = "DEBT",
  COMPREHENSIVE = "COMPREHENSIVE",
}

export enum ReportFormat {
  JSON = "JSON",
  PDF = "PDF",
  EXCEL = "EXCEL",
  CSV = "CSV",
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  userId?: string;
}

export interface ReportRequest {
  type: ReportType;
  format: ReportFormat;
  filters: ReportFilters;
}

export interface Report {
  id: string;
  type: ReportType;
  format: ReportFormat;
  data?: Date;
  createdAt: string;
  expiresAt: string;
  needsDownload?: boolean;
}

export const REPORT_TYPE_LABELS = {
  [ReportType.GOALS_BY_STATUS]: "Metas por Estado",
  [ReportType.GOALS_BY_CATEGORY]: "Metas por Categoría",
  [ReportType.CONTRIBUTIONS_BY_GOAL]: "Contribuciones por Meta",
  [ReportType.SAVINGS_COMPARISON]: "Comparación de Ahorros",
  [ReportType.SAVINGS_SUMMARY]: "Resumen de Ahorros",
  [ReportType.BUDGET]: "Presupuestos",
  [ReportType.EXPENSE]: "Gastos",
  [ReportType.INCOME]: "Ingresos",
  [ReportType.DEBT]: "Deudas",
  [ReportType.COMPREHENSIVE]: "Reporte Completo",
};

export const REPORT_FORMAT_LABELS = {
  [ReportFormat.JSON]: "JSON",
  [ReportFormat.PDF]: "PDF",
  [ReportFormat.EXCEL]: "Excel",
  [ReportFormat.CSV]: "CSV",
};

// Añadir un tipo especial para el formato binario
export enum BinaryReportFormat {
  BINARY_DOWNLOAD = "BINARY_DOWNLOAD",
}

// Extender ReportFormat para incluir todos los posibles formatos
export type AllReportFormats = ReportFormat | BinaryReportFormat;

// Interfaz para manejar la respuesta cuando es un archivo binario
export interface BinaryReportResponse {
  id: string;
  format: BinaryReportFormat | ReportFormat;
  type: string;
  createdAt: string;
  expiresAt: string;
  needsDownload: boolean;
}

// Tipo unión para manejar ambos tipos de respuestas
export type ReportResponse = Report | BinaryReportResponse;
