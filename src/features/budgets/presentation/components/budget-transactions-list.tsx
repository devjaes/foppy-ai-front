"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { useFindBudgetTransactions } from "../../hooks/use-budgets-queries";
import { Budget } from "../../interfaces/budgets.interface";
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
import { CalendarIcon, CreditCard, Info } from "lucide-react";

interface BudgetTransactionsListProps {
  budget: Budget;
}

export default function BudgetTransactionsList({
  budget,
}: BudgetTransactionsListProps) {
  const { data: transactions = [], isLoading } = useFindBudgetTransactions(
    budget.id.toString()
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
          Transacciones del Presupuesto
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center">
            <Info className="h-8 w-8 mb-2 text-gray-400" />
            <p>No hay transacciones registradas para este presupuesto.</p>
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
                    <CreditCard className="h-4 w-4" /> Método de Pago
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
                    {transaction.payment_method?.name || "—"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(Number(transaction.amount))}
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
