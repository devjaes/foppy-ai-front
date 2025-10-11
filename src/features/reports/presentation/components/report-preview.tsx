"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ReportType,
  ReportFormat,
  REPORT_TYPE_LABELS,
} from "../../interfaces/reports.interface";
import { PeriodRange } from "@/components/period-selector";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ReportPreviewProps {
  reportData: any;
  reportType: ReportType;
  period: PeriodRange;
  onDownload: (format: ReportFormat) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ReportPreview({
  reportData,
  reportType,
  period,
  onDownload,
  onCancel,
  isLoading = false,
}: ReportPreviewProps) {
  // Función para preparar datos para CategoryPieChart
  const prepareCategoryData = (data: any) => {
    if (!data?.topCategories || !Array.isArray(data.topCategories)) {
      return [];
    }

    return data.topCategories.map((category: any) => ({
      name: category.categoryName,
      value: category.totalAmount,
      percentage: category.percentage,
    }));
  };

  // Función para preparar datos para IncomeExpenseChart
  const prepareMonthlyData = (data: any) => {
    if (!data?.monthlyTrends || !Array.isArray(data.monthlyTrends)) {
      return [];
    }

    return data.monthlyTrends.map((trend: any) => ({
      month: trend.month,
      income: reportType === ReportType.INCOME ? trend.totalAmount : 0,
      expenses: reportType === ReportType.EXPENSE ? trend.totalAmount : 0,
    }));
  };

  // Función para preparar datos para TrendLineChart
  const prepareTrendData = (data: any) => {
    if (!data?.monthlyTrends || !Array.isArray(data.monthlyTrends)) {
      return [];
    }

    return data.monthlyTrends.map((trend: any) => ({
      month: trend.month,
      value: trend.totalAmount,
    }));
  };

  // Función para renderizar métricas de resumen
  const renderSummaryMetrics = () => {
    if (!reportData) return null;

    const metrics = [];

    switch (reportType) {
      case ReportType.EXPENSE:
        metrics.push(
          { label: "Total Gastos", value: reportData.totalExpenses },
          { label: "Transacciones", value: reportData.totalTransactions },
          { label: "Promedio", value: reportData.averageExpense }
        );
        break;
      case ReportType.INCOME:
        metrics.push(
          { label: "Total Ingresos", value: reportData.totalIncome },
          { label: "Transacciones", value: reportData.totalTransactions },
          { label: "Promedio", value: reportData.averageIncome }
        );
        break;
      case ReportType.BUDGET:
        metrics.push(
          { label: "Total Presupuestos", value: reportData.totalBudgets },
          { label: "Monto Total", value: reportData.totalBudgetAmount },
          { label: "Gastado", value: reportData.totalSpent },
          { label: "Sobre Presupuesto", value: reportData.overBudgetCount }
        );
        break;
      case ReportType.DEBT:
        metrics.push(
          { label: "Total Deudas", value: reportData.totalDebts },
          { label: "Monto Original", value: reportData.totalOriginalAmount },
          { label: "Pendiente", value: reportData.totalPendingAmount },
          { label: "Vencidas", value: reportData.overdueCount }
        );
        break;
      case ReportType.COMPREHENSIVE:
        metrics.push(
          {
            label: "Ingresos",
            value: reportData.financialSummary?.totalIncome,
          },
          {
            label: "Gastos",
            value: reportData.financialSummary?.totalExpenses,
          },
          { label: "Balance", value: reportData.financialSummary?.netBalance },
          {
            label: "Tasa de Ahorro",
            value: `${reportData.financialSummary?.savingsRate?.toFixed(1)}%`,
          }
        );
        break;
      default:
        // Para reportes de metas
        metrics.push(
          { label: "Total Metas", value: reportData.totalGoals },
          { label: "Completadas", value: reportData.completedGoals },
          { label: "En Progreso", value: reportData.inProgressGoals },
          {
            label: "Progreso General",
            value: `${reportData.overallProgress?.toFixed(1)}%`,
          }
        );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="text-sm text-muted-foreground">{metric.label}</div>
            <div className="text-2xl font-bold">
              {typeof metric.value === "number"
                ? new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  }).format(metric.value)
                : metric.value || "N/A"}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Función para renderizar tabla de detalles
  const renderDetailTable = () => {
    if (!reportData) return null;

    let tableData = [];
    let headers = [];

    switch (reportType) {
      case ReportType.EXPENSE:
      case ReportType.INCOME:
        if (reportData.topCategories) {
          headers = ["Categoría", "Monto", "Transacciones", "Porcentaje"];
          tableData = reportData.topCategories
            .slice(0, 10)
            .map((category: any) => [
              category.categoryName,
              new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(category.totalAmount),
              category.transactionCount,
              `${category.percentage.toFixed(1)}%`,
            ]);
        }
        break;
      case ReportType.BUDGET:
        if (reportData.budgets) {
          headers = ["Categoría", "Límite", "Gastado", "Utilización", "Estado"];
          tableData = reportData.budgets
            .slice(0, 10)
            .map((budget: any) => [
              budget.categoryName,
              new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(budget.limitAmount),
              new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(budget.currentAmount),
              `${budget.utilization.toFixed(1)}%`,
              budget.status === "over"
                ? "Sobre Presupuesto"
                : budget.status === "at_limit"
                ? "En el Límite"
                : "Bajo Presupuesto",
            ]);
        }
        break;
      case ReportType.DEBT:
        if (reportData.debts) {
          headers = [
            "Descripción",
            "Monto Original",
            "Pendiente",
            "Pagado",
            "Estado",
          ];
          tableData = reportData.debts
            .slice(0, 10)
            .map((debt: any) => [
              debt.description,
              new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(debt.originalAmount),
              new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(debt.pendingAmount),
              new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(debt.paidAmount),
              debt.status === "overdue"
                ? "Vencida"
                : debt.status === "paid"
                ? "Pagada"
                : "Activa",
            ]);
        }
        break;
    }

    if (tableData.length === 0) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detalles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {headers.map((header, index) => (
                    <th key={index} className="text-left p-2 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row: any[], rowIndex: number) => (
                  <tr key={rowIndex} className="border-b">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando vista previa...</span>
        </CardContent>
      </Card>
    );
  }

  if (!reportData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground">
              No hay datos disponibles para mostrar
            </p>
            <Button variant="outline" onClick={onCancel} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vista Previa del Reporte</span>
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardTitle>
          <CardDescription>
            {REPORT_TYPE_LABELS[reportType]} - {period.label}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Métricas de resumen */}
          {renderSummaryMetrics()}

          {/* Gráficos según el tipo de reporte */}
          {(reportType === ReportType.EXPENSE ||
            reportType === ReportType.INCOME) && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryPieChart data={prepareCategoryData(reportData)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendencias Mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendLineChart data={prepareTrendData(reportData)} />
                </CardContent>
              </Card>
            </>
          )}

          {reportType === ReportType.BUDGET && (
            <Card>
              <CardHeader>
                <CardTitle>Utilización de Presupuestos</CardTitle>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart data={prepareMonthlyData(reportData)} />
              </CardContent>
            </Card>
          )}

          {reportType === ReportType.COMPREHENSIVE && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent>
                  <IncomeExpenseChart data={prepareMonthlyData(reportData)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryPieChart data={prepareCategoryData(reportData)} />
                </CardContent>
              </Card>
            </>
          )}

          {/* Tabla de detalles */}
          {renderDetailTable()}

          {/* Botones de acción */}
          <div className="flex gap-2 justify-end pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              onClick={() => onDownload(ReportFormat.PDF)}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => onDownload(ReportFormat.EXCEL)}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => onDownload(ReportFormat.CSV)}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

