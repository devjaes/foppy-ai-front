"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  TransactionsSummaryReportData,
  ExpensesByCategoryReportData,
  MonthlyTrendReportData,
  BudgetPerformanceReportData,
  FinancialOverviewReportData,
} from "../../interfaces/reports.interface";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
  Minus,
} from "lucide-react";

export function TransactionsSummaryViewer({ data }: { data: TransactionsSummaryReportData }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(data.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">{data.incomeCount} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(data.totalExpense)}</div>
            <p className="text-xs text-muted-foreground">{data.expenseCount} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(data.netBalance)}
            </div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.transactionCount}</div>
            <p className="text-xs text-muted-foreground">Avg income: {formatCurrency(data.averageIncome)}</p>
          </CardContent>
        </Card>
      </div>

      {(data.topIncomeCategory || data.topExpenseCategory) && (
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topIncomeCategory && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Top Income</p>
                  <p className="text-xs text-muted-foreground">{data.topIncomeCategory.name}</p>
                </div>
                <p className="text-lg font-bold text-green-600">{formatCurrency(data.topIncomeCategory.amount)}</p>
              </div>
            )}
            {data.topExpenseCategory && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Top Expense</p>
                  <p className="text-xs text-muted-foreground">{data.topExpenseCategory.name}</p>
                </div>
                <p className="text-lg font-bold text-red-600">{formatCurrency(data.topExpenseCategory.amount)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={transaction.type === "INCOME" ? "default" : "destructive"}>
                      {transaction.type}
                    </Badge>
                    <span className="text-sm">{transaction.category || "N/A"}</span>
                  </div>
                  {transaction.description && (
                    <p className="text-xs text-muted-foreground">{transaction.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
                <span className={`font-semibold ${transaction.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "INCOME" ? "+" : "-"}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function ExpensesByCategoryViewer({ data }: { data: ExpensesByCategoryReportData }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(data.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">{data.categoryCount} categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <PieChart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.categoryCount}</div>
            <p className="text-xs text-muted-foreground">Distribution of expenses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.transactionCount} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatCurrency(category.amount)}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function MonthlyTrendViewer({ data }: { data: MonthlyTrendReportData }) {
  const getTrendIcon = () => {
    switch (data.trend) {
      case "increasing":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "decreasing":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case "stable":
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendBadge = () => {
    const variants = {
      increasing: "default" as const,
      decreasing: "destructive" as const,
      stable: "secondary" as const,
    };

    return (
      <Badge variant={variants[data.trend]}>
        {data.trend.toUpperCase()}
      </Badge>
    );
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly Income</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(data.averageMonthlyIncome)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly Expense</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(data.averageMonthlyExpense)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            {getTrendIcon()}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getTrendBadge()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.months.map((month) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{month.month}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{month.transactionCount} transactions</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Income</p>
                    <p className="font-semibold text-green-600">{formatCurrency(month.income)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expense</p>
                    <p className="font-semibold text-red-600">{formatCurrency(month.expense)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className={`font-semibold ${month.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(month.balance)}
                    </p>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function BudgetPerformanceViewer({ data }: { data: BudgetPerformanceReportData }) {
  const getStatusBadge = (status: string) => {
    const variants = {
      exceeded: "destructive" as const,
      warning: "secondary" as const,
      good: "default" as const,
    };

    const labels = {
      exceeded: "Exceeded",
      warning: "Warning",
      good: "Good",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "exceeded":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "good":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgets</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalBudgets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exceeded</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.exceededCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data.warningCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Good</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.goodCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.budgets.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{budget.categoryName}</p>
                    <p className="text-xs text-muted-foreground">{budget.month}</p>
                  </div>
                  {getStatusBadge(budget.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatCurrency(budget.currentAmount)} / {formatCurrency(budget.limitAmount)}
                  </span>
                  <span className={`font-semibold ${getStatusColor(budget.status)}`}>
                    {budget.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(budget.percentage, 100)} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function FinancialOverviewViewer({ data }: { data: FinancialOverviewReportData }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Period</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {formatDate(data.period.startDate)} - {formatDate(data.period.endDate)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(data.summary.totalIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expense</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(data.summary.totalExpense)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p className={`text-xl font-bold ${data.summary.netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(data.summary.netBalance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Savings Rate</p>
              <p className="text-xl font-bold text-purple-600">{data.summary.savingsRate.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Goals Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{data.goals.total}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-bold text-green-600">{data.goals.completed}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">In Progress</p>
                <p className="text-lg font-bold text-yellow-600">{data.goals.inProgress}</p>
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-semibold">{data.goals.overallProgress.toFixed(1)}%</span>
              </div>
              <Progress value={data.goals.overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {formatCurrency(data.goals.totalSaved)} / {formatCurrency(data.goals.totalTarget)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budgets Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Budgets</p>
                <p className="text-lg font-bold">{data.budgets.total}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Exceeded</p>
                <p className="text-lg font-bold text-red-600">{data.budgets.exceeded}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Average Utilization</p>
              <div className="flex items-center gap-2">
                <Progress value={data.budgets.averageUtilization} className="h-2 flex-1" />
                <span className="text-sm font-semibold">{data.budgets.averageUtilization.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {data.topCategories.expenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topCategories.expenses.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{category.name}</p>
                    <Progress value={category.percentage} className="h-2 mt-1" />
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-bold text-red-600">{formatCurrency(category.amount)}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.topCategories.income.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Income Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topCategories.income.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{category.name}</p>
                    <Progress value={category.percentage} className="h-2 mt-1" />
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-bold text-green-600">{formatCurrency(category.amount)}</p>
                    <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
