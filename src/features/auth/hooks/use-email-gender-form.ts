"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useAuthOperations } from "./use-auth-operations";

const schema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El email no es válido"),
});

type FormFields = z.infer<typeof schema>;

export function useEmailGenderForm() {
  const { forgotPasswordHandler } = useAuthOperations();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await forgotPasswordHandler(data);
  };

  return { onSubmit, methods, isSubmiting: methods.formState.isSubmitting };
}
