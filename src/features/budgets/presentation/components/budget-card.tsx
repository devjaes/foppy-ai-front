"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format-currency";
import { DollarSign, Edit, Eye, Trash } from "lucide-react";
import { Budget } from "../../interfaces/budgets.interface";
import { useRouter } from "next/navigation";
import { useDeleteBudget } from "../../hooks/use-budgets-queries";
import { cn } from "@/lib/utils";
import { calculateBudgetProgressStatus } from "../../utils/progress-utils";

interface BudgetCardProps {
  budget: Budget;
}

const BudgetCard = ({ budget }: BudgetCardProps) => {
  const router = useRouter();
  const deleteBudget = useDeleteBudget();

  // Calcular el progreso y estado usando la función de utilidad
  const { progressColor, statusText, progressPercentage, isOverBudget } =
    calculateBudgetProgressStatus(budget);

  const handleEdit = () => {
    router.push(`/management/budgets/edit/${budget.id}`);
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar este presupuesto?")) {
      await deleteBudget.mutateAsync(budget.id);
    }
  };

  const handleViewTransactions = () => {
    router.push(`/management/budgets/transactions/${budget.id}`);
  };

  const handleAddTransaction = () => {
    router.push(`/management/budgets/transaction/${budget.id}`);
  };

  return (
    <Card
      className={`w-full shadow-md hover:shadow-lg transition-shadow ${
        isOverBudget ? "border-destructive" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{budget.category?.name}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {budget.month &&
              new Date(budget.month).toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Uso del presupuesto</span>
          <span
            className={`text-right font-medium ${
              isOverBudget ? "text-destructive" : ""
            }`}
          >
            {formatCurrency(budget.current_amount)} /{" "}
            {formatCurrency(budget.limit_amount)}
          </span>
        </div>

        <div className="space-y-1">
          <Progress
            value={progressPercentage}
            className={cn("h-2 w-full", progressColor)}
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{statusText}</span>
            <span
              className={`text-muted-foreground ${
                isOverBudget ? "text-destructive" : ""
              }`}
            >
              {progressPercentage.toFixed(0)}% utilizado
              {isOverBudget && " (Excedido)"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2 pt-4">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleViewTransactions}
        >
          <Eye className="h-4 w-4" />
          <span>Ver Transacciones</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleAddTransaction}
        >
          <DollarSign className="h-4 w-4" />
          <span>Añadir Transacción</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4" />
          <span>Editar</span>
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="flex items-center gap-1"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" />
          <span>Eliminar</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BudgetCard;
