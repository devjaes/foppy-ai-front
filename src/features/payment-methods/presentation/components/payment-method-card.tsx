"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PaymentMethod,
  PAYMENT_METHOD_TYPES,
} from "../../interfaces/payment-methods.interface";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export function PaymentMethodCard({
  paymentMethod,
  onDelete,
  isDeleting = false,
}: PaymentMethodCardProps) {
  const typeLabel =
    PAYMENT_METHOD_TYPES.find((type) => type.value === paymentMethod.type)
      ?.label || paymentMethod.type;

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{paymentMethod.name}</CardTitle>
          <Badge variant="outline">{typeLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {paymentMethod.last_four_digits && (
            <>
              <span className="text-muted-foreground">Últimos 4 dígitos:</span>
              <span className="text-right font-medium">
                {paymentMethod.last_four_digits}
              </span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2 pt-4">
        <Link
          href={`/management/payment-methods/edit/${paymentMethod.id}`}
          passHref
        >
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            <span>Editar</span>
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onDelete(paymentMethod.id)}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
            <span>{isDeleting ? "Eliminando..." : "Eliminar"}</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
