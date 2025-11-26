import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Category } from "../interfaces/categories.interface";
import { useCreateCategory, useUpdateCategory } from "./use-categories-queries";

const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface UseCategoryFormProps {
  category?: Category;
}

export const useCategoryForm = ({ category }: UseCategoryFormProps = {}) => {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      icon: category?.icon || "📁",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, data });
      } else {
        await createCategory.mutateAsync(data);
      }
      router.back();
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };

  const onCancel = () => {
    router.back();
  };

  return {
    form,
    onSubmit,
    onCancel,
    isSubmitting: createCategory.isPending || updateCategory.isPending,
  };
};
