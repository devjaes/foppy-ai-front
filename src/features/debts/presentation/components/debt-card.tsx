"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { Edit, DollarSign, Trash, Eye } from "lucide-react";
import { Debt } from "../../interfaces/debts.interface";
import { useRouter } from "next/navigation";
import { useDeleteDebt } from "../../hooks/use-debts-queries";
import { cn } from "@/lib/utils";
import { calculateDebtProgressStatus } from "../../utils/progress-utils";

interface DebtCardProps {
  debt: Debt;
}

export default function DebtCard({ debt }: DebtCardProps) {
  const router = useRouter();
  const deleteDebtMutation = useDeleteDebt();

  // Calcular el progreso y estado usando la función de utilidad
  const { progressColor, statusText, progressPercentage } =
    calculateDebtProgressStatus(debt);

  // Para mostrar en la UI
  const amountPaid = debt.original_amount - debt.pending_amount;

  const handleEdit = () => {
    router.push(`/management/debts/edit/${debt.id}`);
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta deuda?")) {
      deleteDebtMutation.mutate(debt.id);
    }
  };

  const handlePayment = () => {
    router.push(`/management/debts/pay/${debt.id}`);
  };

  const handleViewTransactions = () => {
    router.push(`/management/debts/transactions/${debt.id}`);
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{debt.description}</CardTitle>
          <Badge variant={debt.paid ? "outline" : "destructive"}>
            {debt.paid ? "Pagada" : "Pendiente"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Monto original:</span>
          <span className="text-right font-medium">
            {formatCurrency(debt.original_amount)}
          </span>

          <span className="text-muted-foreground">Monto pagado:</span>
          <span className="text-right font-medium">
            {formatCurrency(amountPaid)}
          </span>

          <span className="text-muted-foreground">Monto pendiente:</span>
          <span className="text-right font-medium">
            {formatCurrency(debt.pending_amount)}
          </span>
        </div>

        <div className="space-y-1">
          <Progress
            value={progressPercentage}
            className={cn("h-2 w-full", progressColor)}
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{statusText}</span>
            <span className="text-muted-foreground">
              {progressPercentage.toFixed(0)}% pagado
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Fecha de vencimiento:</span>
          <span className="text-right font-medium">
            {debt.due_date ? formatDate(new Date(debt.due_date)) : "N/A"}
          </span>

          {debt.category && (
            <>
              <span className="text-muted-foreground">Categoría:</span>
              <span className="text-right font-medium">
                {debt.category.name}
              </span>
            </>
          )}
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
        {!debt.paid && (
          <Button
            size="sm"
            variant="default"
            className="flex items-center gap-1"
            onClick={handlePayment}
          >
            <DollarSign className="h-4 w-4" />
            <span>Pagar</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
