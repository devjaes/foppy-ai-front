"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCategories } from "../../hooks/use-categories-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryActions from "../components/category-actions";
import { ContentLayout } from "@/core/layout/content/content-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function CategoriesView() {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();

  const handleCreateCategory = () => {
    router.push("/management/categories/create");
  };

  return (
    <ContentLayout title="Categorías">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestionar Categorías</h2>
          <Button
            onClick={handleCreateCategory}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Categoría</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner />
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      {category.description || "Sin descripción"}
                    </TableCell>
                    <TableCell className="text-right">
                      <CategoryActions category={category} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-primary/5 rounded-lg p-8 text-center shadow-sm">
            <p className="text-gray-500">No hay categorías definidas</p>
            <Button
              onClick={handleCreateCategory}
              variant="link"
              className="mt-2"
            >
              Crea tu primera categoría
            </Button>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
