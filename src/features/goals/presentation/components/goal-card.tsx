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
import { formatDate } from "@/lib/format-date";
import { Edit, Trash, DollarSign, Eye } from "lucide-react";
import { Goal } from "../../interfaces/ goals.interface";
import { useRouter } from "next/navigation";
import { useDeleteGoal } from "../../hooks/use-goals-queries";
import { cn } from "@/lib/utils";
import { calculateGoalProgressStatus } from "../../utils/progress-utils";

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const router = useRouter();
  const deleteGoal = useDeleteGoal();

  // Calcular el progreso y estado usando la función de utilidad
  const { progressColor, statusText, progressPercentage } =
    calculateGoalProgressStatus(goal);

  const handleEdit = () => {
    router.push(`/management/goals/edit/${goal.id}`);
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar esta meta?")) {
      await deleteGoal.mutateAsync(goal.id);
    }
  };

  const handleAddContribution = () => {
    router.push(`/management/goals/contribution/${goal.id}`);
  };

  const handleViewTransactions = () => {
    router.push(`/management/goals/transactions/${goal.id}`);
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{goal.name}</CardTitle>
          <span className="text-sm text-muted-foreground">
            Fecha límite: {formatDate(new Date(goal.end_date), "dd/MM/yyyy")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Progreso actual</span>
          <span className="text-right font-medium">
            {formatCurrency(goal.current_amount)} /{" "}
            {formatCurrency(goal.target_amount)}
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
              {progressPercentage.toFixed(0)}% completado
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
          onClick={handleAddContribution}
        >
          <DollarSign className="h-4 w-4" />
          <span>Contribuir</span>
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

export default GoalCard;
