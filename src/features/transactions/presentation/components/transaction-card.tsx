"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Transaction,
  TransactionType,
  TRANSACTION_TYPES,
} from "../../interfaces/transactions.interface";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/lib/format-date";

interface TransactionCardProps {
  transaction: Transaction;
  category?: { id: number; name: string } | null;
  paymentMethod?: { id: number; name: string } | null;
}

export function TransactionCard({
  transaction,
  category,
  paymentMethod,
}: TransactionCardProps) {
  const typeLabel =
    TRANSACTION_TYPES.find((type) => type.value === transaction.type)?.label ||
    transaction.type;

  const isIncome = transaction.type === TransactionType.INCOME;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Badge variant={isIncome ? "secondary" : "destructive"}>
                {typeLabel}
              </Badge>
              <span>{formatCurrency(transaction.amount)}</span>
            </CardTitle>
            <CardDescription className="mt-1">
              {formatDate(new Date(transaction.date), "dd/MM/yyyy")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transaction.description && (
            <p className="text-sm">{transaction.description}</p>
          )}
          {category && (
            <p className="text-sm text-muted-foreground">
              Categoría: <span className="font-semibold">{category.name}</span>
            </p>
          )}
          {paymentMethod && (
            <p className="text-sm text-muted-foreground">
              Método de pago:{" "}
              <span className="font-semibold">{paymentMethod.name}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
