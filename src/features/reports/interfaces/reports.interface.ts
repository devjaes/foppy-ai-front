export enum ReportType {
  GOALS_BY_STATUS = "GOALS_BY_STATUS",
  GOALS_BY_CATEGORY = "GOALS_BY_CATEGORY",
  CONTRIBUTIONS_BY_GOAL = "CONTRIBUTIONS_BY_GOAL",
  SAVINGS_COMPARISON = "SAVINGS_COMPARISON",
  SAVINGS_SUMMARY = "SAVINGS_SUMMARY",
  TRANSACTIONS_SUMMARY = "TRANSACTIONS_SUMMARY",
  EXPENSES_BY_CATEGORY = "EXPENSES_BY_CATEGORY",
  MONTHLY_TREND = "MONTHLY_TREND",
  BUDGET_PERFORMANCE = "BUDGET_PERFORMANCE",
  FINANCIAL_OVERVIEW = "FINANCIAL_OVERVIEW",
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
  goalId?: string;
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
  data?: any;
  createdAt: string;
  expiresAt: string;
  needsDownload?: boolean;
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  [ReportType.GOALS_BY_STATUS]: "Metas por Estado",
  [ReportType.GOALS_BY_CATEGORY]: "Metas por Categoría",
  [ReportType.CONTRIBUTIONS_BY_GOAL]: "Contribuciones por Meta",
  [ReportType.SAVINGS_COMPARISON]: "Comparación de Ahorro",
  [ReportType.SAVINGS_SUMMARY]: "Resumen de Ahorro",
  [ReportType.TRANSACTIONS_SUMMARY]: "Resumen de Transacciones",
  [ReportType.EXPENSES_BY_CATEGORY]: "Gastos por Categoría",
  [ReportType.MONTHLY_TREND]: "Tendencia Mensual",
  [ReportType.BUDGET_PERFORMANCE]: "Rendimiento de Presupuestos",
  [ReportType.FINANCIAL_OVERVIEW]: "Vista General Financiera",
};

export const REPORT_FORMAT_LABELS: Record<ReportFormat, string> = {
  [ReportFormat.JSON]: "JSON",
  [ReportFormat.PDF]: "PDF",
  [ReportFormat.EXCEL]: "Excel",
  [ReportFormat.CSV]: "CSV",
};

export const REPORT_TYPE_DESCRIPTIONS: Record<ReportType, string> = {
  [ReportType.GOALS_BY_STATUS]: "Visualiza todas tus metas agrupadas por su estado: completadas, en progreso o expiradas. Incluye métricas de progreso y detalles de cada meta.",
  [ReportType.GOALS_BY_CATEGORY]: "Agrupa tus metas por categoría (Auto, Casa, Viajes, etc.) mostrando el progreso total y desglose detallado por categoría.",
  [ReportType.CONTRIBUTIONS_BY_GOAL]: "Historial completo de contribuciones a una meta específica, incluyendo fechas, montos y promedios.",
  [ReportType.SAVINGS_COMPARISON]: "Compara tus ahorros planificados vs reales para una meta específica, identificando desviaciones positivas o negativas.",
  [ReportType.SAVINGS_SUMMARY]: "Resumen completo de todas tus metas con métricas financieras globales y desglose por categoría.",
  [ReportType.TRANSACTIONS_SUMMARY]: "Análisis completo de tus transacciones incluyendo ingresos, gastos, balance neto y categorías principales con gráficos visuales.",
  [ReportType.EXPENSES_BY_CATEGORY]: "Distribución detallada de tus gastos agrupados por categoría con porcentajes y gráfico circular de distribución.",
  [ReportType.MONTHLY_TREND]: "Evolución temporal de tus finanzas mostrando ingresos y gastos por mes con tendencias y gráfico de líneas.",
  [ReportType.BUDGET_PERFORMANCE]: "Análisis del rendimiento de tus presupuestos mostrando cuáles están en buen estado, advertencia o excedidos.",
  [ReportType.FINANCIAL_OVERVIEW]: "Vista panorámica completa de tu situación financiera incluyendo transacciones, metas, presupuestos y categorías principales.",
};

export interface BinaryReportResponse {
  id: string;
  format: ReportFormat;
  type: string;
  createdAt: string;
  expiresAt: string;
  needsDownload: boolean;
}

export type ReportResponse = Report | BinaryReportResponse;

