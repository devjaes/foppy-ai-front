import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services/category.datasource";
import {
  CategoryCreate,
  CategoryUpdate,
} from "../interfaces/categories.interface";
import { toast } from "sonner";

// Claves para las queries
const CATEGORIES_KEY = "categories";
const categoryKeys = {
  all: () => [CATEGORIES_KEY],
  lists: () => [...categoryKeys.all(), "list"],
  list: (filters: Record<string, unknown>) => [
    ...categoryKeys.lists(),
    { filters },
  ],
  details: () => [...categoryKeys.all(), "detail"],
  detail: (id: number) => [...categoryKeys.details(), id],
};

// Hook para obtener todas las categorías
export const useCategories = () => {
  const categoryService = CategoryService.getInstance();

  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryService.getCategories(),
  });
};

// Hook para obtener una categoría por ID
export const useCategory = (id: number) => {
  const categoryService = CategoryService.getInstance();

  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
  });
};

// Hook para crear una categoría
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const categoryService = CategoryService.getInstance();

  return useMutation({
    mutationFn: (data: CategoryCreate) => {
      return categoryService.createCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Categoría creada exitosamente");
    },
  });
};

// Hook para actualizar una categoría
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const categoryService = CategoryService.getInstance();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) => {
      return categoryService.updateCategory(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Categoría actualizada exitosamente");
    },
  });
};

// Hook para eliminar una categoría
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const categoryService = CategoryService.getInstance();

  return useMutation({
    mutationFn: (id: number) => {
      return categoryService.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Categoría eliminada exitosamente");
    },
  });
};
