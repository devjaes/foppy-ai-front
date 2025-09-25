import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Goal } from "../interfaces/ goals.interface";
import { useCreateGoal, useUpdateGoal } from "./use-goals-queries";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormData } from "@/hooks/use-form-data";
import { useEffect, useRef } from "react";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";

const normalizeString = (str: string) => {
  return str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";
};

const goalSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    current_amount: z.coerce
      .number({
        invalid_type_error: "La cantidad actual debe ser un número",
      })
      .min(0, "La cantidad actual debe ser mayor que 0"),
    target_amount: z.coerce
      .number({
        invalid_type_error: "La cantidad objetivo debe ser un número",
      })
      .min(0, "La cantidad objetivo debe ser mayor que 0"),
    end_date: z.coerce
      .date({
        invalid_type_error: "La fecha de fin debe ser una fecha válida",
      })
      .min(new Date(), "La fecha de fin debe ser mayor que la fecha actual"),
    contribution_frequency: z.coerce.number({
      invalid_type_error: "La frecuencia de contribución debe ser un número",
    }),
    category_id: z.coerce.number({
      invalid_type_error: "La categoría debe ser un número",
    }),
  })
  .refine((data) => data.target_amount > data.current_amount, {
    path: ["target_amount"],
    message: "La cantidad objetivo debe ser mayor que la cantidad actual",
  });

type GoalForm = z.infer<typeof goalSchema>;

interface UseGoalFormProps {
  goal?: Goal;
}

export const useGoalForm = ({ goal }: UseGoalFormProps) => {
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const { data } = useSession();
  const user = data?.user;
  const router = useRouter();
  const formData = useFormData();
  const { data: categories } = useCategories();
  const initialDataProcessedRef = useRef(false);

  const form = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: goal?.name || "",
      current_amount: goal?.current_amount || 0,
      target_amount: goal?.target_amount || 0,
      end_date: goal?.end_date ? new Date(goal.end_date) : new Date(),
      category_id: goal?.category?.id || undefined,
      contribution_frequency: goal?.contribution_frequency || 1,
    },
  });

  useEffect(() => {
    console.log('Initial goal form values:', form.getValues());
  }, []);

  useEffect(() => {
    if (!formData || initialDataProcessedRef.current) {
      return;
    }

    if (formData.name) {
      form.setValue('name', formData.name, { shouldValidate: true });
    }

    if (formData.current_amount) {
      form.setValue('current_amount', formData.current_amount, { shouldValidate: true });
    }

    if (formData.target_amount) {
      form.setValue('target_amount', formData.target_amount, { shouldValidate: true });
    }

    if (formData.end_date) {
      form.setValue('end_date', new Date(formData.end_date), { shouldValidate: true });
    }

    if (formData.category && categories?.length) {
      const categoryToFind = normalizeString(formData.category);
      const foundCategory = categories.find(category => 
        normalizeString(category.name) === categoryToFind
      );
      
      if (foundCategory) {
        form.setValue('category_id', foundCategory.id, { shouldValidate: true });
      }
    }

    if (formData.contribution_frecuency) {
      form.setValue('contribution_frequency', formData.contribution_frecuency, { shouldValidate: true });
    }

    initialDataProcessedRef.current = true;
  }, [formData, categories, form]);

  const onSubmit: SubmitHandler<GoalForm> = async (data) => {
    const goalData = {
      ...data,
      end_date: data.end_date.toISOString(),
    };

    if (goal) {
      await updateGoal.mutateAsync({
        id: goal.id,
        goal: goalData,
      });
    } else {
      await createGoal.mutateAsync({
        ...goalData,
        user_id: Number(user?.id),
      });
    }
  };

  const onCancel = () => {
    form.reset();
    router.back();
  };

  return {
    form,
    onSubmit,
    onCancel,
    isSubmiting: form.formState.isSubmitting,
    categories,
    watch: form.watch,
  };
};
