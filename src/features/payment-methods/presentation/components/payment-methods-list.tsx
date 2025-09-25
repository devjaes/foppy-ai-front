"use client";

import { PaymentMethod } from "../../interfaces/payment-methods.interface";
import { PaymentMethodCard } from "./payment-method-card";
import { EmptyState } from "@/components/empty-state";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
  deletingId?: number;
}

export function PaymentMethodsList({
  paymentMethods,
  onDelete,
  isDeleting = false,
  deletingId,
}: PaymentMethodsListProps) {
  if (paymentMethods.length === 0) {
    return (
      <EmptyState
        title="No tienes métodos de pago"
        description="Crea tu primer método de pago para empezar a registrar tus transacciones."
        action={
          <Link href="/management/payment-methods/create" passHref>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Crear método de pago
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {paymentMethods.map((paymentMethod) => (
        <PaymentMethodCard
          key={paymentMethod.id}
          paymentMethod={paymentMethod}
          onDelete={onDelete}
          isDeleting={isDeleting && deletingId === paymentMethod.id}
        />
      ))}
    </div>
  );
}
