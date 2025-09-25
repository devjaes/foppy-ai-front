"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBudgetAmountForm } from "../../hooks/use-budget-amount-form";
import { Budget } from "../../interfaces/budgets.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Save } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "date-fns";

interface BudgetAmountFormProps {
  budget: Budget;
}

const BudgetAmountForm = ({ budget }: BudgetAmountFormProps) => {
  const {
    amount,
    handleAmountChange,
    handleSubmit,
    handleCancel,
    isSubmitting,
  } = useBudgetAmountForm({ budget });

  const progress = Math.min(
    (budget.current_amount / budget.limit_amount) * 100,
    100
  );
  const isOverBudget = budget.current_amount > budget.limit_amount;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{formatDate(budget.month, "MMMM yyyy")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Uso del presupuesto
          </span>
          <span
            className={`font-bold ${isOverBudget ? "text-destructive" : ""}`}
          >
            {formatCurrency(budget.current_amount)} /{" "}
            {formatCurrency(budget.limit_amount)}
          </span>
        </div>
        <Progress
          value={progress}
          className={`h-2 w-full ${isOverBudget ? "bg-red-200" : ""}`}
        />
        <div
          className={`text-right text-sm ${
            isOverBudget ? "text-destructive" : ""
          }`}
        >
          {progress.toFixed(0)}% utilizado
          {isOverBudget && " (Excedido)"}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Cantidad a agregar al gasto
            </label>
            <Input
              id="amount"
              type="number"
              min={0}
              step="0.01"
              value={amount || ""}
              onChange={handleAmountChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || amount <= 0}
              className="flex items-center gap-1"
            >
              {isSubmitting ? <LoadingSpinner /> : <Save className="h-4 w-4" />}
              <span>Guardar Gasto</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BudgetAmountForm;
