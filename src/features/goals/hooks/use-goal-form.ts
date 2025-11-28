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
    contribution_amount: z.coerce.number({
      invalid_type_error: "La cantidad de contribución debe ser un número",
    }).optional(),
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
      contribution_amount: goal?.contribution_amount || undefined,
    },
  });

  useEffect(() => {
    console.log('Initial goal form values:', form.getValues());
  }, []);

  useEffect(() => {
    if (initialDataProcessedRef.current) {
      return;
    }

    const recommendationData = localStorage.getItem("recommendationAction");
    let dataToProcess = formData;

    if (recommendationData && !goal) {
      try {
        const parsedData = JSON.parse(recommendationData);
        dataToProcess = parsedData;
        localStorage.removeItem("recommendationAction");
        console.log("Pre-filling goal form from recommendation:", parsedData);
      } catch (error) {
        console.error("Error parsing recommendation data:", error);
      }
    }

    if (!dataToProcess) {
      return;
    }

    if (dataToProcess.name) {
      form.setValue('name', dataToProcess.name, { shouldValidate: true });
    }

    if (dataToProcess.current_amount) {
      form.setValue('current_amount', dataToProcess.current_amount, { shouldValidate: true });
    }

    if (dataToProcess.target_amount) {
      form.setValue('target_amount', dataToProcess.target_amount, { shouldValidate: true });
    }

    if (dataToProcess.end_date) {
      form.setValue('end_date', new Date(dataToProcess.end_date), { shouldValidate: true });
    }

    if (dataToProcess.category && categories?.length) {
      const categoryToFind = normalizeString(dataToProcess.category);
      const foundCategory = categories.find(category => 
        normalizeString(category.name) === categoryToFind
      );
      
      if (foundCategory) {
        form.setValue('category_id', foundCategory.id, { shouldValidate: true });
      }
    }

    if (dataToProcess.contribution_frecuency) {
      form.setValue('contribution_frequency', dataToProcess.contribution_frecuency, { shouldValidate: true });
    }

    if (dataToProcess.category_id) {
      form.setValue('category_id', dataToProcess.category_id, { shouldValidate: true });
    }

    if (dataToProcess.contribution_amount) {
      form.setValue('contribution_amount', dataToProcess.contribution_amount, { shouldValidate: true });
    }

    initialDataProcessedRef.current = true;
  }, [formData, categories, form, goal]);

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
