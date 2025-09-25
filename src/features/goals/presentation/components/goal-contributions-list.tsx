"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { useFindGoalContributions } from "../../hooks/use-goals-queries";
import { Goal } from "../../interfaces/ goals.interface";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GoalContributionsListProps {
  goal: Goal;
}

const GoalContributionsList = ({ goal }: GoalContributionsListProps) => {
  const { data: contributions = [], isLoading } = useFindGoalContributions(
    goal.id.toString()
  );

  if (isLoading) {
    return <LoadingSpinner className="mx-auto" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Contribuciones a la Meta</CardTitle>
      </CardHeader>
      <CardContent>
        {contributions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay contribuciones registradas para esta meta.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map((contribution) => (
                <TableRow key={contribution.id}>
                  <TableCell>
                    {formatDate(new Date(contribution.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(Number(contribution.amount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalContributionsList;
