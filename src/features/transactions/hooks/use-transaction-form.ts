import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Transaction,
  TransactionType,
} from "../interfaces/transactions.interface";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "./use-transactions-queries";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormData } from "@/hooks/use-form-data";
import { useEffect, useRef } from "react";
import { useCategories } from "@/features/categories/hooks/use-categories-queries";

const normalizeString = (str: string) => {
  return str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";
};

const transactionSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "El monto debe ser un número",
    })
    .min(0.01, "El monto debe ser mayor que 0"),
  type: z.nativeEnum(TransactionType),
  category_id: z.coerce.number().nullable().optional(),
  description: z.string().nullable().optional(),
  payment_method_id: z.coerce
    .number({
      invalid_type_error: "El método de pago debe ser un número",
    })
    .min(1, "El método de pago es requerido"),
  date: z.coerce.date({
    invalid_type_error: "La fecha debe ser válida",
  }),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface UseTransactionFormProps {
  transaction?: Transaction;
}

export const useTransactionForm = ({
  transaction,
}: UseTransactionFormProps) => {
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const { data } = useSession();
  const userId = data?.user?.id;
  const router = useRouter();
  const formData = useFormData();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const initialDataProcessedRef = useRef(false);

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: transaction?.amount || 0,
      type: transaction?.type || TransactionType.EXPENSE,
      category_id: transaction?.category_id || null,
      description: transaction?.description || "",
      payment_method_id: transaction?.payment_method_id || undefined,
      date: transaction?.date ? new Date(transaction.date) : new Date(),
    },
  });

  useEffect(() => {
    console.log('Initial form values:', form.getValues());
  }, []);

  useEffect(() => {
    if (!formData || initialDataProcessedRef.current) {
      return;
    }

    if (formData.amount) {
      form.setValue('amount', formData.amount, { shouldValidate: true });
    }

    if (formData.type) {
      const transactionType = formData.type.toUpperCase() as keyof typeof TransactionType;
      if (TransactionType[transactionType]) {
        form.setValue('type', TransactionType[transactionType], { shouldValidate: true });
      }
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

    if (formData.description) {
      form.setValue('description', formData.description, { shouldValidate: true });
    }

    if (formData.payment_method_id) {
      form.setValue('payment_method_id', formData.payment_method_id, { shouldValidate: true });
    }

    form.setValue('date', new Date(), { shouldValidate: true });
    
    initialDataProcessedRef.current = true;
  }, [formData, categories, form]);

  const onSubmit: SubmitHandler<TransactionForm> = async (data) => {
    const transactionData = {
      ...data,
      date: data.date.toISOString(),
    };

    if (transaction) {
      await updateTransaction.mutateAsync({
        id: transaction.id,
        transaction: transactionData,
      });
    } else {
      await createTransaction.mutateAsync({
        ...transactionData,
        user_id: Number(userId),
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
    isSubmitting: form.formState.isSubmitting,
    categories,
    isLoadingCategories,
    watch: form.watch,
  };
};
