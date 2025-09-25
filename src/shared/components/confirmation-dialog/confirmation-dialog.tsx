import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  children?: React.ReactNode;
  triggerText?: string;
  confirmText?: string;
  cancelText?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  showTriggerButton?: boolean;
}

const ConfirmationDialog = ({
  onConfirm,
  title,
  description,
  children,
  triggerText = "Eliminar",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "outline",
  showTriggerButton = false,
}: ConfirmationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error("Error during confirmation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const TriggerContent =
    children ??
    (showTriggerButton ? (
      <Button variant={variant} disabled={isLoading}>
        {triggerText}
      </Button>
    ) : (
      triggerText
    ));

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{TriggerContent}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleConfirm}>
            {isLoading ? "Procesando..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
