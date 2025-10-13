"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/format-currency";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";

interface CategoryExpense {
  category: string;
  categoryName?: string;
  total: number;
}

interface CategoryExpensesSummaryProps {
  expenses: CategoryExpense[];
  isLoading: boolean;
  showTopOnly?: boolean;
  maxItems?: number;
}

export function CategoryExpensesSummary({
  expenses,
  isLoading,
  showTopOnly = true,
  maxItems = 4,
}: CategoryExpensesSummaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Gastos por Categoría
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center min-h-[150px]">
            <LoadingSpinner className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por total descendente y tomar solo las primeras N
  const sortedExpenses = [...expenses]
    .filter((e) => e.total > 0) // Solo gastos positivos
    .sort((a, b) => b.total - a.total);

  const displayExpenses = showTopOnly
    ? sortedExpenses.slice(0, maxItems)
    : sortedExpenses;

  const totalExpenses = sortedExpenses.reduce((sum, e) => sum + e.total, 0);

  if (displayExpenses.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Gastos por Categoría
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No hay gastos registrados en este período
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Gastos por Categoría
          </CardTitle>
          {showTopOnly && sortedExpenses.length > maxItems && (
            <Link href="/management/transactions" passHref>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                Ver todos <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayExpenses.map((expense, index) => {
            const percentage = (expense.total / totalExpenses) * 100;

            return (
              <div key={expense.category || index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm">
                    {expense.categoryName || `Categoría ${expense.category}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(expense.total)}
                    </p>
                  </div>
                </div>
                <Progress
                  value={percentage}
                  className="h-2 bg-muted"
                  indicatorClassName="bg-primary"
                />
              </div>
            );
          })}

          {showTopOnly && sortedExpenses.length > maxItems && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground text-center">
                +{sortedExpenses.length - maxItems} categorías más
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
