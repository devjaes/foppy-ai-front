import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ReportType, ReportFilters } from "../interfaces/reports.interface";
import { PeriodRange } from "@/components/period-selector";
import { format } from "date-fns";

export const useReportPreview = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async ({
      type,
      filters,
    }: {
      type: ReportType;
      filters: ReportFilters;
    }) => {
      if (!userId) {
        throw new Error("Usuario no autenticado");
      }

      // Mock data for preview - in production this would call real services
      switch (type) {
        case ReportType.EXPENSE:
          return getMockExpenseData(filters);
        case ReportType.INCOME:
          return getMockIncomeData(filters);
        case ReportType.BUDGET:
          return getMockBudgetData(filters);
        case ReportType.DEBT:
          return getMockDebtData(filters);
        case ReportType.COMPREHENSIVE:
          return getMockComprehensiveData(filters);
        case ReportType.GOALS_BY_STATUS:
        case ReportType.GOALS_BY_CATEGORY:
        case ReportType.CONTRIBUTIONS_BY_GOAL:
        case ReportType.SAVINGS_COMPARISON:
        case ReportType.SAVINGS_SUMMARY:
          return getMockGoalsData(filters, type);
        default:
          throw new Error(`Tipo de reporte no soportado: ${type}`);
      }
    },
  });
};

// Mock data functions for preview
function getMockExpenseData(filters: ReportFilters) {
  return {
    totalExpenses: 2500.5,
    totalTransactions: 45,
    averageExpense: 55.57,
    topCategories: [
      {
        categoryId: "1",
        categoryName: "Alimentación",
        totalAmount: 800.0,
        transactionCount: 15,
        percentage: 32.0,
      },
      {
        categoryId: "2",
        categoryName: "Transporte",
        totalAmount: 400.5,
        transactionCount: 8,
        percentage: 16.0,
      },
      {
        categoryId: "3",
        categoryName: "Entretenimiento",
        totalAmount: 300.0,
        transactionCount: 5,
        percentage: 12.0,
      },
    ],
    monthlyTrends: [
      { month: "2024-01", totalAmount: 1200.0, transactionCount: 20 },
      { month: "2024-02", totalAmount: 1300.5, transactionCount: 25 },
    ],
    transactions: [],
  };
}

function getMockIncomeData(filters: ReportFilters) {
  return {
    totalIncome: 3500.0,
    totalTransactions: 8,
    averageIncome: 437.5,
    topCategories: [
      {
        categoryId: "1",
        categoryName: "Salario",
        totalAmount: 3000.0,
        transactionCount: 1,
        percentage: 85.7,
      },
      {
        categoryId: "2",
        categoryName: "Freelance",
        totalAmount: 500.0,
        transactionCount: 7,
        percentage: 14.3,
      },
    ],
    monthlyTrends: [
      { month: "2024-01", totalAmount: 3000.0, transactionCount: 1 },
      { month: "2024-02", totalAmount: 500.0, transactionCount: 7 },
    ],
    transactions: [],
  };
}

function getMockBudgetData(filters: ReportFilters) {
  return {
    totalBudgets: 5,
    totalBudgetAmount: 2000.0,
    totalSpent: 1500.75,
    averageUtilization: 75.0,
    overBudgetCount: 1,
    budgets: [
      {
        id: "1",
        categoryName: "Alimentación",
        limitAmount: 800.0,
        currentAmount: 750.0,
        utilization: 93.75,
        status: "under",
        month: "2024-01",
      },
      {
        id: "2",
        categoryName: "Transporte",
        limitAmount: 300.0,
        currentAmount: 320.0,
        utilization: 106.67,
        status: "over",
        month: "2024-01",
      },
    ],
    categoryBreakdown: [
      {
        categoryId: "1",
        categoryName: "Alimentación",
        totalBudget: 800.0,
        totalSpent: 750.0,
        utilization: 93.75,
        budgetCount: 1,
      },
      {
        categoryId: "2",
        categoryName: "Transporte",
        totalBudget: 300.0,
        totalSpent: 320.0,
        utilization: 106.67,
        budgetCount: 1,
      },
    ],
  };
}

