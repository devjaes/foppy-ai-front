"use client";

import { ContentLayout } from "@/core/layout/content/content-layout";
import { useFindUserPaymentMethods } from "../../hooks/use-payment-methods-queries";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PaymentMethodsList } from "../components/payment-methods-list";
import { useDeletePaymentMethod } from "../../hooks/use-payment-methods-queries";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function PaymentMethodsView() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: paymentMethods = [], isLoading } = useFindUserPaymentMethods(
    session?.user?.id?.toString() || ""
  );
  const deletePaymentMethod = useDeletePaymentMethod();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreatePaymentMethod = () => {
    router.push("/management/payment-methods/create");
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este método de pago?")) {
      setDeletingId(id);
      await deletePaymentMethod.mutateAsync(id);
      setDeletingId(null);
    }
  };

  return (
    <ContentLayout title="Métodos de Pago">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tus Métodos de Pago</h2>
          <Button
            onClick={handleCreatePaymentMethod}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Método de Pago</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <PaymentMethodsList
            paymentMethods={paymentMethods}
            onDelete={handleDelete}
            isDeleting={!!deletingId}
            deletingId={deletingId || undefined}
          />
        )}
      </div>
    </ContentLayout>
  );
}
