"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Report,
  ReportType,
  GoalStatusReportData,
  GoalCategoryReportData,
  ContributionReportData,
  SavingsComparisonReportData,
  SavingsSummaryReportData,
  TransactionsSummaryReportData,
  ExpensesByCategoryReportData,
  MonthlyTrendReportData,
  BudgetPerformanceReportData,
  FinancialOverviewReportData,
} from "../../interfaces/reports.interface";
import {
  TransactionsSummaryViewer,
  ExpensesByCategoryViewer,
  MonthlyTrendViewer,
  BudgetPerformanceViewer,
  FinancialOverviewViewer,
} from "./new-report-viewers";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import {
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Target,
  Coins,
  Calendar,
  ArrowUpDown,
} from "lucide-react";

interface ReportViewerProps {
  report: Report;
}

export default function ReportViewer({ report }: ReportViewerProps) {
  if (!report.data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No hay datos disponibles para este reporte.</p>
        </CardContent>
      </Card>
    );
  }

  const renderContent = () => {
    switch (report.type) {
      case ReportType.GOALS_BY_STATUS:
        return <GoalsByStatusViewer data={report.data as GoalStatusReportData} />;
      case ReportType.GOALS_BY_CATEGORY:
        return <GoalsByCategoryViewer data={report.data as GoalCategoryReportData} />;
      case ReportType.CONTRIBUTIONS_BY_GOAL:
        return <ContributionsByGoalViewer data={report.data as ContributionReportData} />;
      case ReportType.SAVINGS_COMPARISON:
        return <SavingsComparisonViewer data={report.data as SavingsComparisonReportData} />;
      case ReportType.SAVINGS_SUMMARY:
        return <SavingsSummaryViewer data={report.data as SavingsSummaryReportData} />;
      case ReportType.TRANSACTIONS_SUMMARY:
        return <TransactionsSummaryViewer data={report.data as TransactionsSummaryReportData} />;
      case ReportType.EXPENSES_BY_CATEGORY:
        return <ExpensesByCategoryViewer data={report.data as ExpensesByCategoryReportData} />;
      case ReportType.MONTHLY_TREND:
        return <MonthlyTrendViewer data={report.data as MonthlyTrendReportData} />;
      case ReportType.BUDGET_PERFORMANCE:
        return <BudgetPerformanceViewer data={report.data as BudgetPerformanceReportData} />;
      case ReportType.FINANCIAL_OVERVIEW:
        return <FinancialOverviewViewer data={report.data as FinancialOverviewReportData} />;
      default:
        return <pre className="text-sm overflow-auto">{JSON.stringify(report.data, null, 2)}</pre>;
    }
  };

  return <div className="space-y-6">{renderContent()}</div>;
}

// ===== GOALS BY STATUS VIEWER =====
function GoalsByStatusViewer({ data }: { data: GoalStatusReportData }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "expired":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "inProgress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default" as const,
      expired: "destructive" as const,
      inProgress: "secondary" as const,
    };
    
    const labels = {
      completed: "Completada",
      expired: "Expirada",
      inProgress: "En Progreso",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Metas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.completed || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data.inProgress || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiradas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.expired || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Metas</CardTitle>
        </CardHeader>
        <CardContent>
          {data.goals && data.goals.length > 0 ? (
            <div className="space-y-4">
              {data.goals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(goal.status)}
                      <div>
                        <h4 className="font-semibold">{goal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {goal.categoryName || "Sin categoría"}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(goal.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Meta</p>
                      <p className="font-semibold">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ahorrado</p>
                      <p className="font-semibold">{formatCurrency(goal.currentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fecha límite</p>
                      <p className="font-semibold">{formatDate(goal.deadline)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Progreso</p>
                      <p className="font-semibold">{goal.progress.toFixed(1)}%</p>
                    </div>
                  </div>

                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No hay metas para mostrar
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ===== GOALS BY CATEGORY VIEWER =====
function GoalsByCategoryViewer({ data }: { data: GoalCategoryReportData }) {
  return (
    <>
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categorías</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCategories || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Metas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalGoals || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {data.categories && data.categories.length > 0 ? (
          data.categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <Badge variant="outline">{category.totalGoals} metas</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-semibold">{formatCurrency(category.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ahorrado</p>
                    <p className="font-semibold">{formatCurrency(category.completedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Progreso</p>
                    <p className="font-semibold">{category.progress.toFixed(1)}%</p>
                  </div>
                </div>

                <Progress value={category.progress} className="h-2" />

                {category.goals && category.goals.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Metas en esta categoría:</h5>
                      <div className="space-y-2">
                        {category.goals.map((goal) => (
                          <div
                            key={goal.id}
                            className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">{goal.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">{goal.progress.toFixed(1)}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                No hay categorías con metas
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

// ===== CONTRIBUTIONS BY GOAL VIEWER =====
function ContributionsByGoalViewer({ data }: { data: ContributionReportData }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{data.goalName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Total Contribuciones</p>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(data.totalContributions)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Promedio</p>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(data.averageContribution)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Última Contribución</p>
              </div>
              <p className="text-2xl font-bold">
                {data.lastContributionDate
                  ? formatDate(data.lastContributionDate)
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Contribuciones</CardTitle>
        </CardHeader>
        <CardContent>
          {data.contributions && data.contributions.length > 0 ? (
            <div className="space-y-2">
              {data.contributions.map((contrib) => (
                <div
                  key={contrib.id}
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div>
                    <p className="font-medium">{formatCurrency(contrib.amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(contrib.date)}
                    </p>
                  </div>
                  {contrib.transactionId && (
                    <Badge variant="outline">ID: {contrib.transactionId}</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No hay contribuciones registradas
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ===== SAVINGS COMPARISON VIEWER =====
function SavingsComparisonViewer({ data }: { data: SavingsComparisonReportData }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Comparación de Ahorro: {data.goalName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.deviations && data.deviations.length > 0 ? (
            <div className="space-y-2">
              {data.deviations.map((dev, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 p-3 rounded-md border items-center"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">{formatDate(dev.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Planificado</p>
                    <p className="font-medium">{formatCurrency(dev.plannedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Real</p>
                    <p className="font-medium">{formatCurrency(dev.actualAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diferencia</p>
                    <p
                      className={`font-bold ${
                        dev.difference >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {dev.difference >= 0 ? "+" : ""}
                      {formatCurrency(dev.difference)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No hay datos de comparación disponibles
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ===== SAVINGS SUMMARY VIEWER =====
function SavingsSummaryViewer({ data }: { data: SavingsSummaryReportData }) {
  return (
    <>
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Metas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalGoals || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.completedGoals || 0} completadas · {data.inProgressGoals || 0} en progreso
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalTargetAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ahorrado Total</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.totalCurrentAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overallProgress.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso General</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={data.overallProgress} className="h-3" />
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Contribución Promedio</p>
              <p className="text-lg font-semibold">
                {formatCurrency(data.averageContribution)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Última Contribución</p>
              <p className="text-lg font-semibold">
                {data.lastContributionDate
                  ? formatDate(data.lastContributionDate)
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {data.categoryBreakdown && data.categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Desglose por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.categoryBreakdown.map((cat) => (
                <div key={cat.categoryId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{cat.categoryName}</p>
                      <p className="text-sm text-muted-foreground">
                        {cat.totalGoals} metas · {formatCurrency(cat.totalAmount)}
                      </p>
                    </div>
                    <p className="font-semibold">{cat.progress.toFixed(1)}%</p>
                  </div>
                  <Progress value={cat.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
