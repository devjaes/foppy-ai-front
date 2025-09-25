"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Goal } from "../../interfaces/ goals.interface";
import { useUpdateGoalProgress } from "../../hooks/use-goals-queries";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Save } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface GoalProgressFormProps {
  goal: Goal;
}

const GoalProgressForm = ({ goal }: GoalProgressFormProps) => {
  const [amount, setAmount] = useState<number>(0);
  const { data } = useSession();
  const user = data?.user;
  const updateProgress = useUpdateGoalProgress();
  const router = useRouter();
  const progress = (goal.current_amount / goal.target_amount) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    await updateProgress.mutateAsync({
      goalId: goal.id,
      userId: Number(user.id),
      amount,
    });

    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{goal.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Progreso actual
          </span>
          <span className="font-bold">
            {formatCurrency(goal.current_amount)} /{" "}
            {formatCurrency(goal.target_amount)}
          </span>
        </div>
        <Progress value={progress} className="h-2 w-full" />
        <div className="text-right text-sm">
          {progress.toFixed(0)}% completado
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Cantidad a agregar
            </label>
            <Input
              id="amount"
              type="number"
              min={0}
              step="0.01"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
              required
            />
          </div>

          <div className="pt-2 flex justify-between">
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
              disabled={updateProgress.isPending || amount <= 0}
              className="flex items-center gap-1"
            >
              {updateProgress.isPending ? (
                <LoadingSpinner />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>Guardar Progreso</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalProgressForm;
