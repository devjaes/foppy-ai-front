"use client";

import { useState } from "react";
import { ContentLayout } from "@/core/layout/content/content-layout";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMonthlyBalance } from "@/features/transactions/hooks/use-transactions-queries";
import {
  useFindMonthlyBudgets,
  useFindBudgetUsersById,
} from "@/features/budgets/hooks/use-budgets-queries";
import { useFindGoalUsersById } from "@/features/goals/hooks/use-goals-queries";
import { useFindDebtUserById } from "@/features/debts/hooks/use-debts-queries";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Wallet,
  Target,
  ChevronRight,
  TrendingUp,
  BarChart3,
  PiggyBank,
  DollarSign,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format-date";
import { CategoryExpensesSummary } from "@/features/transactions/presentation/components/category-expenses-summary";
import {
  useCategoryTotals,
  usePeriodBalance,
  useMonthlyTrends,
} from "@/features/transactions/hooks/use-transactions-queries";
import { startOfMonth, endOfMonth } from "date-fns";
import { PeriodSelector, type PeriodRange } from "@/components/period-selector";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";

export default function Page() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Estado para el período seleccionado
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodRange>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    type: "current-month",
    label: "Mes actual",
  });

  // Obtener datos para el dashboard (balance del período seleccionado)
  // Formato YYYY-MM-DD para el backend
  const startDateStr = format(selectedPeriod.startDate, "yyyy-MM-dd");
  const endDateStr = format(selectedPeriod.endDate, "yyyy-MM-dd");

  const { data: periodBalance, isLoading: isLoadingBalance } = usePeriodBalance(
    userId!,
    startDateStr,
    endDateStr
  );

  // Usar el período seleccionado para category totals
  const { data: categoryTotals = [], isLoading: isLoadingCategoryTotals } =
    useCategoryTotals(userId!, startDateStr, endDateStr);

  // Obtener presupuestos y filtrar por período
  const { data: allBudgets = [], isLoading: isLoadingBudgets } =
    useFindBudgetUsersById(userId!);

  // Filtrar presupuestos: mostrar los del rango de meses seleccionado
  const budgets = allBudgets.filter((budget) => {
    if (!budget.month) return false;
    const budgetDate = new Date(budget.month);
    return (
      budgetDate >= selectedPeriod.startDate &&
      budgetDate <= selectedPeriod.endDate
    );
  });

  // Obtener metas y filtrar por período
  const { data: allGoals = [], isLoading: isLoadingGoals } =
    useFindGoalUsersById(userId!);

  // Filtrar metas: mostrar si están activas O su fecha fin está en el rango
  const goals = allGoals.filter((goal) => {
    const isActive = goal.current_amount < goal.target_amount;
    const endDate = new Date(goal.end_date);
    const isInPeriod =
      endDate >= selectedPeriod.startDate && endDate <= selectedPeriod.endDate;
    return isActive || isInPeriod;
  });

  // Obtener deudas y filtrar por período
  const { data: allDebts = [], isLoading: isLoadingDebts } =
    useFindDebtUserById(userId!);

  // Filtrar deudas: mostrar si están pendientes O su vencimiento está en el rango
  const debts = allDebts.filter((debt) => {
    const isPending = debt.pending_amount > 0;
    const dueDate = new Date(debt.due_date);
    const isInPeriod =
      dueDate >= selectedPeriod.startDate && dueDate <= selectedPeriod.endDate;
    return isPending || isInPeriod;
  });

  // Obtener tendencias mensuales para gráficos
  const { data: monthlyTrends = [], isLoading: isLoadingTrends } =
    useMonthlyTrends(userId!);

  // Preparar datos para el Bar Chart (Ingresos vs Gastos)
  // Usar solo los meses del período seleccionado
  const barChartData = monthlyTrends
    .filter((trend) => {
      const trendDate = new Date(trend.month + "-01");
      return (
        trendDate >= selectedPeriod.startDate &&
        trendDate <= selectedPeriod.endDate
      );
    })
    .map((trend) => ({
      month: format(new Date(trend.month + "-01"), "MMM", { locale: es }),
      income: trend.income,
      expense: trend.expense,
    }));

  // Preparar datos para el Pie Chart (Distribución por Categorías)
  const totalExpenses = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);
  const pieChartData = categoryTotals
    .filter((cat) => cat.total > 0)
    .map((cat) => ({
      name: cat.categoryName || `Categoría ${cat.category}`,
      value: cat.total,
      percentage: (cat.total / totalExpenses) * 100,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 categorías

  // Preparar datos para el Line Chart (Tendencias - últimos 6 meses)
  const lineChartData = monthlyTrends.slice(-6).map((trend) => ({
    month: format(new Date(trend.month + "-01"), "MMM", { locale: es }),
    income: trend.income,
    expense: trend.expense,
  }));

  // Función para determinar el color de la barra de progreso
  const getProgressColor = (percentage: number, isInverse: boolean = false) => {
    if (isInverse) {
      if (percentage >= 100) return "bg-red-500";
      if (percentage >= 90) return "bg-yellow-500";
      if (percentage >= 75) return "bg-yellow-400";
      return "bg-green-500";
    } else {
      if (percentage >= 100) return "bg-green-500";
      if (percentage >= 75) return "bg-green-400";
      if (percentage >= 50) return "bg-yellow-400";
      return "bg-red-500";
    }
  };

  const isLoading =
    isLoadingBalance ||
    isLoadingBudgets ||
    isLoadingGoals ||
    isLoadingDebts ||
    isLoadingCategoryTotals ||
    isLoadingTrends;

  return (
    <ContentLayout title="Dashboard">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold">Dashboard Financiero</h1>
            <PeriodSelector
              value={selectedPeriod}
              onChange={setSelectedPeriod}
            />
          </div>

          {/* Resumen Financiero */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Resumen Financiero de {selectedPeriod.label}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-green-600">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Ingresos Totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {formatCurrency(periodBalance?.totalIncome || 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-red-600">
                    <Wallet className="mr-2 h-4 w-4" />
                    Gastos Totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {formatCurrency(periodBalance?.totalExpense || 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-blue-600">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Balance Neto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-2xl font-bold ${
                      (periodBalance?.balance || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(periodBalance?.balance || 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Gráficos */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Análisis Gráfico</h2>

            {/* Fila 1: Bar Chart e Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IncomeExpenseChart
                data={barChartData}
                isLoading={isLoadingTrends}
              />
              <CategoryPieChart
                data={pieChartData}
                isLoading={isLoadingCategoryTotals}
              />
            </div>

            {/* Fila 2: Line Chart (ancho completo) */}
            <TrendLineChart data={lineChartData} isLoading={isLoadingTrends} />
          </section>

          {/* Metas y Presupuestos */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Metas */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Target className="mr-2 h-4 w-4" />
                    Metas Financieras
                  </CardTitle>
                  <Link href="/management/goals" passHref>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      Ver todos <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {goals.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No hay metas configuradas
                  </p>
                ) : (
                  <div className="space-y-4">
                    {goals.slice(0, 3).map((goal) => {
                      const progressPercentage = Math.min(
                        100,
                        (goal.current_amount / goal.target_amount) * 100
                      );
                      const progressColor =
                        getProgressColor(progressPercentage);

                      return (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{goal.name}</p>
                            <p className="text-sm">
                              {formatCurrency(goal.current_amount)} /{" "}
                              {formatCurrency(goal.target_amount)}
                            </p>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className={`h-2 ${progressColor}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Presupuestos */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <PiggyBank className="mr-2 h-4 w-4" />
                    Presupuestos
                  </CardTitle>
                  <Link href="/management/budgets" passHref>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      Ver todos <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {budgets.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No hay presupuestos configurados
                  </p>
                ) : (
                  <div className="space-y-4">
                    {budgets.slice(0, 3).map((budget) => {
                      const progressPercentage = Math.min(
                        100,
                        (budget.current_amount / budget.limit_amount) * 100
                      );
                      const progressColor = getProgressColor(
                        progressPercentage,
                        true
                      );

                      return (
                        <div key={budget.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">
                              {budget.category?.name || "Sin categoría"}
                            </p>
                            <p className="text-sm">
                              {formatCurrency(budget.current_amount)} /{" "}
                              {formatCurrency(budget.limit_amount)}
                            </p>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className={`h-2 ${progressColor}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Deudas y Categorías */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deudas */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Deudas
                  </CardTitle>
                  <Link href="/management/debts" passHref>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      Ver todos <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {debts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No hay deudas registradas
                  </p>
                ) : (
                  <div className="space-y-4">
                    {debts.slice(0, 3).map((debt) => {
                      const amountPaid =
                        debt.original_amount - debt.pending_amount;
                      const progressPercentage = Math.min(
                        100,
                        (amountPaid / debt.original_amount) * 100
                      );
                      const progressColor =
                        getProgressColor(progressPercentage);

                      return (
                        <div key={debt.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{debt.description}</p>
                            <p className="text-sm">
                              {formatCurrency(debt.pending_amount)} pendiente
                            </p>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className={`h-2 ${progressColor}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gastos por Categoría */}
            <CategoryExpensesSummary
              expenses={categoryTotals}
              isLoading={isLoadingCategoryTotals}
              showTopOnly={true}
              maxItems={4}
            />
          </section>

          {/* Accesos Rápidos */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/management/transactions/create" passHref>
                <Button
                  className="w-full h-full flex flex-col gap-2 p-4"
                  variant="outline"
                >
                  <Wallet className="h-6 w-6" />
                  <span>Nueva Transacción</span>
                </Button>
              </Link>

              <Link href="/management/goals/create" passHref>
                <Button
                  className="w-full h-full flex flex-col gap-2 p-4"
                  variant="outline"
                >
                  <Target className="h-6 w-6" />
                  <span>Nueva Meta</span>
                </Button>
              </Link>

              <Link href="/management/budgets/create" passHref>
                <Button
                  className="w-full h-full flex flex-col gap-2 p-4"
                  variant="outline"
                >
                  <PiggyBank className="h-6 w-6" />
                  <span>Nuevo Presupuesto</span>
                </Button>
              </Link>

              <Link href="/management/debts/create" passHref>
                <Button
                  className="w-full h-full flex flex-col gap-2 p-4"
                  variant="outline"
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Nueva Deuda</span>
                </Button>
              </Link>
              <Link href="/management/reports/create" passHref>
                <Button
                  className="w-full h-full flex flex-col gap-2 p-4"
                  variant="outline"
                >
                  <FileText className="h-6 w-6" />
                  <span>Crear reporte</span>
                </Button>
              </Link>
              <Link
                href={{
                  pathname: "/management/reports/create",
                  query: {
                    startDate: format(selectedPeriod.startDate, "yyyy-MM-dd"),
                    endDate: format(selectedPeriod.endDate, "yyyy-MM-dd"),
                    type: selectedPeriod.type,
                    label: selectedPeriod.label,
                  },
                }}
                passHref
              >
                <Button
                  className="w-full h-full flex flex-col gap-2 p-4"
                  variant="default"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Reporte del Período</span>
                </Button>
              </Link>
            </div>
          </section>
        </div>
      )}
    </ContentLayout>
  );
}
