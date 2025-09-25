"use client";

import { Transaction } from "../../interfaces/transactions.interface";
import { EmptyState } from "@/components/empty-state";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";
import { TransactionType } from "../../interfaces/transactions.interface";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No hay transacciones"
        description="Crea tu primera transacción para comenzar a registrar tus movimientos financieros"
        action={
          <Link href="/management/transactions/create" passHref>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Crear Transacción
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Lista de transacciones realizadas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Método de Pago</TableHead>
            <TableHead>Descripción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(new Date(transaction.date))}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    transaction.type === TransactionType.INCOME
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {transaction.type === TransactionType.INCOME
                    ? "Ingreso"
                    : "Gasto"}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                {transaction?.category?.name || "Sin categoría"}
              </TableCell>
              <TableCell>
                {transaction.payment_method?.name || "Sin método"}
                {transaction.payment_method?.last_four_digits
                  ? ` (${transaction.payment_method.last_four_digits})`
                  : ""}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
