"use client";

import { useState } from "react";
import { ContentLayout } from "@/core/layout/content/content-layout";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useFindBudgetUsersById } from "@/features/budgets/hooks/use-budgets-queries";
import { useFindGoalUsersById } from "@/features/goals/hooks/use-goals-queries";
import { useFindDebtUserById } from "@/features/debts/hooks/use-debts-queries";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format-currency";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  useCategoryTotals,
  usePeriodBalance,
  useMonthlyTrends,
} from "@/features/transactions/hooks/use-transactions-queries";
import { startOfMonth, endOfMonth } from "date-fns";
import { PeriodSelector, type PeriodRange } from "@/components/period-selector";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { CategoryStatCard } from "@/components/ui/category-stat-card";
import { FilterPillGroup } from "@/components/ui/filter-pill-group";
import { VoiceInputButton } from "@/components/ui/voice-input-button";
import { cn } from "@/lib/utils";
import { useRecommendations } from "@/features/recommendations/hooks/use-recommendations";
import { RecommendationCard } from "@/features/recommendations/presentation/components/recommendation-card";

export default function Page() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodRange>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    type: "current-month",
    label: "Mes actual",
  });

  // Obtener datos para el dashboard (balance del período seleccionado)
  const startDateStr = format(selectedPeriod.startDate, "yyyy-MM-dd");
  const endDateStr = format(selectedPeriod.endDate, "yyyy-MM-dd");

  const { data: periodBalance, isLoading: isLoadingBalance } = usePeriodBalance(
    userId!,
    startDateStr,
    endDateStr
  );

  const { data: categoryTotals = [], isLoading: isLoadingCategoryTotals } =
    useCategoryTotals(userId!, startDateStr, endDateStr);

  const { data: allBudgets = [], isLoading: isLoadingBudgets } =
    useFindBudgetUsersById(userId!);

  const budgets = allBudgets.filter((budget) => {
    if (!budget.month) return false;
    const budgetDate = new Date(budget.month);
    return (
      budgetDate >= selectedPeriod.startDate &&
      budgetDate <= selectedPeriod.endDate
    );
  });

  const { data: allGoals = [], isLoading: isLoadingGoals } =
    useFindGoalUsersById(userId!);

  const goals = allGoals.filter((goal) => {
    const isActive = goal.current_amount < goal.target_amount;
    const endDate = new Date(goal.end_date);
    const isInPeriod =
      endDate >= selectedPeriod.startDate && endDate <= selectedPeriod.endDate;
    return isActive || isInPeriod;
  });

  const { data: allDebts = [], isLoading: isLoadingDebts } =
    useFindDebtUserById(userId!);

  const debts = allDebts.filter((debt) => {
    const isPending = debt.pending_amount > 0;
    const hasDueDate = debt.due_date !== undefined;
    if (!hasDueDate) return isPending;

    const dueDate = new Date(debt.due_date!);
    const isInPeriod =
      dueDate >= selectedPeriod.startDate && dueDate <= selectedPeriod.endDate;
    return isPending || isInPeriod;
  });

  const { data: monthlyTrends = [], isLoading: isLoadingTrends } =
    useMonthlyTrends(userId!);

  const { data: recommendations = [], isLoading: isLoadingRecommendations } =
    useRecommendations(userId);

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

  const totalExpenses = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);
  const pieChartData = categoryTotals
    .filter((cat) => cat.total > 0)
    .map((cat) => ({
      name: cat.categoryName || `Categoría ${cat.category}`,
      value: cat.total,
      percentage: (cat.total / totalExpenses) * 100,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const lineChartData = monthlyTrends.slice(-6).map((trend) => ({
    month: format(new Date(trend.month + "-01"), "MMM", { locale: es }),
    income: trend.income,
    expense: trend.expense,
  }));

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
    isLoadingCategoryTotals ||
    isLoadingTrends ||
    isLoadingRecommendations;

  return (
    <ContentLayout title="Dashboard">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="space-y-8 pb-24">
          {/* Monai-style Header */}
          <div className="pt-4 pb-2">
            <div className="flex justify-between items-start mb-6">
              <div className="text-sm font-medium text-muted-foreground">
                Total
              </div>
            </div>

            <div className="text-6xl font-bold tracking-tighter mb-6">
              {formatCurrency(periodBalance?.balance || 0).replace("$", "")}
              <span className="text-2xl text-muted-foreground font-normal ml-1">
                $
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <PeriodSelector
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                variant="pill"
              />
              <FilterPillGroup
                options={[{ value: "private", label: "Private list" }]}
                value="private"
                onChange={() => {}}
                placeholder="List"
              />
            </div>
          </div>

          {recommendations.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Recomendaciones para ti</h2>
              <div className="grid grid-cols-1 gap-4">
                {recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Category Stats Cards */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
            {categoryTotals.slice(0, 6).map((cat) => (
              <CategoryStatCard
                key={cat.category}
                icon={cat.categoryName ? cat.categoryName[0] : "📦"} // Fallback icon logic
                name={cat.categoryName || "Otros"}
                count={cat.count || 0}
                amount={cat.total}
              />
            ))}
            {categoryTotals.length === 0 && (
              <div className="text-sm text-muted-foreground italic px-2">
                No hay gastos en este período
              </div>
            )}
          </div>

          {/* Transaction List Preview (Simulated with recent activity) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                Actividad Reciente
              </h2>
            </div>

            {/* Charts Section - Collapsible or simplified */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg">Tendencia</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <TrendLineChart
                    data={lineChartData}
                    isLoading={isLoadingTrends}
                  />
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg">
                    Gastos por Categoría
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <CategoryPieChart
                    data={pieChartData}
                    isLoading={isLoadingCategoryTotals}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Goals & Budgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Metas</h2>
                <Link
                  href="/management/goals"
                  className="text-sm text-primary hover:underline"
                >
                  Ver todas
                </Link>
              </div>
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal) => {
                  const progressPercentage = Math.min(
                    100,
                    (goal.current_amount / goal.target_amount) * 100
                  );
                  return (
                    <div
                      key={goal.id}
                      className="bg-card p-4 rounded-2xl border border-border/50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                            {goal.category?.icon || "🎯"}
                          </div>
                          <div>
                            <div className="font-medium">{goal.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(goal.current_amount)} de{" "}
                              {formatCurrency(goal.target_amount)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold">
                          {Math.round(progressPercentage)}%
                        </div>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="h-2"
                        indicatorClassName={getProgressColor(
                          progressPercentage
                        )}
                      />
                    </div>
                  );
                })}
                {goals.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground bg-card/50 rounded-2xl border border-dashed">
                    No hay metas activas
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/management/goals/create">Crear meta</Link>
                    </Button>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Presupuestos</h2>
                <Link
                  href="/management/budgets"
                  className="text-sm text-primary hover:underline"
                >
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                {budgets.slice(0, 3).map((budget) => {
                  const progressPercentage = Math.min(
                    100,
                    (budget.current_amount / budget.limit_amount) * 100
                  );
                  return (
                    <div
                      key={budget.id}
                      className="bg-card p-4 rounded-2xl border border-border/50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-xl">
                            {budget.category?.icon || "💰"}
                          </div>
                          <div>
                            <div className="font-medium">
                              {budget.category?.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(budget.current_amount)} /{" "}
                              {formatCurrency(budget.limit_amount)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className={cn(
                          "h-2",
                          getProgressColor(progressPercentage, true).replace(
                            "bg-",
                            "text-"
                          )
                        )}
                        indicatorClassName={getProgressColor(
                          progressPercentage,
                          true
                        )}
                      />
                    </div>
                  );
                })}
                {budgets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground bg-card/50 rounded-2xl border border-dashed">
                    No hay presupuestos
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/management/budgets/create">
                        Crear presupuesto
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Floating Actions - Voice will navigate to create page */}
          <VoiceInputButton populateForm={false} />

          <div className="fixed bottom-6 left-6 z-40">
            {/* Additional actions could go here */}
          </div>
        </div>
      )}
    </ContentLayout>
  );
}
