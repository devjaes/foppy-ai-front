"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { useFindGoalTransactions } from "../../hooks/use-goals-queries";
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
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FolderIcon, Info } from "lucide-react";

interface GoalTransactionsListProps {
  goal: Goal;
}

export default function GoalTransactionsList({
  goal,
}: GoalTransactionsListProps) {
  const { data: transactions = [], isLoading } = useFindGoalTransactions(
    goal.id.toString()
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner className="mx-auto" />
      </div>
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">
          Transacciones de la Meta
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center">
            <Info className="h-8 w-8 mb-2 text-gray-400" />
            <p>No hay transacciones registradas para esta meta.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" /> Fecha
                  </div>
                </TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <FolderIcon className="h-4 w-4" /> Categoría
                  </div>
                </TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(new Date(transaction.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{transaction.description || "—"}</TableCell>
                  <TableCell>
                    {transaction.category?.name || "Sin categoría"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "INCOME"
                          ? "default"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {transaction.type === "INCOME" ? "Ingreso" : "Gasto"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