function getMockDebtData(filters: ReportFilters) {
  return {
    totalDebts: 3,
    totalOriginalAmount: 5000.0,
    totalPendingAmount: 2500.0,
    totalPaidAmount: 2500.0,
    averageInterestRate: 12.5,
    overdueCount: 1,
    debts: [
      {
        id: "1",
        description: "Préstamo personal",
        originalAmount: 3000.0,
        pendingAmount: 1500.0,
        paidAmount: 1500.0,
        interestRate: 15.0,
        dueDate: new Date("2024-03-15"),
        status: "active",
      },
      {
        id: "2",
        description: "Tarjeta de crédito",
        originalAmount: 2000.0,
        pendingAmount: 1000.0,
        paidAmount: 1000.0,
        interestRate: 10.0,
        dueDate: new Date("2024-01-15"),
        status: "overdue",
        daysOverdue: 15,
      },
    ],
    paymentTrends: [],
  };
}

function getMockGoalsData(filters: ReportFilters, type: ReportType) {
  switch (type) {
    case ReportType.GOALS_BY_STATUS:
      return {
        completed: 2,
        expired: 1,
        inProgress: 3,
        total: 6,
        goals: [],
      };
    case ReportType.GOALS_BY_CATEGORY:
      return {
        categories: [],
      };
    case ReportType.SAVINGS_SUMMARY:
      return {
        totalGoals: 6,
        totalTargetAmount: 10000.0,
        totalCurrentAmount: 6500.0,
        overallProgress: 65.0,
        completedGoals: 2,
        expiredGoals: 1,
        inProgressGoals: 3,
        averageContribution: 500.0,
        lastContributionDate: new Date(),
        categoryBreakdown: [],
      };
    default:
      return {};
  }
}

function getMockComprehensiveData(filters: ReportFilters) {
  const expenseData = getMockExpenseData(filters);
  const incomeData = getMockIncomeData(filters);
  const budgetData = getMockBudgetData(filters);
  const goalsData = getMockGoalsData(filters, ReportType.SAVINGS_SUMMARY);

  const totalIncome = incomeData.totalIncome;
  const totalExpenses = expenseData.totalExpenses;
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

  return {
    period: {
      startDate: new Date(filters.startDate || new Date()),
      endDate: new Date(filters.endDate || new Date()),
      label: `${
        filters.startDate
          ? format(new Date(filters.startDate), "dd/MM/yyyy")
          : "Inicio"
      } - ${
        filters.endDate
          ? format(new Date(filters.endDate), "dd/MM/yyyy")
          : "Fin"
      }`,
    },
    financialSummary: {
      totalIncome,
      totalExpenses,
      netBalance,
      savingsRate: Math.round(savingsRate * 100) / 100,
    },
    goals: {
      totalGoals: goalsData.totalGoals || 0,
      completedGoals: goalsData.completedGoals || 0,
      inProgressGoals: goalsData.inProgressGoals || 0,
      totalTargetAmount: goalsData.totalTargetAmount || 0,
      totalCurrentAmount: goalsData.totalCurrentAmount || 0,
      overallProgress: Math.round((goalsData.overallProgress || 0) * 100) / 100,
    },
    budgets: {
      totalBudgets: budgetData.totalBudgets || 0,
      totalBudgetAmount: budgetData.totalBudgetAmount || 0,
      totalSpent: budgetData.totalSpent || 0,
      overBudgetCount: budgetData.overBudgetCount || 0,
    },
    debts: {
      totalDebts: 3,
      totalPendingAmount: 2500.0,
      totalPaidAmount: 2500.0,
      overdueCount: 1,
    },
    categoryBreakdown: [
      {
        categoryId: "1",
        categoryName: "Alimentación",
        income: 0,
        expenses: 800.0,
        netAmount: -800.0,
        budgetLimit: 800.0,
        budgetUtilization: 93.75,
      },
      {
        categoryId: "2",
        categoryName: "Transporte",
        income: 0,
        expenses: 400.5,
        netAmount: -400.5,
        budgetLimit: 300.0,
        budgetUtilization: 106.67,
      },
    ],
    monthlyTrends: [
      {
        month: "2024-01",
        income: 3000.0,
        expenses: 1200.0,
        balance: 1800.0,
        goalContributions: 500.0,
        debtPayments: 200.0,
      },
      {
        month: "2024-02",
        income: 500.0,
        expenses: 1300.5,
        balance: -800.5,
        goalContributions: 300.0,
        debtPayments: 150.0,
      },
    ],
  };
}