export interface GoalStatusReportData {
  completed: number;
  expired: number;
  inProgress: number;
  total: number;
  goals: Array<{
    id: string;
    name: string;
    status: "completed" | "expired" | "inProgress";
    targetAmount: number;
    currentAmount: number;
    progress: number;
    deadline: string;
    categoryName?: string;
  }>;
}

export interface GoalCategoryReportData {
  totalCategories: number;
  totalGoals: number;
  categories: Array<{
    id: string;
    name: string;
    totalGoals: number;
    totalAmount: number;
    completedAmount: number;
    progress: number;
    goals: Array<{
      id: string;
      name: string;
      targetAmount: number;
      currentAmount: number;
      progress: number;
      endDate: string;
      status: "completed" | "expired" | "inProgress";
    }>;
  }>;
}

export interface ContributionReportData {
  goalId: string;
  goalName: string;
  contributions: Array<{
    id: string;
    amount: number;
    date: string;
    transactionId?: string;
  }>;
  totalContributions: number;
  averageContribution: number;
  lastContributionDate?: string;
}

export interface SavingsComparisonReportData {
  goalId: string;
  goalName: string;
  plannedSavings: Array<{
    date: string;
    amount: number;
  }>;
  actualSavings: Array<{
    date: string;
    amount: number;
  }>;
  deviations: Array<{
    date: string;
    plannedAmount: number;
    actualAmount: number;
    difference: number;
  }>;
}

export interface SavingsSummaryReportData {
  totalGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  overallProgress: number;
  completedGoals: number;
  expiredGoals: number;
  inProgressGoals: number;
  averageContribution: number;
  lastContributionDate?: string;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    totalGoals: number;
    totalAmount: number;
    progress: number;
  }>;
}

export interface TransactionsSummaryReportData {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
  averageIncome: number;
  averageExpense: number;
  topIncomeCategory?: {
    name: string;
    amount: number;
  };
  topExpenseCategory?: {
    name: string;
    amount: number;
  };
  transactions: Array<{
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    category?: string;
    description?: string;
    date: string;
  }>;
}

export interface ExpensesByCategoryReportData {
  totalExpenses: number;
  categoryCount: number;
  categories: Array<{
    id: string;
    name: string;
    amount: number;
    percentage: number;
    transactionCount: number;
    transactions: Array<{
      id: string;
      amount: number;
      description?: string;
      date: string;
    }>;
  }>;
}

export interface MonthlyTrendReportData {
  months: Array<{
    month: string;
    income: number;
    expense: number;
    balance: number;
    transactionCount: number;
  }>;
  averageMonthlyIncome: number;
  averageMonthlyExpense: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface BudgetPerformanceReportData {
  totalBudgets: number;
  exceededCount: number;
  warningCount: number;
  goodCount: number;
  budgets: Array<{
    id: string;
    categoryName: string;
    limitAmount: number;
    currentAmount: number;
    percentage: number;
    status: "exceeded" | "warning" | "good";
    month: string;
  }>;
}

export interface FinancialOverviewReportData {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    savingsRate: number;
  };
  goals: {
    total: number;
    completed: number;
    inProgress: number;
    totalSaved: number;
    totalTarget: number;
    overallProgress: number;
  };
  budgets: {
    total: number;
    exceeded: number;
    averageUtilization: number;
  };
  debts: {
    total: number;
    totalAmount: number;
    totalPending: number;
  };
  topCategories: {
    expenses: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
    income: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
  };
}

export type ReportDataType<T extends ReportType> =
  T extends ReportType.GOALS_BY_STATUS ? GoalStatusReportData :
  T extends ReportType.GOALS_BY_CATEGORY ? GoalCategoryReportData :
  T extends ReportType.CONTRIBUTIONS_BY_GOAL ? ContributionReportData :
  T extends ReportType.SAVINGS_COMPARISON ? SavingsComparisonReportData :
  T extends ReportType.SAVINGS_SUMMARY ? SavingsSummaryReportData :
  T extends ReportType.TRANSACTIONS_SUMMARY ? TransactionsSummaryReportData :
  T extends ReportType.EXPENSES_BY_CATEGORY ? ExpensesByCategoryReportData :
  T extends ReportType.MONTHLY_TREND ? MonthlyTrendReportData :
  T extends ReportType.BUDGET_PERFORMANCE ? BudgetPerformanceReportData :
  T extends ReportType.FINANCIAL_OVERVIEW ? FinancialOverviewReportData :
  any;
