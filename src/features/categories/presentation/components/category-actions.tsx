"use client";

import { Category } from "../../interfaces/categories.interface";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteCategory } from "../../hooks/use-categories-queries";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CategoryActionsProps {
  category: Category;
}

const CategoryActions = ({ category }: CategoryActionsProps) => {
  const router = useRouter();
  const deleteCategory = useDeleteCategory();

  const handleEdit = () => {
    router.push(`/management/categories/edit/${category.id}`);
  };

  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      try {
        await deleteCategory.mutateAsync(category.id);
      } catch {
        // La categoría podría estar en uso
        toast.error(
          "No se puede eliminar esta categoría porque está siendo utilizada en presupuestos"
        );
      }
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={handleEdit}
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0"
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Editar</span>
      </Button>
      <Button
        onClick={handleDelete}
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Eliminar</span>
      </Button>
    </div>
  );
};

export default CategoryActions;
